<<<<<<< HEAD
import React from 'react'
import { Header } from '../components'
import GameList from '../components/GameList'
import { useGlobalState } from '../store'

const MyGames = () => {
  const [games] = useGlobalState('games')
=======
import React, { useEffect, useState } from 'react'
import { Header, GameList } from "../components";
import { getMyGames } from '../services/blockchain'
import { useGlobalState } from '../store'

const MyGames = () => {
  const [myGames] = useGlobalState('myGames')

  const fetchGameData = async ()=> {
    await getMyGames()
  }

  useEffect(() => {
    fetchGameData()
  }, [])
>>>>>>> 9a165725d37d421a06d17b849f6832730c7ec35c

  return (
    <div>
      <Header />
<<<<<<< HEAD
      <GameList games={games} />

      {games.length < 1 && (
        <div className="w-3/5 mx-auto my-10">
          <p>You don't have any games yet...</p>
        </div>
      )}
=======
      <GameList games={myGames} />
>>>>>>> 9a165725d37d421a06d17b849f6832730c7ec35c
    </div>
  );
}

export default MyGames
