import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Game, Chat } from '../components'
import { getGame, getScores } from '../services/blockchain'
import { useGlobalState } from '../store'
import { setGlobalState, useGlobalState } from '../store'
import { getGroup } from '../services/chat'

const GamePlay = () => {
  const { id } = useParams()
  const [game] = useGlobalState('game')
  const [scores] = useGlobalState('scores')
  const [connectedAccount] = useGlobalState('connectedAccount')
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
      await getScores(id)
      await fetchGroup()
      setLoaded(true)
    }

    fetchData()
  }, [id])

  return (
    loaded && (
      <>
        <Header />
        <Game
          game={game}
          isPlayed={scores.some(
            (score) => score.played && score.player == connectedAccount
          )}
        />
        <Chat gid={id} />
      </>
    )
  )
}

export default GamePlay
