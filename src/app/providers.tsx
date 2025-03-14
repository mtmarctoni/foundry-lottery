"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

import "@/styles/globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { useEffect, useState } from "react"

const queryClient = new QueryClient()

const config = createConfig({
  chains: [mainnet, sepolia],
  // connectors: [injected()],
  transports: {
    [mainnet.id]: http('https://site1.moralis-nodes.com/eth/175cc6d9746f4dcda679da8236a0a2c4'),
    [sepolia.id]: http('https://site1.moralis-nodes.com/sepolia/0c3e4b9bc36d4186982aa0fd1b94e96f'),
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
  
    // useEffect only runs on the client, so we can safely use browser APIs
    useEffect(() => {
      setMounted(true)
    }, [])
  
    // Prevent hydration mismatch by only rendering children when mounted
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {mounted ? children : null}
                </ThemeProvider>
            </QueryClientProvider>
      </WagmiProvider>
    )
  }
