"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useAccount, useSwitchChain, useChainId } from "wagmi"
import { ConnectButton } from "@/components/ConnectButton"
import { LotteryInfo } from "@/components/LotteryInfo"
import { EnterLottery } from "@/components/Enterlottery"
import { AdminPanel } from "@/components/AdminPanel"
import { WinnerSection } from "@/components/WinnerSection"
import { ThemeToggle } from "@/components/ThemeToggle"
import  LotteryABI  from "@/config/lottery-abi.json"
import { supportedChains } from "@/config/chains"
import { Ticket } from "lucide-react"
import { ContractError, ContractErrorType } from "@/components/ContractError"

export default function Home() {
  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const { chains, switchChain } = useSwitchChain()

  const chain = chains.find(c => c.id === chainId)
  const [lotteryContract, setLotteryContract] = useState<ethers.Contract | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [lotteryState, setLotteryState] = useState({
    entranceFee: "0",
    players: [],
    recentWinner: "",
    lotteryState: 0,
    lastTimeStamp: 0,
    balance: "0",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [contractError, setContractError] = useState<{ type: ContractErrorType; error?: Error } | null>(null)


  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !chain) return

      try {
        setIsLoading(true)
        setContractError(null)

        // Check if provider exists
        if (!window.ethereum) {
          setContractError({ type: "NO_PROVIDER" })
          setIsLoading(false)
          return
        }

        // Check if chain is supported
        const chainConfig = supportedChains.find((c) => c.id === chain.id)
        if (!chainConfig) {
          setContractError({ type: "UNSUPPORTED_CHAIN", error: new Error(`Chain ID ${chain.id} not supported`) })
          setIsLoading(false)
          return
        }

        // Check if contract address exists
        if (
          !chainConfig.lotteryAddress ||
          chainConfig.lotteryAddress === "0x1234567890123456789012345678901234567890"
        ) {
          setContractError({ type: "MISSING_ADDRESS" })
          setIsLoading(false)
          return
        }

        // Check if ABI exists
        if (!LotteryABI || LotteryABI.length === 0) {
          setContractError({ type: "MISSING_ABI" })
          setIsLoading(false)
          return
        }

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(chainConfig.lotteryAddress, LotteryABI, signer)

        setLotteryContract(contract)

        // Check if connected user is owner
        const owner = await contract.getOwner()
        setIsOwner(owner.toLowerCase() === address?.toLowerCase())

        await refreshLotteryState(contract)
      } catch (error) {
        console.error("Error initializing contract:", error)
        setContractError({
          type: "CONTRACT_INIT_ERROR",
          error: error instanceof Error ? error : new Error(String(error)),
        })
      } finally {
        setIsLoading(false)
      }
    }

    initContract()
  }, [isConnected, address, chain])

  const refreshLotteryState = async (contract = lotteryContract) => {
    if (!contract) return

    try {
      const entranceFee = await contract.getEntranceFee()
      const players = await contract.getPlayers()
      const recentWinner = await contract.getRecentWinner()
      const lotteryState = await contract.getLotteryState()
      const lastTimeStamp = await contract.getLastTimeStamp()

      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(contract.target)

      setLotteryState({
        entranceFee: ethers.formatEther(entranceFee),
        players: players,
        recentWinner: recentWinner,
        lotteryState: Number(lotteryState),
        lastTimeStamp: Number(lastTimeStamp),
        balance: ethers.formatEther(balance),
      })
    } catch (error) {
      console.error("Error refreshing lottery state:", error)
      setContractError({
        type: "CONTRACT_INIT_ERROR",
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }

  const handleChainSwitch = (chainId: number) => {
    console.log('Switch network')
      switchChain({chainId: chainId})
  }

    // Show contract error if there is one
    if (contractError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background py-8">
          <div className="container max-w-6xl mx-auto px-4">
            <header className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="flex items-center mb-4 md:mb-0">
                <Ticket className="h-8 w-8 mr-2 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Decentralized Lottery</h1>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <ConnectButton />
              </div>
            </header>
  
            <ContractError type={contractError.type} chainId={chain?.id} error={contractError.error} />
          </div>
        </div>
      )
    }

  return (
    <main className="min-h-screen bg-gradient-lottery">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center mb-4 md:mb-0">
            <Ticket className="h-8 w-8 mr-2 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Decentralized Lottery</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </header>

        {isConnected ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2">
                <LotteryInfo
                  lotteryState={lotteryState}
                  isLoading={isLoading}
                  currentChain={chain}
                  supportedChains={supportedChains}
                  onChainSwitch={handleChainSwitch}
                />
              </div>
              <div>
                <EnterLottery
                  lotteryContract={lotteryContract}
                  entranceFee={lotteryState.entranceFee}
                  lotteryState={lotteryState.lotteryState}
                  onEntered={refreshLotteryState}
                />
              </div>
            </div>

            <WinnerSection
              recentWinner={lotteryState.recentWinner}
              address={address}
              lotteryContract={lotteryContract}
              onClaimed={refreshLotteryState}
            />

            {isOwner && (
              <AdminPanel
                lotteryContract={lotteryContract}
                lotteryState={lotteryState.lotteryState}
                onAction={refreshLotteryState}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Decentralized Lottery</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect your wallet to participate in the lottery. Win big with our transparent, fair, and decentralized
              lottery system powered by Chainlink VRF.
            </p>
            <ConnectButton />
          </div>
        )}
      </div>
    </main>
  )
}