import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

export function useLobbyManagement({ savedUser }) {
  const [lobby, setLobby] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  // const [userCredentials, setUserCredentials] = useState(savedUser)
  const userCredentials = useRef(savedUser ?? {name: 'Anonymous', id: crypto.randomUUID()})
  const server = import.meta.env.VITE_SERVER

  const createLobby = async () => {
    if (lobby) {
      toast.error('You are in a lobby')
      return
    }

    try {
      const res = await fetch(`${server}/createLobby`, {
        method: 'POST',
      })
      const {lobbyId} = await res.json()
      setLobby(lobbyId)
      toast.success(`Lobby created:${lobbyId}`, {
        duration: 5000
      })
    } catch (e) {
      console.error(e)
    }
  }

  const joinLobby = async (e) => {
    e.preventDefault()
    const { lobbyId: inputId } = Object.fromEntries(new FormData(e.target))

    if(inputId.trim().length === 0) {
      toast.error("Type a lobby")
      return
    }

    const { name, id:userId } = userCredentials.current

    try {
      const res = await fetch(`${server}/joinLobby/${inputId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id: userId }),
      })

      if(res.ok) {
        const { lobbyId } = await res.json()
        setLobby(lobbyId)
        setIsPlaying((prev) => !prev)
      } else {
        const {msg} = await res.json()
        toast.error(msg)
      }
    } catch (e) {
      console.error(e)
    }
    // e.target.reset()
  }

  const createUser = (e) => {
    e.preventDefault()
    const { userName: name } = Object.fromEntries(new FormData(e.target))

    if (name.trim().length > 0) {
      const newUser = { name, id: crypto.randomUUID() }
      userCredentials.current = newUser
      toast.success(`User created: ${name}`, {
        duration: 5000
      })
      window.localStorage.setItem('user', JSON.stringify(newUser))
      e.target.reset()
    }
  }

  const closeBoard = () => {
    setIsPlaying(false)
  }
  return {
    userCredentials,
    isPlaying,
    lobby,
    createLobby,
    joinLobby,
    createUser,
    closeBoard
  }
}
