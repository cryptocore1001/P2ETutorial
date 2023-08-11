import React, { useEffect } from 'react'
import { Header, GameList, InviteModal } from '../components'
import { getMyGames } from '../services/blockchain'
import { useGlobalState } from '../store'

const MyGames = () => {
  const [myGames] = useGlobalState('myGames')

  const fetchGameData = async () => {
    await getMyGames()
  }

  useEffect(() => {
    fetchGameData()
  }, [])

  return (
    <div>
      <Header />
      <GameList games={myGames} />
      <InviteModal />
    </div>
  )
}

export default MyGames
