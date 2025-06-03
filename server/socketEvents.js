export function socketEvents ({ io, lobbies, server }) {
  io.on('connection', async (socket) => {
    const { userId, lobbyId } = socket.handshake.auth

    const currentLobby = lobbies.find(lobby => lobby.id === lobbyId)

    if (!currentLobby) return

    const usersInLobby = await getUsersAmountOnRoom(io, lobbyId)

    if (usersInLobby === 2) return

    socket.join(lobbyId)

    if (await getUsersAmountOnRoom(io, lobbyId) === 1) {
      io.to(lobbyId).emit('gameConfig', {
        nextTurn: null,
        activePlayers: currentLobby.players,
        statusMsg: 'Waiting for the oponet',
        readyToPlay: false
      })
    } else {
      io.to(lobbyId).emit('gameConfig', {
        nextTurn: currentLobby.playerTurn.id,
        activePlayers: currentLobby.players,
        statusMsg: 'Game can start',
        readyToPlay: true,
        board: currentLobby.board
      })
    }

    socket.on(`move:${lobbyId}`, (position) => {
      const { piece } = currentLobby.playerTurn
      currentLobby.updateBoard({ position })
      io.to(lobbyId).emit('updateBoard', { position, piece, userId, playerTurn: currentLobby.playerTurn.id })
    })

    socket.on(`${lobbyId}:winner`, (id) => {
      const winner = currentLobby.players.find(player => player.id === id)

      io.to(lobbyId).emit('setWinner', winner)
    })

    socket.on(`${lobbyId}:rematch`, (rematchResponse) => {
      const hasUserAlreadyResponded = currentLobby.rematch.find(({ userId: id }) => id === userId)

      if (!rematchResponse) {
        io.to(lobbyId).emit('endGame')
        return
      }

      if (hasUserAlreadyResponded) return

      currentLobby.rematch.push({ userId, response: rematchResponse })

      const isRematchReady = currentLobby.rematch.every(({ response }) => response) && currentLobby.rematch.length === 2

      if (isRematchReady) {
        currentLobby.resetGame()
        io.to(lobbyId).emit('gameConfig', {
          nextTurn: currentLobby.playerTurn.id,
          activePlayers: currentLobby.players,
          statusMsg: 'Rematch accepted',
          readyToPlay: true,
          board: currentLobby.board,
          isRematch: true
        })
      }
    })
    socket.on('disconnect', async () => {
      const lobbyIndex = lobbies.findIndex(lobby => lobby.id === currentLobby.id)

      if (await getUsersAmountOnRoom(io, lobbyId) === 0) {
        // remove lobby from lobbies if no users are left
        if (lobbyIndex !== -1) {
          lobbies.splice(lobbyIndex, 1)
        }
      }
    })

    return { io }
  })

  const getUsersAmountOnRoom = async (io, lobbyId) => {
    return await io.in(lobbyId).fetchSockets().then(sockets => {
      return sockets.length
    })
  }
}
