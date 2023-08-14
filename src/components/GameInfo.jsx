import React from 'react'
import { timestampToDate, truncate } from '../store'

const GameInfo = ({ game }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sm:w-1/3">
      <h3 className="text-lg font-semibold mb-2">
        {game.title} (Instructions)
      </h3>
      <p className="text-gray-600 mb-2">{game.description}</p>
      <p className="text-gray-600">
        This game is hosted by{' '}
        <span className="font-medium text-black">
          {truncate(game.owner, 4, 4, 11)}
        </span>
        , with{' '}
        <span className="font-medium text-black">
          {game.participants} participants
        </span>{' '}
        joining from the globe and{' '}
        <span className="font-medium text-black">
          {game.acceptees} persons{' '}
        </span>
        already onboarded.
        <br />
        <br />
        We have{' '}
        <span className="font-medium text-black">
          {game.challenges} challenges
        </span>{' '}
        to be complete in this game, and the rewards of{' '}
        <span className="font-medium text-black">
          {game.stake * game.participants} ETH
        </span>{' '}
        will be shared amongst the{' '}
        <span className="font-medium text-black">
          {game.numberOfWinners} persons
        </span>{' '}
        to emerge as winners.
        <br />
        <br />
        This game is scheduled for{' '}
        <span className="font-medium text-black">
          {timestampToDate(game.startDate)} - {timestampToDate(game.endDate)}
        </span>{' '}
        and so far,
        <span className="font-medium text-black">
          {' '}
          {game.plays} persons
        </span>{' '}
        have played so far.
      </p>
    </div>
  )
}

export default GameInfo
