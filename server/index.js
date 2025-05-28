import { createServer } from 'node:http'
import { Server } from 'socket.io'
import express, { json } from 'express'
import cors from 'cors'
import { Lobby } from './utils/Lobby.js'

const PORT = 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

const lobbies = []
lobbies.push(new Lobby('uzhfvi'))

const getUsersAmountOnRoom = async (io, lobbyId) => {
  return await io.in(lobbyId).fetchSockets().then(sockets => {
    return sockets.length
  })
}

io.on('connection', async (socket) => {
  const { user, id: userId, lobbyId } = socket.handshake.auth
  console.log('User:', userId, 'has connected')

  const currentLobby = lobbies.find(lobby => lobby.id === lobbyId)

  if (!currentLobby) {
    console.log('That lobby does not exits')
    return
  }

  const usersInLobby = await getUsersAmountOnRoom(io, lobbyId)

  if (usersInLobby === 2) {
    console.log('Lobby is full')
    return
  }
  socket.join(lobbyId)

  if (await getUsersAmountOnRoom(io, lobbyId) !== 2) {
    console.log('Cant start the game')
  }

  io.to(lobbyId).emit('gameConfig', currentLobby.playerTurn.id)

  socket.on(`move:${lobbyId}`, (position) => {
    const { piece } = currentLobby.playerTurn
    currentLobby.updateBoard({ position })
    console.log(currentLobby.playerTurn)
    io.to(lobbyId).emit('updateBoard', { position, piece, userId, playerTurn: currentLobby.playerTurn.id })
  })

  socket.on('disconnect', () => {
    const userIndex = currentLobby.players.findIndex(player => player.id === userId)
    if (userIndex !== -1) {
      currentLobby.players.splice(userIndex, 1)
      currentLobby.playerTurn = null
    }
    console.log('User has left')
  })
})

app.use(cors())
app.use(json())

app.post('/createLobby', (req, res) => {
  const newLobby = new Lobby(Math.random().toString(36).substring(2, 8))
  lobbies.push(newLobby)
  res.status(201).json({ lobbyId: newLobby.id })
})

app.post('/joinLobby/:id', (req, res) => {
  const { id: lobbyId } = req.params
  const { userName: name, userId: id } = req.body

  const lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyId)

  if (lobbyIndex === -1) {
    res.status(404).json({ msg: 'Lobby not found' })
    return
  }

  const currentLobbyPlayers = lobbies[lobbyIndex].players

  if (currentLobbyPlayers.length === 2) return

  const isUserInLobby = currentLobbyPlayers.find(player => player.id === lobbyId)

  if (isUserInLobby) {
    console.log('user exist')
    return
  }

  lobbies[lobbyIndex].addPlayer({ name, id })
  console.log(currentLobbyPlayers)

  res.status(200).json({ lobbyId })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
