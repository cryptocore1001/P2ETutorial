import React, { useEffect, useState } from 'react'
import { Header } from '../components'
import { generateGames } from '../store/faker'
import GameList from '../components/GameList'

const MyGames = () => {
  const [games, setGames] = useState([])

  useEffect(() => {
    const gameData = generateGames(6)
    setGames(gameData)
  }, [])

  return (
    <div>
      <Header />
      <GameList games={games} />
    </div>
  )
}

export default MyGames
