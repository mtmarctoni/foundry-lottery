"use client"

import { useState } from "react"
import type { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"
import { ShieldAlert, RefreshCw, DollarSign } from "lucide-react"

interface AdminPanelProps {
  lotteryContract: ethers.Contract | null
  lotteryState: number
  onAction: () => void
}

export function AdminPanel({ lotteryContract, lotteryState, onAction }: AdminPanelProps) {
  const { toast } = useToast()
  const [isPerformingAction, setIsPerformingAction] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)

  const performAction = async (action: string) => {
    if (!lotteryContract) return

    try {
      setIsPerformingAction(true)
      setActionType(action)

      let tx
      let description

      switch (action) {
        case "startLottery":
          tx = await lotteryContract.startLottery()
          description = "Starting a new lottery round..."
          break
        case "endLottery":
          tx = await lotteryContract.endLottery()
          description = "Ending the current lottery round..."
          break
        case "withdrawCommission":
          tx = await lotteryContract.withdrawCommission()
          description = "Withdrawing commission..."
          break
        default:
          throw new Error("Invalid action")
      }

      toast({
        title: "Transaction Submitted",
        description,
      })

      await tx.wait()

      toast({
        title: "Success!",
        description: `${
          action === "startLottery"
            ? "New lottery round started!"
            : action === "endLottery"
              ? "Lottery ended and winner selected!"
              : "Commission withdrawn successfully!"
        }`,
      })

      onAction()
    } catch (error: any) {
      console.error(`Error performing ${action}:`, error)
      toast({
        title: "Transaction Failed",
        description: error.message || `Failed to perform ${action}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsPerformingAction(false)
      setActionType(null)
    }
  }

  const isLotteryOpen = lotteryState === 0
  const isLotteryCalculating = lotteryState === 1

  return (
    <Card className="border-destructive/20">
      <CardHeader className="bg-destructive/5 border-b border-destructive/10">
        <div className="flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-destructive" />
          <div>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Lottery management controls</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => performAction("startLottery")}
            disabled={isPerformingAction || isLotteryOpen}
            className="h-auto py-4 flex flex-col items-center justify-center"
          >
            <RefreshCw
              className={`h-5 w-5 mb-2 ${isPerformingAction && actionType === "startLottery" ? "animate-spin" : ""}`}
            />
            <span>{isPerformingAction && actionType === "startLottery" ? "Starting..." : "Start Lottery"}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => performAction("endLottery")}
            disabled={isPerformingAction || !isLotteryOpen || isLotteryCalculating}
            className="h-auto py-4 flex flex-col items-center justify-center"
          >
            <RefreshCw
              className={`h-5 w-5 mb-2 ${isPerformingAction && actionType === "endLottery" ? "animate-spin" : ""}`}
            />
            <span>{isPerformingAction && actionType === "endLottery" ? "Ending..." : "End Lottery"}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => performAction("withdrawCommission")}
            disabled={isPerformingAction}
            className="h-auto py-4 flex flex-col items-center justify-center"
          >
            <DollarSign
              className={`h-5 w-5 mb-2 ${isPerformingAction && actionType === "withdrawCommission" ? "animate-spin" : ""}`}
            />
            <span>
              {isPerformingAction && actionType === "withdrawCommission" ? "Withdrawing..." : "Withdraw Commission"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}