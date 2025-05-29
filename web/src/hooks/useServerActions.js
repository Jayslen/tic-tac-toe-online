import { useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'


export function useServerActions ({id, userName, lobbyId}) {
    const [players, setPlayers] = useState([])
      const [board, setBoard] = useState(
      Array(9).fill({ piece: null, userId: null })
    )
  const socketRef = useRef(null)
  const turn = useRef(null)
  const gameStarted = useRef(true)

    useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000', {
        auth: {
          id,
          userName,
          lobbyId,
        },
        reconnection: false,
      })
    }

    socketRef.current.on('connect', () => {
      console.log('Socket conectado', socketRef.current.id)
    })

    socketRef.current.on('gameConfig', ({nextTurn, readyToPlay, activePlayers}) => {
      turn.current = nextTurn
      gameStarted.current = readyToPlay
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
      alert(`el ganador es ${winner.id} ${winner.name}`)
    })

    socketRef.current.on('setWinner', (user) => {
      console.log(user)
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

    return {board,socketRef, players, gameStarted, turn}
}