//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlayToEarn is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private totalGame;
    Counters.Counter private totalParticipants;

    struct GameStruct {
        uint id;
        string description;
        address owner;
        uint participants;
        uint numberOfWinners;
        uint plays;
        uint onboards;
        uint stake;
        uint deadline;
        uint timestamp;
        bool started;
        bool deleted;
        bool paidOut;
    }

    struct PlayerStruct {
        uint id;
        uint participantId;
        uint gameId;
        address player;
    }

    struct InvitationStruct {
        address invitedPlayer;
        bool responded;
    }

    uint private totalBalance;
    uint serviceFee = 0.5 ether;

    mapping(uint => GameStruct) game;
    mapping(uint => PlayerStruct) player;
    mapping(address => mapping(uint => InvitationStruct)) invitationsOf;
    mapping(uint => mapping(address => bool)) isListed;
    mapping(uint => uint) playerId;

    mapping(uint => bool) gameExists;
    mapping(uint => bool) playerExists;
    mapping(uint => bool) participantExists;
    mapping(uint => mapping(address => bool)) invitationExists;
    mapping(uint => uint) playerScore;


    mapping(uint => bool) gameHasPlayers;

    modifier onlyGameOwner(uint gameId) {
        require(gameExists[gameId], "Game does not exist!");
        require(msg.sender == game[gameId].owner, "Only the game owner can call this function!");
        _;
    }

    function createGame(
        uint participantId,
        string memory description,
        uint participants,
        uint numberOfWinners,
        uint deadline
    ) public payable {
        require(!participantExists[participantId],"You must be a participant to create a game");
        require(msg.value > 0 ether, "stake funds is required");
        require(participants > 1,"invalid number of players");
        require(bytes(description).length > 0, "description is required!");
        require(deadline > 0, "Duration should be greater than zero!");
        require(numberOfWinners > 0, "Number Of winners required!");

        totalGame.increment();
        uint gameId = totalGame.current();
        playerId[gameId]++;

        require(_saveGame(gameId, description, participants, numberOfWinners, deadline),"Game creation unsuccessful");
        
        require(_savePlayer(playerId[gameId], gameId, participantId), "Player creation unsuccessful");

        totalBalance += msg.value;
    }  

    function getGames() public view returns (GameStruct[] memory ActiveGames) {
        uint available;

        for (uint256 i = 1; i <= totalGame.current(); i++) {
            if (!game[i].deleted && !game[i].paidOut && game[i].deadline > currentTime()) {
                available++;
            }
        }

        ActiveGames = new GameStruct[](available);
        uint index;

        for (uint256 i = 1; i <= totalGame.current(); i++) {
            if (!game[i].deleted && !game[i].paidOut && game[i].deadline > currentTime()) {
                ActiveGames[index++] = game[i];
            }
        }
    }

    function getGame(uint id) public view returns(GameStruct memory) {
        return game[id];
    }


    // invitation functions
    function invitePlayer(address invitedPlayer, uint gameId) public {
        require(participantExists[totalParticipants.current()], "Participant already exists");
        require(gameExists[gameId], "Game does not exist");
        require(!isListed[gameId][invitedPlayer], "Player is already invited to this game");

        invitationsOf[invitedPlayer][gameId] = InvitationStruct({
            invitedPlayer: invitedPlayer,
            responded: false
        });

    }

    function acceptInvitation(uint gameId, uint participantId) public payable {
        require(gameExists[gameId], "Game does not exist");
        require(msg.value >= game[gameId].stake, "Insuffcient funds for stakes");
        require(invitationsOf[msg.sender][gameId].invitedPlayer == msg.sender, "You are not invited to this game");
        require(!invitationsOf[msg.sender][gameId].responded, "Invitation is already accepted");
        
        playerId[gameId]++;
        
        require(_savePlayer(playerId[gameId], gameId, participantId), "Player creation unsuccessful");

        invitationsOf[msg.sender][gameId].responded = true;
        participantExists[participantId] = true;

        totalBalance += msg.value;
    }

    function rejectInvitation(uint gameId) public {
        require(gameExists[gameId], "Game does not exist");
        require(invitationsOf[msg.sender][gameId].invitedPlayer == msg.sender, "You are not invited to this game");
        require(!invitationsOf[msg.sender][gameId].responded, "Invitation is already rejected");

        invitationsOf[msg.sender][gameId].responded = true;
    }

    function getInvitations() public view returns (InvitationStruct[] memory Invitations) {
        uint totalInvitations;

        for (uint i = 1; i <= totalGame.current(); i++) {
            if (isListed[i][msg.sender]) totalInvitations++;
        }

        Invitations = new InvitationStruct[](totalInvitations);
        uint currentIndex = 0;

        for (uint i = 1; i <= totalGame.current(); i++) {
            if (isListed[i][msg.sender]) {
                Invitations[currentIndex] = invitationsOf[msg.sender][i];
                currentIndex++;
            }
        }
    }


    function startGame(uint gameId) public onlyGameOwner(gameId){
        require(game[gameId].participants == game[gameId].onboards, "Players not complete");
        require(!game[gameId].started, "The game has already started");

        game[gameId].started = true;
    }

    function _saveGame(
        uint gameId,
        string memory description,
        uint participants,
        uint numberOfWinners,
        uint deadline
    ) internal returns (bool) {

        GameStruct memory gameData;
        gameData.id = gameId;
        gameData.description =  description;
        gameData.owner =  msg.sender;
        gameData.participants =  participants;
        gameData.onboards =  1;
        gameData.stake =  msg.value;
        gameData.numberOfWinners =  numberOfWinners;
        gameData.deadline =  deadline;
        gameData.timestamp =  currentTime();

        game[gameId] = gameData;
        gameExists[gameId] = true;
        return true;
    }


    function _savePlayer(
        uint id,
        uint gameId,
        uint participantId
    ) internal returns (bool) {
        player[id] = PlayerStruct({
            id: id,
            gameId: gameId,
            participantId: participantId,
            player: msg.sender
        });

        isListed[gameId][msg.sender] = true;
        playerExists[id] = true;
        return true;
    }


    function currentTime() internal view returns (uint256) {
        uint256 newNum = (block.timestamp * 1000) + 1000;
        return newNum;
    }

    function _payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}