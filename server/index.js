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

if (process.env.NODE_ENV !== 'production') {
  lobbies.push(new Lobby('uzhfvi'))
}

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(json())

app.post('/createLobby', (req, res) => {
  const newLobby = new Lobby(Math.random().toString(36).substring(2, 8))
  lobbies.push(newLobby)
  res.status(201).json({ lobbyId: newLobby.id })
})

app.post('/joinLobby/:id', (req, res) => {
  const { id: lobbyId } = req.params
  const { name, id } = req.body

  const lobbyIndex = lobbies.findIndex((lobby) => lobby.id === lobbyId)

  if (lobbyIndex === -1) {
    res.status(404).json({ msg: 'Lobby not found' })
    return
  }

  const currentLobbyPlayers = lobbies[lobbyIndex].players

  const wasUserInLobby = currentLobbyPlayers.find((player) => player.id === id)

  if (wasUserInLobby) {
    res.status(200).json({ lobbyId })
    return
  }

  if (currentLobbyPlayers.length === 2) {
    res.status(403).json({ msg: 'The lobby is full. And just users that were in lobby can re-join ' })
    return
  }

  const isUserInLobby = currentLobbyPlayers.find(
    (player) => player.id === lobbyId
  )

  if (isUserInLobby) {
    console.log('user exist')
    return
  }

  lobbies[lobbyIndex].addPlayer(new User(name, id))

  res.status(201).json({ lobbyId })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
