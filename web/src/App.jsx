import { Board } from './components/Board'
import { useState } from 'react'

function App() {
  const [lobby, setLobby] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const createLobby = async () => {
    if (lobby) {
      alert('You have a lobby started')
      return
    }
    try {
      const res = await fetch('http://localhost:3000/createLobby', {
        method: 'POST',
      })
      if (res.ok) {
        setLobby(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  console.log(lobby)


  const joinLobby = async (e) => {
    e.preventDefault()
    const { lobbyId } = Object.fromEntries(new FormData(e.target))
    if (!window.localStorage.getItem('user')) {
      window.localStorage.setItem(
        'user',
        JSON.stringify({ id: crypto.randomUUID(), name: 'Unknown'})
      )
    }

    const {name: userName, id: userId} = JSON.parse(localStorage.getItem("user"))
    const res = await fetch(`http://localhost:3000/joinLobby/${lobbyId}`, {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({userName, userId})
    })

    const {lobbyId : id} = await res.json()

    setLobby(id)
    setIsPlaying(prev => !prev)

  }

  return (
    <>
      <main className="max-w-xl text-white mx-auto my-6">
        <header>
          <h1 className="text-5xl font-bold">Tic tac toe online</h1>
          <p className="text-lg mt-2">
            A simple tic tac toe game, online built with React and nodeJS using
            web sockets.
          </p>
        </header>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 rounded-md px-2 hover:bg-blue-800 grow-[1.5] transition-colors cursor-pointer"
            onClick={createLobby}
          >
            Create lobby
          </button>

          <form className="grow flex gap-2" onSubmit={joinLobby}>
            <input
              className="grow border rounded-md p-2"
              type="text"
              name="lobbyId"
            />
            <button className="bg-orange-500 rounded-md px-2 hover:bg-orange-800 transition-colors cursor-pointer">
              Join a lobby
            </button>
          </form>
        </div>

        {isPlaying ? <Board lobbyId={lobby}/> : null}
      </main>
    </>
  )
}

export default App
