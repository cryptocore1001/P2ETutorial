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

const structuredMint = (mintData) =>
  mintData
    .map((mint) => ({
      id: mint.id.toNumber(),
      owner: mint.owner,
      mintCost: fromWei(mint.mintCost),
      timestamp: mint.timestamp.toNumber(),
      traits: {
        name: mint.traits.name,
        description: mint.traits.description,
        weapon: mint.traits.weapon,
        image: mint.traits.image,
        environment: mint.traits.environment,
        rarity: mint.traits.rarity.toNumber(),
        breeded: mint.traits.breeded,
      },
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

export {
  connectWallet,
  isWalletConnected,
}
