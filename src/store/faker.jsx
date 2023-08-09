export function generateGames(numGames) {
  const games = []

  for (let i = 0; i < numGames; i++) {
    const game = {
      id: i + 1, // Assuming game IDs start from 1
      title: `Game ${i + 1}`,
      description: `Description for Game ${i + 1}`,
      owner: '0xC0452490BF5A86540303bA31B9C1F6FA5c239e3c', // Replace with the actual owner's address
      participants: 0,
      numberOfWinners: 1, // Change this as needed
      plays: 0,
      acceptees: 0,
      stake: 0, // Set the stake amount
      startDate: Math.floor(Date.now()), // Current timestamp in seconds
      endDate: Math.floor(Date.now()) + 3600, // End time 1 hour from now
      timestamp: Math.floor(Date.now()),
      deleted: false,
      paidOut: false,
    }

    games.push(game)
  }

  return games
}
