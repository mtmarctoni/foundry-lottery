"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"
import { Trophy, ArrowRight } from "lucide-react"

interface WinnerSectionProps {
  recentWinner: string
  address: string | undefined
  lotteryContract: ethers.Contract | null
  onClaimed: () => void
}

export function WinnerSection({ recentWinner, address, lotteryContract, onClaimed }: WinnerSectionProps) {
  const { toast } = useToast()
  const [isClaiming, setIsClaiming] = useState(false)

  const isWinner = address && recentWinner && address.toLowerCase() === recentWinner.toLowerCase()
  const hasWinner = recentWinner && recentWinner !== ethers.ZeroAddress

  const claimPrize = async () => {
    if (!lotteryContract || !isWinner) return

    try {
      setIsClaiming(true)

      const tx = await lotteryContract.claimPrize()

      toast({
        title: "Claiming Prize",
        description: "Your prize claim is being processed...",
      })

      await tx.wait()

      toast({
        title: "Success!",
        description: "You have successfully claimed your prize!",
      })

      onClaimed()
    } catch (error: any) {
      console.error("Error claiming prize:", error)
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to claim prize. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  if (!hasWinner) {
    return null
  }

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-primary" />
          <div>
            <CardTitle>Recent Winner</CardTitle>
            <CardDescription>The most recent lottery winner</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="text-sm font-medium text-muted-foreground mb-1">Winner Address</div>
            <div className="font-mono text-sm md:text-base break-all">{recentWinner}</div>
          </div>

          {isWinner && (
            <Button onClick={claimPrize} disabled={isClaiming} className="min-w-32">
              {isClaiming ? (
                "Claiming..."
              ) : (
                <>
                  Claim Prize
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}