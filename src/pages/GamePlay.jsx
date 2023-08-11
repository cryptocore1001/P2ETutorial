import React from 'react'
import { Header, Game, Chat } from '../components'
import { useParams } from 'react-router-dom'

const GamePlay = () => {
  const {id} = useParams()

  return (
    <div>
      <Header />
      <Game id={id} />
      <Chat gid={id} />
    </div>
  )
}

export default GamePlay
