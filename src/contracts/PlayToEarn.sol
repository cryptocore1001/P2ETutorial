//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlayToEarn is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private totalGame;
    Counters.Counter private totalPlayers;

    struct GameStruct {
        uint id;
        string description;
        address owner;
        uint participants;
        uint numberOfWinners;
        uint plays;
        uint acceptees;
        uint stake;
        uint startDate;
        uint endDate;
        uint timestamp;
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
        address account;
        bool responded;
    }

    struct PlayerScoreSheetStruct {
        uint gameId;
        address player;
        uint score;
        bool played;
    }

    uint private totalBalance;
    uint serviceFee = 0.5 ether;

    mapping(uint => GameStruct) games;
    mapping(uint => PlayerStruct) players;
    mapping(address => mapping(uint => InvitationStruct)) invitationsOf;
    mapping(uint => mapping(address => bool)) isListed;

    mapping(uint => bool) gameExists;
    mapping(uint => bool) playerExists;
    mapping(uint => mapping(address => bool)) invitationExists;
    mapping(uint => mapping(address => PlayerScoreSheetStruct)) scores;


    mapping(uint => bool) gameHasPlayers;

    modifier onlyGameOwner(uint gameId) {
        require(gameExists[gameId], "Game does not exist!");
        require(msg.sender == games[gameId].owner, "Unauthorized entity");
        _;
    }

    function createGame(
        uint participantId,
        string memory description,
        uint participants,
        uint numberOfWinners,
        uint startDate,
        uint endDate
    ) public payable {
        require(msg.value > 0 ether, "Stake funds is required");
        require(participants > 1, "Partiticpants must be greater than one");
        require(bytes(description).length > 0, "Description is required!");
        require(startDate > 0, "Start date must be greater than zero");
        require(endDate > startDate, "End date must be greater than start date");
        require(numberOfWinners > 0, "Number Of winners required!");

        totalGame.increment();
        uint gameId = totalGame.current();

        bool isCreated = _saveGame(gameId, description, participants, numberOfWinners, startDate);
        require(isCreated, "Game creation failed");

        isCreated = _savePlayer(gameId, participantId);
        require(isCreated, "Player creation failed");
    }  

    function getGames() public view returns (GameStruct[] memory ActiveGames) {
        uint available;

        for (uint256 i = 1; i <= totalGame.current(); i++) {
            if (!games[i].deleted && !games[i].paidOut && games[i].endDate > currentTime()) {
                available++;
            }
        }

        ActiveGames = new GameStruct[](available);
        uint index;

        for (uint256 i = 1; i <= totalGame.current(); i++) {
            if (!games[i].deleted && !games[i].paidOut && games[i].endDate > currentTime()) {
                ActiveGames[index++] = games[i];
            }
        }
    }

    function getGame(uint id) public view returns(GameStruct memory) {
        return games[id];
    }


    function invitePlayer(address playerAccount, uint gameId) public {
        require(gameExists[gameId], "Game does not exist");
        require(!isListed[gameId][playerAccount], "Player is already in this game");

        invitationsOf[playerAccount][gameId] = InvitationStruct({
            account: playerAccount,
            responded: false
        });
    }

    function acceptInvitation(uint gameId, uint participantId) public payable {
        require(gameExists[gameId], "Game does not exist");
        require(msg.value >= games[gameId].stake, "Insuffcient funds for stakes");
        require(invitationsOf[msg.sender][gameId].account == msg.sender, "Unauthorized entity");
        require(!invitationsOf[msg.sender][gameId].responded, "Previouly responded");
        
        bool isCreated = _savePlayer(gameId, participantId);
        require(isCreated, "Player creation failed");

        invitationsOf[msg.sender][gameId].responded = true;
    }

    function rejectInvitation(uint gameId) public {
        require(gameExists[gameId], "Game does not exist");
        require(invitationsOf[msg.sender][gameId].account == msg.sender, "You are not invited to this game");
        require(!invitationsOf[msg.sender][gameId].responded, "Invitation is already rejected");

        invitationsOf[msg.sender][gameId].responded = true;
    }

    function getInvitations() public view returns (InvitationStruct[] memory Invitations) {
        uint totalInvitations;

        for (uint i = 1; i <= totalGame.current(); i++) {
            if (invitationsOf[msg.sender][i].account == msg.sender) totalInvitations++;
        }

        Invitations = new InvitationStruct[](totalInvitations);
        uint index;

        for (uint i = 1; i <= totalGame.current(); i++) {
            if (invitationsOf[msg.sender][i].account == msg.sender) {
                Invitations[index++] = invitationsOf[msg.sender][i];
            }
        }
    }


    function recordScore(uint gameId, uint score) public {
        require(games[gameId].numberOfWinners + 1 == games[gameId].acceptees, "Not enough players yet");
        require(!scores[gameId][msg.sender].played, "Player already recorded");
        require(currentTime() >= games[gameId].startDate && currentTime() < games[gameId].endDate, "Game play must be in session");

        scores[gameId][msg.sender].score = score;
        scores[gameId][msg.sender].played = true;
    }

    function getScores(uint gameId) public view returns (PlayerScoreSheetStruct[] memory Scores) {
        uint available;
        for (uint i = 1; i <= totalPlayers.current(); i++) {
            if(players[i].gameId == gameId) available++;
        }

        Scores = new PlayerScoreSheetStruct[](available);

        uint index;
        for (uint i = 1; i <= totalPlayers.current(); i++) {
            if(players[i].gameId == gameId) {
                Scores[index++] = scores[gameId][players[i].player];
            }
        }
    }

    function sortScores(PlayerScoreSheetStruct[] memory playersScores) public pure returns (PlayerScoreSheetStruct[] memory) {
        uint n = playersScores.length;
        
        for (uint i = 0; i < n - 1; i++) {
            for (uint j = 0; j < n - i - 1; j++) {
                // Check if the players played before comparing their scores
                if (playersScores[j].played && playersScores[j + 1].played) {
                    if (playersScores[j].score > playersScores[j + 1].score) {
                        // Swap the elements
                        PlayerScoreSheetStruct memory temp = playersScores[j];
                        playersScores[j] = playersScores[j + 1];
                        playersScores[j + 1] = temp;
                    }
                } else if (!playersScores[j].played && playersScores[j + 1].played) {
                    // Sort players who didn't play below players who played
                    // Swap the elements
                    PlayerScoreSheetStruct memory temp = playersScores[j];
                    playersScores[j] = playersScores[j + 1];
                    playersScores[j + 1] = temp;
                }
            }
        }
    
        return playersScores;
    }

    function payout(uint gameId) public {
        require(gameExists[gameId], "Game does not exist");
        require(currentTime() > games[gameId].endDate, "Game still in session");
        require(!games[gameId].paidOut, "Game already paid out");

        uint fee = games[gameId].stake * serviceFee / 100;
        uint profit = games[gameId].stake - fee;
        _payTo(owner(), fee);

        uint available;
        for (uint i = 1; i <= totalPlayers.current(); i++) {
            if(players[i].gameId == gameId) available++;
        }

        PlayerScoreSheetStruct[] memory Scores = new PlayerScoreSheetStruct[](available);

        uint index;
        for (uint i = 1; i <= totalPlayers.current(); i++) {
            if(players[i].gameId == gameId) {
                Scores[index++] = scores[gameId][players[i].player];
            }
        }

        Scores = sortScores(Scores);

        for (uint i = 0; i < games[gameId].numberOfWinners; i++) {
            _payTo(Scores[i].player, profit / games[gameId].numberOfWinners);
        }
    }

    function _saveGame(
        uint gameId,
        string memory description,
        uint participants,
        uint numberOfWinners,
        uint endDate
    ) internal returns (bool) {

        GameStruct memory gameData;
        gameData.id = gameId;
        gameData.description =  description;
        gameData.owner =  msg.sender;
        gameData.participants =  participants;
        gameData.acceptees =  1;
        gameData.stake =  msg.value;
        gameData.numberOfWinners =  numberOfWinners;
        gameData.endDate =  endDate;
        gameData.timestamp =  currentTime();

        games[gameId] = gameData;
        gameExists[gameId] = true;
        return true;
    }


    function _savePlayer(
        uint gameId,
        uint participantId
    ) internal returns (bool) {
        totalPlayers.increment();
        uint playerId = totalPlayers.current();

        players[playerId] = PlayerStruct({
            id: playerId,
            gameId: gameId,
            participantId: participantId,
            player: msg.sender
        });

        isListed[gameId][msg.sender] = true;
        playerExists[playerId] = true;

        games[gameId].acceptees++;
        totalBalance += msg.value;
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