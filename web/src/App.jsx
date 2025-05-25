import { Board } from './components/Board'

function App() {

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
          <button className="bg-blue-500 rounded-md px-2 hover:bg-blue-800 grow-[1.5] transition-colors cursor-pointer">
            Create lobby
          </button>

          <form className="grow flex gap-2">
            <input className="grow border rounded-md p-2" type="text" />
            <button className="bg-orange-500 rounded-md px-2 hover:bg-orange-800 transition-colors cursor-pointer">
              Join a lobby
            </button>
          </form>
        </div>

        <Board/>
      </main>
    </>
  )
}

export default App
