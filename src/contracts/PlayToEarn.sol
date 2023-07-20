//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlayToEarn is Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;

    Counters.Counter private _gameCounter;

    struct GameStruct {
        uint id;
        address owner;
        uint participants;
        string gameType;
        uint deadline;
        uint timestamp;
    }

    uint serviceFee = 0.5 ether;
}