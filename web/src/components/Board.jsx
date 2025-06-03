import { useEffect } from 'react'
import { useServerActions } from '../hooks/useServerActions'
import toast from 'react-hot-toast'
import {Popup} from './Popup'

export function Board({ lobbyId, user, endGame }) {
  const { id: userId, name: userName } = user
  const { players, socketRef, board, gameStatus, turn, isGameFinished, handleRematch } = useServerActions({
    userId,
    lobbyId,
    userName,
    endGame
  })


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
      {isGameFinished && <Popup gameInfo={isGameFinished} handleRematch={handleRematch} endGame={endGame}/>}
    </>
  )
}
