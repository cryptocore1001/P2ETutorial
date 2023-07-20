const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())

describe('Contracts', () => {
  let contract, result

  const _maxSupply = 99
  const _name = 'Dapp Breeds'
  const _symbol = 'DAB'
  const _baseUri =
    'https://ipfs.io/ipfs/QmTWbe9wDns7aqZQNCuWh5PqybGbBF91kngC5Zf8qmCoyg/'
  const id = 1
  const fatherTokenId = 1
  const motherTokenId = 2
  const childTokenId = 3

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('DappBreed')
    ;[deployer, user1, user2] = await ethers.getSigners()

    contract = await Contract.deploy(_name, _symbol, _baseUri, _maxSupply)
    await contract.deployed()
  })

  beforeEach(async () => {
    await contract.connect(user1).mintNft({
      value: toWei(0.005),
    })
  })

  describe('Minting', () => {
    it('it should confirm nft minting', async () => {
      result = await contract.getMintedNfts()
      expect(result).to.have.lengthOf(1)

      result = await contract.getTrait(id)
      expect(result.tokenId).to.be.equal(id)
    })

    it('it should confirm second mint', async () => {
      result = await contract.getMintedNfts()
      expect(result).to.have.lengthOf(1)

      await contract.connect(user2).mintNft({
        value: toWei(0.005),
      })

      result = await contract.getMintedNfts()
      expect(result).to.have.lengthOf(2)
    })
  })

  describe('Breeding', () => {
    beforeEach(async () => {
      await contract.connect(user1).mintNft({
        value: toWei(0.005),
      })
    })

    it('it should confirm nft breeding', async () => {
      result = await contract.getMintedNfts()
      expect(result).to.have.lengthOf(2)

      await contract.connect(user2).breedNft(fatherTokenId, motherTokenId, {
        value: toWei(0.005),
      })

      result = await contract.getMintedNfts()
      expect(result).to.have.lengthOf(3)

      const fatherTraits = await contract.getTrait(fatherTokenId)
      const motherTraits = await contract.getTrait(motherTokenId)
      const childTraits = await contract.getTrait(childTokenId)

      expect(`Inherited Father weapon of #${fatherTraits.weapon}`).to.be.equal(
        childTraits.weapon
      )
      expect(
        `Inherited Mother environment of #${motherTraits.environment}`
      ).to.be.equal(childTraits.environment)
    })
  })
})
