"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight } from 'lucide-react'

const wallets = [
  { name: 'Phantom', icon: '👻' },
  { name: 'Solflare', icon: '🔆' },
  { name: 'Backpack', icon: '🎒' },
  { name: 'Glow', icon: '✨' },
]

export function WalletDialog() {
  const [open, setOpen] = useState(false)

  const connectWallet = (walletName: string) => {
    console.log(`Connecting to ${walletName}...`)
    // Here you would implement the actual wallet connection logic
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="glow-effect h-7 px-3 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-purple-100/50 dark:hover:shadow-purple-900/50">
          <Wallet className="mr-1.5 h-3 w-3" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to this dapp
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full justify-between"
              onClick={() => connectWallet(wallet.name)}
            >
              <span className="flex items-center">
                <span className="mr-2 text-lg">{wallet.icon}</span>
                {wallet.name}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <DialogDescription className="text-center text-sm">
          New to Solana wallets?{' '}
          <a href="https://solana.com/ecosystem/explore?categories=wallet" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Learn More
          </a>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

