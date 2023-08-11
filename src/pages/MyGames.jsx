import React from 'react'
import { Header } from '../components'
import GameList from '../components/GameList'
import { useGlobalState } from '../store'

const MyGames = () => {
  const [games] = useGlobalState('games')

  return (
    <div>
      <Header />
      <GameList games={games} />

      {games.length < 1 && (
        <div className="w-3/5 mx-auto my-10">
          <p>You don't have any games yet...</p>
        </div>
      )}
    </div>
  )
}

export default MyGames
