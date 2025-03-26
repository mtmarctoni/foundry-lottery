// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Lottery} from "../src/Lottery.sol";

contract LotteryTest is Test {
    Lottery lottery;

    address vrfCoordinatorMainnet = 0x271682DEB8C4E0901D1a1550aD2e64D568E69909;
    address vrfCoordinatorSepolia = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;

    function setUp() public {
        lottery = new Lottery(
            0.1 ether,
            1 days,
            vrfCoordinatorSepolia,
            bytes32(0),
            0,
            100000
        );
    }

    function testEnterLotteryWithSufficientFunds() public {
        lottery.enterLottery{value: 0.1 ether}();
        // Check that the player is added to the list of players
        // Check that the PlayerEntered event is emitted
        lottery.enterLottery{value: 0.1 ether}();
        // Check that the player is added to the list of players
        // Check that the PlayerEntered event is emitted
    }

    function testEnterLotteryWithInsufficientFunds() public {
        vm.expectRevert(Lottery.Lottery__NotEnoughFunds.selector);
        lottery.enterLottery{value: 0.05 ether}();
        vm.expectRevert(Lottery.Lottery__NotEnoughFunds.selector);
        lottery.enterLottery{value: 0.05 ether}();
    }

    function testPickWinnerAfterTimeInterval() public {
        // Simulate the passing of time
        vm.warp(block.timestamp + 1 days);
        lottery.enterLottery{value: 0.1 ether}();
        lottery.performUpkeep("");
        // Check that the WinnerPicked event is emitted
        // Simulate the passing of time
        vm.warp(block.timestamp + 1 days);
        lottery.enterLottery{value: 0.1 ether}();
        lottery.performUpkeep("");
        // Check that the WinnerPicked event is emitted
    }

    function testLotteryStateResetsAfterPickingWinner() public {
        // Simulate the passing of time
        vm.warp(block.timestamp + 1 days);
        lottery.enterLottery{value: 0.1 ether}();
        lottery.performUpkeep("");
        // Check that the lottery state is set back to OPEN
        // Simulate the passing of time
        vm.warp(block.timestamp + 1 days);
        lottery.enterLottery{value: 0.1 ether}();
        lottery.performUpkeep("");
        // Check that the lottery state is set back to OPEN
    }
}
