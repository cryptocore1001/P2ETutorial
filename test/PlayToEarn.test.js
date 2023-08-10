const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())

describe('Contracts', () => {
  let contract, result

  const desc = "showcase your speed in a game",
    title = 'Game title',
    participants = 4,
    numberOfWinners = 1,
    startDate = Math.floor(Date.now()),
    endDate = Math.floor(Date.now()) + (60 * 60 * 24 * 10);

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('PlayToEarn')
    ;[deployer, user1, user2, user3] = await ethers.getSigners()

    contract = await Contract.deploy()
    await contract.deployed()
  })

  beforeEach(async () => {
    await contract.createGame(title, desc, participants, numberOfWinners, startDate, endDate,{
      value: toWei(0.05)
    });
  })

  describe('Game creation', () => {
     it('should confirm fetching games', async () => {
        result = await contract.getGames()
        expect(result).to.have.lengthOf(1)
     })

     it('should confirm fetching a single game', async () => {
        result = await contract.getGame(1)
        expect(result.id).to.be.equal(1)
     })
     

    it("should confirm listing of a players invitations", async () => {
       result = await contract.connect(user1).getInvitations()
       expect(result).to.have.lengthOf(0)

       await contract.invitePlayer(user1.address,1)
       await contract.invitePlayer(user2.address,1)

       result = await contract.connect(user1).getInvitations();
       expect(result).to.have.lengthOf(1);

       await contract.connect(user1).acceptInvitation(1,{
         value: toWei(0.05)
       })
       result = await contract.isPlayerListed(1,user1.address)
       expect(result).to.be.true

       await contract.connect(user2).rejectInvitation(1)
       result = await contract.isPlayerListed(1, user2.address);
       expect(result).to.be.false
    });

  })


})
