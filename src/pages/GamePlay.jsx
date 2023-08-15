import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Game, Chat } from '../components'
import { getGame, getScores } from '../services/blockchain'
import { setGlobalState, useGlobalState } from '../store'
import { getGroup } from '../services/chat'
import GameResult from '../components/GameResult'

const GamePlay = () => {
  const { id } = useParams()
  const [game] = useGlobalState('game')
  const [scores] = useGlobalState('scores')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await getGame(id)
      await getScores(id)
      setLoaded(true)
      const GROUP = await getGroup(`guid_${id}`)
      setGlobalState('group', GROUP)
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
        <GameResult game={game} scores={scores} />
        <Chat gid={id} />
      </>
    )
  )
}

export default GamePlay
