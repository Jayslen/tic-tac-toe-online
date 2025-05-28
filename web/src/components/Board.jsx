import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { io } from 'socket.io-client'

export function Board({ lobbyId }) {
  const [board, setBoard] = useState(
    Array(9).fill({ piece: null, userId: null })
  )
  // const [winner, setWinner] = 
  const { id, name: userName } = JSON.parse(window.localStorage.getItem('user'))
  const turn = useRef(null)
  const socketRef = useRef(null)
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

    socketRef.current.on('gameConfig', ({nextTurn, readyToPlay}) => {
      console.log(readyToPlay, nextTurn)
      turn.current = nextTurn
      gameStarted.current = readyToPlay
    })

    socketRef.current.on(
      'updateBoard',
      ({ position, piece, userId, playerTurn }) => {
        console.log(position, piece, userId)
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

  useEffect(() => {
    const winnigCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    const userMoves = board
      .map((data, index) => {
        return data.userId === id ? index : null
      })
      .filter((data) => data !== null)

    winnigCombinations.forEach((combination) => {
      if (combination.every((elm) => userMoves.includes(elm))) {
        socketRef.current.emit(`${lobbyId}:winner`, id)
      }
    })
  }, [board])

  return (
    <div className="grid grid-cols-3 gap-4 grid-rows-3 w-3/4 h-96 mx-auto mt-5">
      {board.map((data, index) => {
        return (
          <div
            className="bg-white/30 rounded grid place-items-center font-bold text-5xl"
            key={index}
            onClick={() => {
              if (!gameStarted.current) {
                alert('Cannot start the game')
                return
              }

              if (turn.current !== id) {
                alert('Is not your turn')
                return
              }

              if (board[index].piece) {
                alert('Cannot replace a piece')
                return
              }

              socketRef.current.emit(`move:${lobbyId}`, index)
            }}
          >
            {data.piece}
          </div>
        )
      })}
    </div>
  )
}
