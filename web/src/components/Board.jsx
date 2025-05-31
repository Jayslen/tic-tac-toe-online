import { useEffect } from 'react'
import { useServerActions } from '../hooks/useServerActions'
import toast from 'react-hot-toast'

export function Board({ lobbyId, user, endGame }) {
  const { id: userId, name: userName } = user
  const { players, socketRef, board, gameStatus, turn } = useServerActions({
    userId,
    lobbyId,
    userName,
    endGame
  })

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
        return data.userId === userId ? index : null
      })
      .filter((data) => data !== null)

    winnigCombinations.forEach((combination) => {
      if (combination.every((elm) => userMoves.includes(elm))) {
        socketRef.current.emit(`${lobbyId}:winner`, userId)
      }
    })
  }, [board])

  return (
    <>
      <header className="flex justify-between w-3/4 mx-auto my-3">
        {players.map(({ name,id, piece }) => {
          return <span className='text-xl capitalize font-bold italic' key={id}>{name}: {piece}</span>
        })}
      </header>
      <div className="grid grid-cols-3 gap-4 grid-rows-3 w-full h-96 mx-auto md:w-3/4">
        {board.map((data, index) => {
          return (
            <div
              className="bg-white/30 rounded grid place-items-center font-bold text-5xl"
              key={index}
              onClick={() => {
                if (!gameStatus.readyToPlay) {
                  toast.error(gameStatus.statusMsg)
                  return
                }

                if (turn.current !== userId) {
                  toast('Is not your turn', {
                    icon: '🙅🏽‍♂️',
                  })
                  return
                }

                if (board[index].piece) {
                  toast.error("Cannot replace a move")
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
    </>
  )
}
