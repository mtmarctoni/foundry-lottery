"use client"

import { type Chain } from "wagmi/chains"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Coins, Clock, ArrowRightLeft } from "lucide-react"
import {type SupportedChain } from "@/types/wallet"

interface LotteryInfoProps {
  lotteryState: {
    entranceFee: string
    players: string[]
    recentWinner: string
    lotteryState: number
    lastTimeStamp: number
    balance: string
  }
  isLoading: boolean
  currentChain: Chain | undefined
  supportedChains: SupportedChain[]
  onChainSwitch: (chainId: number) => void
}

export function LotteryInfo({
  lotteryState,
  isLoading,
  currentChain,
  supportedChains,
  onChainSwitch,
}: LotteryInfoProps) {
  const getLotteryStateText = () => {
    switch (lotteryState.lotteryState) {
      case 0:
        return "Open"
      case 1:
        return "Calculating"
      default:
        return "Unknown"
    }
  }

  const getLotteryStateColor = () => {
    switch (lotteryState.lotteryState) {
      case 0:
        return "bg-green-500"
      case 1:
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lottery Status</CardTitle>
            <CardDescription>Current lottery information</CardDescription>
          </div>
          <div className="flex items-center">
            <div className="mr-2">Status:</div>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <Badge variant="outline" className="font-medium">
                <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getLotteryStateColor()}`}></span>
                {getLotteryStateText()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <Coins className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Entrance Fee</div>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <div className="font-bold">{lotteryState.entranceFee} ETH</div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Players</div>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="font-bold">{lotteryState.players.length}</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Coins className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Prize Pool</div>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <div className="font-bold">{lotteryState.balance} ETH</div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                {isLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <div className="font-bold">
                    {lotteryState.lastTimeStamp > 0
                      ? new Date(lotteryState.lastTimeStamp * 1000).toLocaleString()
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <div className="text-sm font-medium text-muted-foreground mb-1">Network</div>
              <div className="flex items-center">
                <ArrowRightLeft className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span className="font-medium">{currentChain?.name || "Not Connected"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {supportedChains.map((chain) => (
                <Button
                  key={chain.id}
                  size="sm"
                  variant={currentChain?.id === chain.id ? "default" : "outline"}
                  onClick={() => onChainSwitch(chain.id)}
                >
                  {chain.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}