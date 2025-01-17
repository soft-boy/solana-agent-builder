"use client"

import { ConversationDrawer } from './conversation-drawer'
import { HowItWorksDialog } from './how-it-works-dialog'
import { BuyCryptoDialog } from './buy-crypto-dialog'
import { WalletDialog } from './wallet-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileMenu } from './mobile-menu'
import { CreateAgentDialog } from './create-agent-dialog'

interface HeaderProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export function Header({ isDrawerOpen, onToggleDrawer }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <ConversationDrawer isOpen={isDrawerOpen} onToggle={onToggleDrawer} />
        <CreateAgentDialog />
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

