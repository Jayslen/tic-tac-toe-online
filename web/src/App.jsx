import { Board } from './components/Board'
import { useLobbyManagement } from './hooks/useLobbyManagement'

function App() {
  const savedUser = JSON.parse(window.localStorage.getItem('user'))
  const {
    userCredentials,
    isPlaying,
    lobby,
    createLobby,
    createUser,
    joinLobby,
  } = useLobbyManagement({ savedUser })

  return (
    <>
      <main className="max-w-xl text-white mx-auto my-6">
        <header>
          <h1 className="text-5xl font-bold">Tic tac toe online</h1>
          <p className="text-lg mt-2">
            A simple tic tac toe game, online built with React and nodeJS using
            web sockets.
          </p>
          {userCredentials && <p>User logged as: {userCredentials?.name}</p>}
        </header>

        <form className="flex gap-3 mb-4" onSubmit={createUser}>
          <input
            type="text"
            className={`grow border rounded-md p-2 ${savedUser && 'bg-black/10 border-white/25 cursor-not-allowed opacity-30'}`}
            name="userName"
            disabled = {savedUser}
          />
          <button className={`${savedUser ? "border border-white/25 bg-black/10 cursor-not-allowed opacity-30" : "bg-red-500 hover:bg-red-800 cursor-pointer"} rounded-md px-2 grow-[0.9]  transition-colors`} disabled={savedUser}>
            Create user
          </button>
        </form>

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

        {isPlaying ? <Board lobbyId={lobby} user={userCredentials} /> : null}
      </main>
    </>
  )
}

export default App
