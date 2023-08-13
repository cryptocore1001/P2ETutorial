import React from 'react'
import { truncate } from '../store'

const GameInfo = ({ game }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sm:w-1/3">
      <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
      <p className="text-gray-600 mb-2">{game.description}</p>
      <p className="text-gray-600">
        This game is hosted by {truncate(game.owner, 4, 4, 11)}, with{' '}
        {game.participants} participants joining from the globe and{' '}
        {game.acceptees}
        already onboarded.
        <br />
        <br />
        We have {game.challenges} challenges to be complete in this game, and
        the rewards of {game.stake * game.numberOfWinners} ETH will be shared
        amongst the {game.numberOfWinners} persons to emerge as winners.
        <br />
        <br />
        This game is scheduled for {game.startDate} - {game.endDate} and so far,
        {game.plays} persons have played so far.
      </p>
    </div>
  )
}

export default GameInfo
