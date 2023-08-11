import React from 'react'
import { formatDate, truncate } from '../store'
import { Link } from 'react-router-dom'

const GameList = ({ games }) => {
  return (
    <div className="w-3/5 mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          games.length > 0 ? 
          games.map((game) => (
          <Link
            to={'/gameplay/' + game.id}
            key={game.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600 mb-2">{game.description}</p>
            <p className="text-gray-600">
              Owner: {truncate(game.owner, 4, 4, 11)}
            </p>
            <p className="text-gray-600">
              Start Date: {formatDate(game.startDate)}
            </p>
          </Link>
        ))
        : <div className='text-xl'>You do not have any game</div>
        }
        
      </div>
    </div>
  )
}

export default GameList
