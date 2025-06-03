import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'


export function useServerActions ({userId, userName, lobbyId, endGame}) {
    const [players, setPlayers] = useState([])
      const [board, setBoard] = useState(
      Array(9).fill({ piece: null, userId: null })
    )
  const [isGameFinished, setIsGameFinished] = useState(false)
  const socketRef = useRef(null)
  const turn = useRef(null)
  const gameStatus = useRef(true)
  const server = import.meta.env.VITE_SERVER

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

    socketRef.current.on('gameConfig', ({nextTurn, activePlayers, readyToPlay, statusMsg, board, isRematch }) => {
      turn.current = nextTurn
      if(isRematch) {
        toast.success(statusMsg)
        setBoard(board)
        setIsGameFinished(false)
        return
      }
      gameStatus.current = {
        readyToPlay, statusMsg
      }
      setPlayers(activePlayers)

      if(board) {
        setBoard(board)
      }
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
      setIsGameFinished(winner)
      // toast.success(`El ganador es ${winner.name}`)
      // endGame()
    })

    socketRef.current.on('endGame', () => {
      toast.error('No rematch was requested')
      socketRef.current.disconnect()
      endGame()
    })
    
    
    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])
  
      const handleRematch  = ({remathcResponse}) => {

        socketRef.current.emit(`${lobbyId}:rematch`, remathcResponse )
      }

    return {board,socketRef, players, gameStatus: {...gameStatus.current}, turn, isGameFinished, handleRematch}
}