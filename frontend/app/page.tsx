'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import Disclaimer from '@/components/disclaimer'
import { WalletDialog } from '@/components/wallet-dialog'
import SolanaIcon from '@/components/solana-icon'
import { ConversationDrawer } from '@/components/conversation-drawer'
import { HowItWorksDialog } from '@/components/how-it-works-dialog'
import Footer from '@/components/footer'

const conversations = [
  { id: 1, title: "Introduction to Solana", date: "2023-05-15" },
  { id: 2, title: "Smart Contracts on Solana", date: "2023-05-16" },
  { id: 3, title: "Solana vs Ethereum", date: "2023-05-17" },
  { id: 4, title: "Solana Tokenomics", date: "2023-05-18" },
  { id: 5, title: "Solana DeFi Ecosystem", date: "2023-05-19" },
]

export default function Chat() {
  const [messages] = useState([
    {
      role: 'user',
      content: 'Hello!',
      timestamp: '10:15 AM',
    },
    {
      role: 'assistant',
      content: 'Hi there! How can I assist you today?',
      timestamp: '10:16 AM',
    },
    {
      role: 'user',
      content: 'Can you tell me what is Solana?',
      timestamp: '10:16 AM',
    },
    {
      role: 'assistant',
      content: 'Of course! Solana is a high-performance blockchain platform designed for decentralized applications and cryptocurrencies. It\'s known for its fast transaction speeds and low fees. Using proof of history (PoH), Solana\'s scalability and efficiency make it a popular choice for developers and projects in the crypto space. Anything else you\'d like to know about Solana?',
      timestamp: '10:16 AM',
    }
  ])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <ConversationDrawer isOpen={isDrawerOpen} onToggle={toggleDrawer} />
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-sm font-medium">Solana AI Agent for Brookies</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <HowItWorksDialog />
          <Button variant="ghost" size="sm" className="glow-effect h-7 px-3 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-green-100/50 dark:hover:shadow-green-900/50">
            <SolanaIcon className="mr-1.5 h-3 w-3" />
            Buy Crypto
          </Button>
          <WalletDialog />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className={`hidden md:block ${isDrawerOpen ? 'w-64' : 'w-0'} overflow-y-auto border-r border-border transition-all duration-300`}>
          {isDrawerOpen && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Conversation History</h2>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className="w-full justify-start text-left"
                  >
                    <div>
                      <div className="font-medium">{conversation.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {conversation.date}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isDrawerOpen ? 'md:ml-64' : ''}`}>
          <div className="flex-grow overflow-y-auto px-4 py-6" ref={chatWindowRef}>
            <div className="max-w-screen-md mx-auto">
              <div className="text-xs text-muted-foreground mb-4 font-mono">Current Conversation</div>
              
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {message.role === 'user' ? 'User' : 'Sola'}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="max-w-screen-md mx-auto flex justify-center">
              <Button 
                size="lg"
                className="rounded-full px-6 py-6 text-sm font-medium shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 ease-in-out"
              >
                <Mic className="mr-2 h-5 w-5" />
                Click to turn on Microphone
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Disclaimer />
      <Footer />
    </div>
  )
}

