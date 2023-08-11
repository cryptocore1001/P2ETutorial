
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

  return (
    <div>
      <Header />
      <GameList games={myGames} />
    </div>
  );
}

export default MyGames
