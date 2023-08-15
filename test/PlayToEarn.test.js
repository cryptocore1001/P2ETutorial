const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())

describe('Contracts', () => {
  let contract, result

  const description = 'showcase your speed in a game'
  const title = 'Game title'
  const participants = 4
  const winners = 1
  const challenges = 5
  const starts = Date.now() - 10 * 60 * 1000
  const ends = Date.now() + 10 * 60 * 1000
  const stake = 0.5
  const gameId = 1

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('PlayToEarn')
    ;[deployer, user1, user2, user3] = await ethers.getSigners()

    contract = await Contract.deploy()
    await contract.deployed()
  })

  beforeEach(async () => {
    await contract.createGame(
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
  })

  describe('Game creation', () => {
    it('should confirm fetching games', async () => {
      result = await contract.getGames()
      expect(result).to.have.lengthOf(1)
    })

    it('should confirm fetching a single game', async () => {
      result = await contract.getGame(gameId)
      expect(result.id).to.be.equal(1)
    })

    it('should confirm listing of a players invitations', async () => {
      result = await contract.connect(user1).getInvitations()
      expect(result).to.have.lengthOf(0)

      await contract.invitePlayer(user1.address, gameId)
      await contract.invitePlayer(user2.address, gameId)

      result = await contract.connect(user1).getInvitations()
      expect(result).to.have.lengthOf(1)

      await contract.connect(user1).acceptInvitation(1, {
        value: toWei(stake),
      })

      result = await contract.isPlayerListed(gameId, user1.address)
      expect(result).to.be.true

      await contract.connect(user2).rejectInvitation(gameId)
      result = await contract.isPlayerListed(gameId, user2.address)
      expect(result).to.be.false
    })

    it('should confirm payouts', async () => {
      await contract.invitePlayer(user1.address, gameId)
      await contract.connect(user1).acceptInvitation(gameId, {
        value: toWei(stake),
      })

      await contract.recordScore(gameId, 23)
      await contract.connect(user1).recordScore(gameId, 19)

      result = await contract.getGame(gameId)
      expect(result.paidOut).to.be.false

      await contract.payout(gameId)

      result = await contract.getGame(gameId)
      expect(result.paidOut).to.be.true
    })
  })
})
