import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Game, Chat } from '../components'
import { getGame } from '../services/blockchain'
import { useGlobalState } from '../store'
import GameInfo from '../components/GameInfo'

const GamePlay = () => {
  const { id } = useParams()
  const [game] = useGlobalState('game')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await getGame(id)
      setLoaded(true)
    }

    fetchData()
  }, [id])

  return (
    loaded && (
      <>
        <Header />
        <Game game={game} />
        <Chat gid={id} />
      </>
    )
  )
}

export default GamePlay
