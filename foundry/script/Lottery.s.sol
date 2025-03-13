// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {Lottery} from "../src/Lottery.sol";

contract LotteryScript is Script {
    Lottery public lottery;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        lottery = new Lottery();

        vm.stopBroadcast();
    }
}
