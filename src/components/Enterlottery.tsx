"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"
import { Ticket } from "lucide-react"

interface EnterLotteryProps {
  lotteryContract: ethers.Contract | null
  entranceFee: string
  lotteryState: number
  onEntered: () => void
}

export function EnterLottery({ lotteryContract, entranceFee, lotteryState, onEntered }: EnterLotteryProps) {
  const { toast } = useToast()
  const [isEntering, setIsEntering] = useState(false)

  const enterLottery = async () => {
    if (!lotteryContract) return

    try {
      setIsEntering(true)

      const tx = await lotteryContract.enterLottery({
        value: ethers.parseEther(entranceFee),
      })

      toast({
        title: "Transaction Submitted",
        description: "Your lottery entry is being processed...",
      })

      await tx.wait()

      toast({
        title: "Success!",
        description: "You have successfully entered the lottery!",
      })

      onEntered()
    } catch (error: any) {
      console.error("Error entering lottery:", error)
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to enter lottery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEntering(false)
    }
  }

  const isLotteryOpen = lotteryState === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Lottery</CardTitle>
        <CardDescription>Try your luck and win big!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/50">
          <div className="text-center">
            <Ticket className="h-10 w-10 mx-auto mb-2 text-primary" />
            <div className="text-sm text-muted-foreground mb-1">Entrance Fee</div>
            <div className="text-2xl font-bold">{entranceFee} ETH</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={enterLottery} disabled={!lotteryContract || isEntering || !isLotteryOpen}>
          {isEntering ? "Processing..." : isLotteryOpen ? "Enter Lottery" : "Lottery Closed"}
        </Button>
      </CardFooter>
    </Card>
  )
}