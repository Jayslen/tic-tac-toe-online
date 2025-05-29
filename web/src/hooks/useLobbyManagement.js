import { useState } from 'react'

export function useLobbyManagement({ savedUser }) {
  const [lobby, setLobby] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userCredentials, setUserCredentials] = useState(savedUser)

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

  const joinLobby = async (e) => {
    e.preventDefault()
    const { lobbyId: inputId } = Object.fromEntries(new FormData(e.target))

    const {name, userId} = {
        name: userCredentials?.name ?? "Anonimoues",
        userId: userCredentials?.id ?? crypto.randomUUID()
    }

    
    const res = await fetch(`http://localhost:3000/joinLobby/${inputId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, id:userId }),
    })

    const { lobbyId, user } = await res.json()

    setLobby(lobbyId)
    setIsPlaying((prev) => !prev)
    // update userCredentials state with the endpoint's response if user is not logged as it generate it ramdon
    // is updated because the state is being pass to the board component to complte the socket auth data
    if(!userCredentials) {
        setUserCredentials({...user})
    }
  }

  const createUser = (e) => {
    e.preventDefault()
    const { userName: name } = Object.fromEntries(new FormData(e.target))

    if (name.trim().length > 0) {
      const newUser = { name, id: crypto.randomUUID() }
      setUserCredentials(newUser)
      window.localStorage.setItem('user', JSON.stringify(newUser))
      e.target.reset()
    }
  }
  return {
    userCredentials,
    isPlaying,
    lobby,
    createLobby,
    joinLobby,
    createUser,
  }
}
