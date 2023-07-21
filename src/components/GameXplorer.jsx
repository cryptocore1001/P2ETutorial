import React from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'

const GameXplorer = () => {
    
  const gameData = [
    {
      id: 1,
      name: "Game A",
      gameType: "Singleplayer",
      numberOfPlayers: 1,
    },
    {
      id: 2,
      name: "Game B",
      gameType: "Multiplayer",
      numberOfPlayers: 4,
    },
    {
      id: 3,
      name: "Game C",
      gameType: "Singleplayer",
      numberOfPlayers: 2,
    },
  ];

  return (
    <section className="my-12">
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl p-3">Explore</h2>
      </div>
      
      <main className="w-11/12 mx-auto grid grid-cols-1">
        <div>
          <div className="mt-4">
            <h3 className="p-3 px-5 text-xl">View invitations</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {gameData.map((game) => (
                  <tr key={game.id} className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap text-blue-500">
                      {game.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {game.gameType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {game.numberOfPlayers}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <button
                        className="text-green-500 text-white font-bold py-2 px-3 rounded mr-2"
                        title="Accept"
                      >
                        <AiOutlineCheckCircle className="text-2xl" />
                      </button>
                      <button
                        className="text-red-500 text-white font-bold py-2 px-3 rounded"
                        title="Reject"
                      >
                        <AiOutlineCloseCircle className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </section>
  );
}

export default GameXplorer
