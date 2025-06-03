import { Board } from './components/Board'
import { Popup } from './components/Popup'
import { useLobbyManagement } from './hooks/useLobbyManagement'
import { Toaster } from 'react-hot-toast'

function App() {
  const savedUser = JSON.parse(window.localStorage.getItem('user'))
  const {
    userCredentials,
    isPlaying,
    lobby,
    createLobby,
    createUser,
    joinLobby,
    closeBoard
  } = useLobbyManagement({ savedUser })

  return (
    <>
      <main className="max-w-xl text-white mx-4 my-6 md:mx-auto">
        <header>
          <h1 className="text-5xl font-bold my-1">Tic tac toe online</h1>
          <p className="text-lg my-2">
            A simple tic tac toe game, online built with React and nodeJS using
            web sockets.
          </p>
          {userCredentials.current && <p className='my-1'>User logged as: {userCredentials.current?.name}</p>}
          {lobby && <p className=''>Lobby: {lobby}</p>}
        </header>

        <form className="flex gap-3 my-3" onSubmit={createUser}>
          <input
            type="text"
            className={`grow border rounded-md p-2 ${
              savedUser &&
              'bg-black/10 border-white/25 cursor-not-allowed opacity-30'
            }`}
            name="userName"
            disabled={savedUser}
          />
          <button
            className={`${
              savedUser
                ? 'border border-white/25 bg-black/10 cursor-not-allowed opacity-30'
                : 'bg-red-500 hover:bg-red-800 cursor-pointer'
            } rounded-md px-2 grow-[0.9]  transition-colors`}
            disabled={savedUser}
          >
            Create user
          </button>
        </form>

        <div className="flex gap-2 my-3">
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

        {isPlaying ? <Board lobbyId={lobby} user={userCredentials.current} endGame={closeBoard} /> : null}
        <Toaster position="top-center" reverseOrder={false} />
      </main>
    </>
  )
}

export default App
