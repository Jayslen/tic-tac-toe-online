import '../popup.css'

export function Popup({ user = 'Jayslen', handleRematch }) {
  return (
    <div
      id="backdrop"
      className="w-screen h-screen grid place-content-center bg-black/50 fixed top-0 left-0 z-20"
    >
      <div className="w-96 h-auto p-4 rounded-md bg-white  peer-checked:scale-100 peer-checked:block transition-all duration-700">
        <h2 className="text-xl font-medium text-black">The round has end</h2>
        <p className="my-1 text-black">{user} has won the round</p>
        <footer className="grid grid-cols-2 gap-4">
          <button
            className="bg-red-500 rounded-md p-2 hover:bg-red-800 text-white transition-colors cursor-pointer"
            onClick={() => {
              handleRematch({ remathcResponse: false})
            }}
          >
            Exit
          </button>
          <button
            className="bg-blue-500 rounded-md p-2 hover:bg-blue-800 text-white transition-colors cursor-pointer"
            onClick={() => {
              handleRematch({ remathcResponse: true })
            }}
          >
            Rematch
          </button>
        </footer>
      </div>
    </div>
  )
}
