import { setGlobalState } from '../store'
import abi from '../abis/src/contracts/PlayToEarn.sol/PlayToEarn.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'
import { logOutWithCometChat } from './chat'

const { ethereum } = window
const ContractAddress = address.address
const ContractAbi = abi.abi
let tx

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getEthereumContract = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = accounts[0]
    ? new ethers.providers.Web3Provider(ethereum)
    : new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
  const wallet = accounts[0] ? null : ethers.Wallet.createRandom()
  const signer = provider.getSigner(accounts[0] ? undefined : wallet.address)

  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      reportError('Please install Metamask')
      return Promise.reject(new Error('Metamask not installed'))
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      console.log('No accounts found.')
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0])
      await loadData()
      await isWalletConnected()
      await logOutWithCometChat()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      setGlobalState('connectedAccount', '')
      console.log('No accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    reportError(error)
  }
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
  if (!ethereum) return alert('Please install Metamask')
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
      await getMyGames()
      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const invitePlayer = async (player, gameId) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.invitePlayer(player, gameId)
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const acceptInvitation = async (gameId, stake) => {
  if (!ethereum) return alert('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.acceptInvitation(gameId, {
        value: toWei(stake),
      })
      await tx.wait()
      await getInvitations()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const rejectInvitation = async (gameId) => {
  if (!ethereum) return alert('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.rejectInvitation(gameId)
      await tx.wait()
      await getInvitations()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const recordScore = async (gameId, score) => {
  if (!ethereum) return alert('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.recordScore(gameId, score)
      await tx.wait()
      await getGame(gameId)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const payout = async (gameId) => {
  if (!ethereum) return alert('Please install metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.payout(gameId)
      await tx.wait()
      await getGame(gameId)
      resolve(tx)
    } catch (err) {
      reportError(err)
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
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const games = await contract.getGames()
    setGlobalState('games', structuredGames(games))
  } catch (err) {
    reportError(err)
  }
}

const getGame = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const game = await contract.getGame(id)
    setGlobalState('game', structuredGames([game])[0])
  } catch (err) {
    reportError(err)
  }
}

const getInvitations = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const invitations = await contract.getInvitations()
    setGlobalState('invitations', structuredInvitations(invitations))
  } catch (err) {
    reportError(err)
  }
}

const getScores = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const scores = await contract.getScores(id)
    setGlobalState('scores', structuredPlayersScore(scores))
  } catch (err) {
    reportError(err)
  }
}

const getMyGames = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const games = await contract.getMyGames()
    setGlobalState('myGames', structuredGames(games))
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

export {
  connectWallet,
  isWalletConnected,
  createGame,
  invitePlayer,
  acceptInvitation,
  rejectInvitation,
  recordScore,
  payout,
  getGames,
  getMyGames,
  getGame,
  getInvitations,
  getScores,
  loadData,
}
