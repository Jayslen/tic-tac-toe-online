import { useState } from 'react'

export function Board() {
  const [board, setBoard] = useState(Array(9).fill(null))
  return (<div className='grid grid-cols-3 gap-4 grid-rows-3 w-3/4 h-96 mx-auto mt-5'>
    {board.map((_, i) => {
        return (
            <div className='bg-white/30 rounded grid place-items-center font-bold text-5xl' key={i}></div>
        )
    })}
  </div>)
}
