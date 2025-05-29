import { createServer } from 'node:http'
import express, { json } from 'express'
import cors from 'cors'
import { Lobby, User } from './utils/Entities.js'
import { socket } from './socket.js'

const lobbies = []

const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const { io } = socket({ lobbies, server })

lobbies.push(new Lobby('uzhfvi'))

app.use(cors())
app.use(json())

app.post('/createLobby', (req, res) => {
  const newLobby = new Lobby(Math.random().toString(36).substring(2, 8))
  lobbies.push(newLobby)
  res.status(201).json({ lobbyId: newLobby.id })
})

app.post('/joinLobby/:id', (req, res) => {
  const { id: lobbyId } = req.params
  const { name, id } = req.body

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

  lobbies[lobbyIndex].addPlayer(new User(name, id))

  res.status(200).json({ lobbyId, user: { name, id } })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
