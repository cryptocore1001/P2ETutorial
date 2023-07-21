//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlayToEarn is Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;

    Counters.Counter private _gameCounter;
    Counters.Counter private _playerCounter;
    Counters.Counter private _participantCounter;

    struct GameStruct {
        uint id;
        string caption;
        address owner;
        uint participants;
        uint deadline;
        uint timestamp;
        bool isSingleGame;
        bool deleted;
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

    uint private totalBalance;
    uint serviceFee = 0.5 ether;

    // for saving platform related data
    mapping(uint => GameStruct) game;
    mapping(uint => PlayerStruct) player;
    mapping(uint => ParticipantStruct) participant;

    // check for existence of platform resources
    mapping(uint => bool) gameExists;
    mapping(uint => bool) playerExists;
    mapping(uint => bool) participantExists;


    mapping(uint => bool) gameHasPlayers;


    // Game functions

    function createGame(
        string memory caption,
        uint participants,
        uint deadline
    ) public onlyOwner {
        require(!_availableParticipants(participants),"Available participants not enough");
        require(bytes(caption).length > 0, "Caption is required!");
        require(deadline > 0, "Duration should be greater than zero!");

        _gameCounter.increment();

        game[_gameCounter.current()] = GameStruct({
            id:_gameCounter.current(),
            caption: caption,
            owner: msg.sender,
            participants: participants,
            deadline: deadline,
            timestamp: _currentTime(),
            isSingleGame: participants > 2 ? true : false,
            deleted: false
        });
    }

    

    function getGames() public view returns (GameStruct[] memory) {
        uint activeGameCount = 0;
        uint256 currentTime = _currentTime();

        // Count the number of active games
        for (uint256 i = 1; i <= _gameCounter.current(); i++) {
            if (!game[i].deleted && game[i].deadline > currentTime) {
                activeGameCount++;
            }
        }

        // Create an array to store active games
        GameStruct[] memory activeGames = new GameStruct[](activeGameCount);
        uint activeIndex = 0;

        // Populate the activeGames array with active games
        for (uint256 i = 1; i <= _gameCounter.current(); i++) {
            if (!game[i].deleted && game[i].deadline > currentTime) {
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

    // private functions

    function _availableParticipants(uint _participants) private view returns(bool) {
        uint256 availableCount = 0;
        for (uint256 i = 1; i <= _participantCounter.current(); i++) {
            if (participant[i].isAvailable) {
                availableCount++;
            }
        }
        return availableCount >=  _participants;
    }

     function _randomNum(
        uint256 _mod,
        uint256 _seed,
        uint256 _salt
    ) internal view returns (uint256) {
        uint256 num = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, _seed, _salt)
            )
        ) % _mod;
        return num;
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