const { ethers } = require('hardhat')
// import address from '../abis/contractAddress.json'
import abi from '../abis/src/contracts/PlayToEarn.sol/PlayToEarn.json'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const ContractAddress = '0x51a1ceb83b83f1985a81c295d1ff28afef186e02'
const ContractAbi = abi.abi
let tx

const getEthereumContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_RPC_URL
  )
  ;[deployer, user1, user2, user3] = await ethers.getSigners()
  const signer = provider.getSigner(deployer.address)
  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

const createGame = async ({
  title,
  description,
  participants,
  winners,
  challenges,
  starts,
  ends,
  stake,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.createGame(
        title,
        description,
        participants,
        winners,
        challenges,
        starts,
        ends,
        {
          value: toWei(stake),
        }
      )
      await tx.wait()
      resolve(tx)
    } catch (error) {
      reject(error)
    }
  })
}

const invitePlayer = async (player, gameId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.invitePlayer(player, gameId)
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reject(err)
    }
  })
}

const acceptInvitation = async (gameId, stake) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.acceptInvitation(gameId, {
        value: toWei(stake),
      })
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reject(err)
    }
  })
}

const recordScore = async (gameId, score) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.recordScore(gameId, score)
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reject(err)
    }
  })
}

const payout = async (gameId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.payout(gameId)
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reject(err)
    }
  })
}

const loadData = async () => {
  await getMyGames()
  await getInvitations()
}

const getGames = async () => {
  try {
    const contract = await getEthereumContract()
    const games = await contract.getGames()
    console.log(structuredGames(games))
  } catch (err) {
    reportError(err)
  }
}

const getGame = async (id) => {
  try {
    const contract = await getEthereumContract()
    const game = await contract.getGame(id)
    console.log(structuredGames([game])[0])
  } catch (err) {
    reportError(err)
  }
}

const getInvitations = async () => {
  try {
    const contract = await getEthereumContract()
    const invitations = await contract.getInvitations()
    console.log(structuredInvitations(invitations))
  } catch (err) {
    reportError(err)
  }
}

const getScores = async (id) => {
  try {
    const contract = await getEthereumContract()
    const scores = await contract.getScores(id)
    console.log(structuredPlayersScore(scores))
  } catch (err) {
    reportError(err)
  }
}

const getMyGames = async () => {
  try {
    const contract = await getEthereumContract()
    const games = await contract.getMyGames()
    console.log(structuredGames(games))
  } catch (err) {
    reportError(err)
  }
}

const structuredGames = (games) =>
  games
    .map((game) => ({
      id: game.id.toNumber(),
      title: game.title,
      description: game.description,
      owner: game.owner.toLowerCase(),
      participants: game.participants.toNumber(),
      challenges: game.challenges.toNumber(),
      numberOfWinners: game.numberOfWinners.toNumber(),
      plays: game.plays.toNumber(),
      acceptees: game.acceptees.toNumber(),
      stake: fromWei(game.stake),
      startDate: game.startDate.toNumber(),
      endDate: game.endDate.toNumber(),
      timestamp: game.timestamp.toNumber(),
      deleted: game.deleted,
      paidOut: game.paidOut,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredPlayersScore = (playersScore) =>
  playersScore
    .map((playerScore) => ({
      gameId: playerScore.gameId.toNumber(),
      player: playerScore.player.toLowerCase(),
      score: playerScore.score.toNumber(),
      played: playerScore.played,
    }))
    .sort((a, b) => {
      if (a.played !== b.played) {
        return a.played ? -1 : 1
      } else {
        return a.score - b.score
      }
    })

const structuredInvitations = (invitations) =>
  invitations.map((invitation) => ({
    gameId: invitation.gameId.toNumber(),
    account: invitation.account.toLowerCase(),
    responded: invitation.responded,
    accepted: invitation.accepted,
    title: invitation.title,
    stake: fromWei(invitation.stake),
  }))

async function main() {
  const params = {
    description: 'showcase your speed in a game',
    title: 'Game title',
    participants: 4,
    winners: 1,
    challenges: 5,
    starts: Date.now(),
    ends: Date.now() + 5 * 60 * 1000,
    stake: 0.5,
    gameId: 1,
  }

  await createGame(params)
  await getMyGames()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
