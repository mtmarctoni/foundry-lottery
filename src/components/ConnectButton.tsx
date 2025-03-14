"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/useToast"

export function ConnectButton() {
    // const address = '0x'
    // const isConnected = false
    // const connect = () => {console.log('connect wallet')}
    // const disconnect = () => {console.log('disconnect wallet')}
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
        await connect({
          connector: injected(),
      })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Your wallet address has been copied to clipboard.",
      })
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, "_blank")
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-mono">
            <Wallet className="mr-2 h-4 w-4" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}