import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Game, Chat } from '../components'
import { getGame } from '../services/blockchain'
import { setGlobalState, useGlobalState } from '../store'
import GameInfo from '../components/GameInfo'
import { getGroup } from '../services/chat'

const GamePlay = () => {
  const { id } = useParams()
  const [game] = useGlobalState('game')
  const [loaded, setLoaded] = useState(false)

   const fetchGroup = async () => {
     await getGroup(`guid_${id}`)
      .then((group) => {
        setGlobalState("group", group);
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      })
   }

  useEffect(() => {
    const fetchData = async () => {
      await getGame(id)
      await fetchGroup()
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
