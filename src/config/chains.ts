import {type SupportedChain} from '@/types/wallet';

export const supportedChains: SupportedChain[] = [
    {
    id: 1,
    name: "Ethereum",
    network: "mainnet",
    lotteryAddress: "0x1234567890123456789012345678901234567890", // Replace with actual deployed contract address
    },
    {
    id: 5,
    name: "Goerli",
    network: "goerli",
    lotteryAddress: "0x1234567890123456789012345678901234567890", // Replace with actual deployed contract address
    },
    {
    id: 137,
    name: "Polygon",
    network: "polygon",
    lotteryAddress: "0x1234567890123456789012345678901234567890", // Replace with actual deployed contract address
    },
    {
    id: 80001,
    name: "Mumbai",
    network: "mumbai",
    lotteryAddress: "0x1234567890123456789012345678901234567890", // Replace with actual deployed contract address
    },
    {
    id: 42161,
    name: "Arbitrum",
    network: "arbitrum",
    lotteryAddress: "0x1234567890123456789012345678901234567890", // Replace with actual deployed contract address
    },
]  