import { getGlobalState, setGlobalState } from '../store'
import abi from '../abis/src/contracts/DappBreed.sol/DappBreed.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'

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
      reportError('Please connect wallet.')
      console.log('No accounts found.')
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0])
      await getMyNfts()
      await isWalletConnected()
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
  description,
  participants,
  numOfWinners,
  startDate,
  endDate,
  stakes,
}) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEthereumContract();
    tx = await contract.createGame(description,participants,numOfWinners,startDate,endDate, {
      value: toWei(stakes),
    });
    await tx.wait()
  } catch (error) {
    reportError(error);
  }
};

const invitePlayer = async (player, gameId) => {
  try {
    if (!ethereum) return alert("Please install Metamask")
    const contract = await getEthereumContract()
    tx = await contract.invitePlayer(player, gameId)
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const acceptInvitation = async (gameId, stake) => {
  try {
    if (!ethereum) return alert("Please install Metamask")
    const contract = await getEthereumContract()
    tx = await contract.acceptInvitation(gameId, {
      value: toWei(stake)
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const rejectInvitation = async (gameId) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEthereumContract();
    tx = await contract.rejectInvitation(gameId);
    await tx.wait();
  } catch (err) {
    reportError(err);
  }
};

const getGames = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEthereumContract();
    const games = await contract.getGames();
    setGlobalState("games", structuredGames(games));
  } catch (err) {
    reportError(err);
  }
};

const getGame = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEthereumContract()
    const game = await contract.getGame();
    setGlobalState("game", structuredGames([game])[0]);
  } catch (err) {
    reportError(err);
  }
};

const getInvitations = async () => {
  if (!ethereum) return alert("Please install Metamask");
  const contract = await getEthereumContract()
  const invitations = await contract.getInvitations()
  setGlobalState('invitations', structuredInvitations(invitations))
}

const structuredGames = (games) =>
  games.map((game) => ({
    id: game.id.toNumber(),
    string: game.description,
    owner: game.owner.toLowerCase(),
    participants: game.participants.toNumber(),
    numberOfWinners: game.numberOfWinners.toNumber(),
    plays: game.plays.toNumber(),
    acceptees: game.acceptees.toNumber(),
    stake: fromWei(game.stake),
    startDate: game.startDate.toNumber(),
    endDate: game.endDate.toNumber(),
    timestamp: game.timestamp.toNumber(),
    deleted: game.deleted,
    paidOut: game.paidOut,
  }));

 const structuredInvitations = (invitations) => 
  invitations.map((invitation) => ({
    account: invitation.account.toLowerCase(),
    responded: invitation.responded
  })) 

export {
  connectWallet,
  isWalletConnected,
}
