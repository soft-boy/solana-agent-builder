"use client"

import { ConversationDrawer } from './conversation-drawer'
import { HowItWorksDialog } from './how-it-works-dialog'
import { BuyCryptoDialog } from './buy-crypto-dialog'
import { WalletDialog } from './wallet-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileMenu } from './mobile-menu'

interface HeaderProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export function Header({ isDrawerOpen, onToggleDrawer }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <ConversationDrawer isOpen={isDrawerOpen} onToggle={onToggleDrawer} />
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span className="text-sm font-medium">Solana AI Agent for Brookies</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-2">
        <HowItWorksDialog />
        <BuyCryptoDialog />
        <WalletDialog />
        <ThemeToggle />
      </div>

      <MobileMenu />
    </header>
  )
}

