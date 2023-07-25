//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlayToEarn is Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;

    Counters.Counter private _gameCounter;
    Counters.Counter private _participantCounter;

    struct GameStruct {
        uint id;
        string caption;
        address owner;
        uint participants;
        uint numberOfWinners;
        uint stake;
        uint deadline;
        uint timestamp;
        bool isSingleGame;
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


    struct ParticipantStruct {
        uint id;
        address participant;
        bool isAvailable;
    }

    struct InvitationStruct {
        address invitedPlayer;
        bool accepted;
    }

    uint private totalBalance;
    uint serviceFee = 0.5 ether;

    // for saving platform related data
    mapping(uint => GameStruct) game;
    mapping(uint => PlayerStruct) player;
    mapping(uint => ParticipantStruct) participant;
    mapping(uint => uint) gameInvitations;
    mapping(address => mapping(uint => InvitationStruct)) invitationsOf;
    mapping(uint => uint) playerId;

    // check for existence of platform resources
    mapping(uint => bool) gameExists;
    mapping(uint => bool) playerExists;
    mapping(uint => bool) participantExists;
    mapping(uint => mapping(address => bool)) invitationExists;
    mapping(uint => uint) playerScore;


    mapping(uint => bool) gameHasPlayers;

    // modifier
    modifier onlyGameOwner(uint gameId) {
        require(gameExists[gameId], "Game does not exist!");
        require(msg.sender == game[gameId].owner, "Only the game owner can call this function!");
        _;
    }

    // Game functions

    function createGame(
        uint participantId,
        string memory caption,
        uint participants,
        uint numberOfWinners,
        uint deadline
    ) public payable {
        require(!participantExists[participantId],"You must be a participant to create a game");
        require(msg.value > 0 ether, "stake funds is required");
        require(participants > 1,"invalid number of players");
        require(!_availableParticipants(participants),"Available participants not enough");
        require(bytes(caption).length > 0, "Caption is required!");
        require(deadline > 0, "Duration should be greater than zero!");
        require(numberOfWinners > 0, "Number Of winners required!");

        _gameCounter.increment();
        uint gameId = _gameCounter.current();
        playerId[gameId]++;

        require(_saveGame(gameId, caption, participants, numberOfWinners, deadline),"Game creation unsuccessful");
        
        require(_savePlayer(playerId[gameId], gameId, participantId, msg.sender), "Player creation unsuccessful");

        totalBalance += msg.value;
    }  

    function getGames() public view returns (GameStruct[] memory) {
        uint activeGameCount = 0;
        uint256 currentTime = _currentTime();

        // Count the number of active games
        for (uint256 i = 1; i <= _gameCounter.current(); i++) {
            if (!game[i].deleted && !game[i].paidOut && game[i].deadline > currentTime) {
                activeGameCount++;
            }
        }

        // Create an array to store active games
        GameStruct[] memory activeGames = new GameStruct[](activeGameCount);
        uint activeIndex = 0;

        // Populate the activeGames array with active games
        for (uint256 i = 1; i <= _gameCounter.current(); i++) {
            if (!game[i].deleted && !game[i].paidOut && game[i].deadline > currentTime) {
                activeGames[activeIndex] = game[i];
                activeIndex++;
            }
        }

        return activeGames;
    }

    function getGame(uint id) public view returns(GameStruct memory) {
        return game[id];
    }

    
    // participate functions

    function participate() public {
        require(participantExists[_participantCounter.current()],"Participant already exists");

        _participantCounter.increment();
        participant[_participantCounter.current()] = ParticipantStruct({
            id: _participantCounter.current(),
            participant: msg.sender,
            isAvailable: true
        });
    }

    // invitation functions
    function invitePlayer(address invitedPlayer, uint gameId) public {
        require(participantExists[_participantCounter.current()], "Participant already exists");
        require(gameExists[gameId], "Game does not exist");
        require(!_isInvited(gameId, invitedPlayer), "Player is already invited to this game");

        // Store the invitation
        gameInvitations[gameId]++;
        invitationsOf[invitedPlayer][gameId] = InvitationStruct({
            invitedPlayer: invitedPlayer,
            accepted: false
        });

    }

    function acceptInvitation(uint gameId, uint participantId) public payable {
        require(gameExists[gameId], "Game does not exist");
        require(msg.value >= game[gameId].stake, "Insuffcient funds for stakes");
        require(invitationsOf[msg.sender][gameId].invitedPlayer == msg.sender, "You are not invited to this game");
        require(!invitationsOf[msg.sender][gameId].accepted, "Invitation is already accepted");
        require(participant[participantId].isAvailable, "Participant is not available");
        
        playerId[gameId]++;
        
        require(_savePlayer(playerId[gameId], gameId, participantId, msg.sender), "Player creation unsuccessful");

        invitationsOf[msg.sender][gameId].accepted = true;
        participant[participantId].isAvailable = false;
        participantExists[participantId] = true;

        totalBalance += msg.value;
    }

    function rejectInvitation(uint gameId) public {
        require(gameExists[gameId], "Game does not exist");
        require(invitationsOf[msg.sender][gameId].invitedPlayer == msg.sender, "You are not invited to this game");
        require(!invitationsOf[msg.sender][gameId].accepted, "Invitation is already accepted");

        delete invitationsOf[msg.sender][gameId];

        // Decrement the game invitations count
        if (gameInvitations[gameId] > 0) {
            gameInvitations[gameId]--;
        }
    }

    function getInvitations(address user) public view returns (InvitationStruct[] memory) {
        InvitationStruct[] memory userInvitations;
        uint totalInvitations = 0;

        for (uint i = 1; i <= _gameCounter.current(); i++) {
            if (gameExists[i] && invitationsOf[user][i].invitedPlayer != address(0)) {
                totalInvitations++;
            }
        }

        userInvitations = new InvitationStruct[](totalInvitations);
        uint currentIndex = 0;

        for (uint i = 1; i <= _gameCounter.current(); i++) {
            if (gameExists[i] && invitationsOf[user][i].invitedPlayer != address(0)) {
                userInvitations[currentIndex] = invitationsOf[user][i];
                currentIndex++;
            }
        }

        return userInvitations;
    }


    function startGame(uint gameId) public onlyGameOwner(gameId){
        require(game[gameId].participants == gameInvitations[gameId], "All participants must accept their invitations before starting the game");
        require(!game[gameId].started, "The game has already started");

        game[gameId].started = true;
    }

    // private functions
    function _saveGame(
        uint id,
        string memory caption,
        uint participants,
        uint numberOfWinners,
        uint deadline
    ) private returns (bool) {
        game[id] = GameStruct({
            id: id,
            caption: caption,
            owner: msg.sender,
            participants: participants,
            stake: msg.value,
            numberOfWinners: numberOfWinners,
            deadline: deadline,
            timestamp: _currentTime(),
            isSingleGame: participants == 2,
            started: false,
            deleted: false,
            paidOut: false
        });
        gameExists[id] = true;
        return true;
    }


    function _savePlayer(
        uint id,
        uint gameId,
        uint participantId,
        address _player
    ) private returns (bool) {
        player[id] = PlayerStruct({
            id: id,
            gameId: gameId,
            participantId: participantId,
            player: _player
        });
        playerExists[id] = true;
        return true;
    }

    function _availableParticipants(uint _participants) private view returns(bool) {
        uint256 availableCount = 0;
        for (uint256 i = 1; i <= _participantCounter.current(); i++) {
            if (participant[i].isAvailable) {
                availableCount++;
            }
        }
        return availableCount >=  _participants;
    }

    function _isInvited(uint gameId, address _player) private view returns (bool) {
        return invitationsOf[_player][gameId].invitedPlayer == _player && invitationsOf[_player][gameId].accepted == false;
    }


    function _currentTime() internal view returns (uint256) {
        uint256 newNum = (block.timestamp * 1000) + 1000;
        return newNum;
    }

    function _payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}