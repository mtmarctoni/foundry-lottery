// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {Lottery} from "../src/Lottery.sol";
import {HelperConfigScript} from "./HelperConfig.s.sol";

contract DeployLotteryScript is Script {
    function setUp() public {}

    function run() public returns (Lottery, HelperConfigScript) {
        return deployLotteryContract();
    }

    function deployLotteryContract()
        public
        returns (Lottery, HelperConfigScript)
    {
        HelperConfigScript helperConfig = new HelperConfigScript();
        HelperConfigScript.NetworkConfig memory config = helperConfig
            .getConfig();

        vm.startBroadcast();
        Lottery lottery = new Lottery(
            config.entranceFee,
            config.interval,
            config.vrfCoordinator,
            config.gasLane,
            config.subscriptionId,
            config.callbackGasLimit
        );
        vm.stopBroadcast();

        return (lottery, helperConfig);
    }
}
