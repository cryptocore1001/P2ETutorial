import React from 'react'
import { formatDate, setGlobalState, truncate } from '../store'
import { Link } from 'react-router-dom'


const GameList = ({ games }) => {
  const handleInviteClick = (game) => {
    setGlobalState('game', game)
    setGlobalState('inviteModal', 'scale-100')
  }

  return (
    <div className="w-3/5 mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-2">{game.description}</p>
              <p className="text-gray-600">
                Owner: {truncate(game.owner, 4, 4, 11)}
              </p>
              <p className="text-gray-600">
                Starts on: {formatDate(game.startDate)}
              </p>
              <div className="flex justify-start items-center space-x-2 mt-3">
                <Link
                  to={'/gameplay/' + game.id}
                  className="bg-red-700 text-white py-2 px-5 rounded-full
                  hover:bg-red-600 duration-200 transition-all"
                >
                  View
                </Link>
                <button
                  onClick={() => handleInviteClick(game)}
                  className="bg-blue-700 text-white py-2 px-5 rounded-full
                  hover:bg-blue-600 duration-200 transition-all"
                >
                  Invite
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-lg font-semibold">No games yet</div>
        )}
      </div>
    </div>
  )
}

export default GameList
