import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'


export function useServerActions ({userId, userName, lobbyId, endGame}) {
    const [players, setPlayers] = useState([])
      const [board, setBoard] = useState(
      Array(9).fill({ piece: null, userId: null })
    )
  const socketRef = useRef(null)
  const turn = useRef(null)
  const gameStatus = useRef(true)
  const server = import.meta.env.VITE_SERVER

  console.log(userId)
    useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(server, {
        auth: {
          userId,
          userName,
          lobbyId,
        },
        reconnection: false,
      })
    }

    socketRef.current.on('connect', () => {
      console.log('Socket conectado', socketRef.current.id)
    })

    socketRef.current.on('gameConfig', ({nextTurn, activePlayers, readyToPlay, statusMsg }) => {
      turn.current = nextTurn
      gameStatus.current = {
        readyToPlay, statusMsg
      }
      setPlayers(activePlayers)
    })

    socketRef.current.on(
      'updateBoard',
      ({ position, piece, userId, playerTurn }) => {
        turn.current = playerTurn
        setBoard((prev) => {
          const newBoard = [...prev]
          newBoard[position] = { piece, userId }

          return newBoard
        })
      }
    )

    socketRef.current.on("setWinner", (winner) => {
      toast.success(`El ganador es ${winner.name}`)
      endGame()
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

    return {board,socketRef, players, gameStatus: {...gameStatus.current}, turn}
}