//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlayToEarn is Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;

    Counters.Counter private _gameCounter;
    Counters.Counter private _playerCounter;
    Counters.Counter private _volunteerCounter;

    struct GameStruct {
        uint id;
        string caption;
        address owner;
        uint participants;
        uint deadline;
        uint timestamp;
        bool isSingleGame;
        bool start;
        bool gameCompleted;
        bool deleted;
    }

    struct PlayerStruct {
        uint id;
        uint participantId;
        uint gameId;
        address player;
    }


    struct VolunteerStruct {
        uint id;
        address participants;
        bool isAvailable;
    }

    uint private totalBalance;
    uint private MAX_PARTICIPANTS_SINGLE = 2;
    uint private MIN_PARTICIPANTS_GROUP = 3;
    uint256 private ONE_DAY_IN_SECONDS = 86400;
    uint serviceFee = 0.5 ether;
    bool hasVolunteers = false;

    // for saving platform related data
    mapping(uint => GameStruct) game;
    mapping(uint => PlayerStruct) player;
    mapping(uint => VolunteerStruct) volunteer;

    // check for existence of platform resources
    mapping(uint => bool) gameExists;
    mapping(uint => bool) playerExists;
    mapping(uint => bool) ParticipantExists;


    mapping(uint => bool) gameHasPlayers;

    function createGame(
        string memory caption,
        uint participants,
        uint duration
    ) public onlyOwner {
        require(!hasVolunteers,"There are no available volunteers to add to game!");
        require(bytes(caption).length > 0, "Caption is required!");
        require(!_availableVolunteers(participants),"Available volunteers not enough");
        require(duration > 0, "Duration should be greater than zero!");

        _gameCounter.increment();

        // game[_gameCounter.current()] = GameStruct({
        //     id:_gameCounter.current()

        // });
    }

    // private functions

    function _availableVolunteers(uint _participants) private view returns(bool) {
        uint256 availableCount = 0;
        for (uint256 i = 1; i <= _volunteerCounter.current(); i++) {
            if (volunteer[i].isAvailable) {
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