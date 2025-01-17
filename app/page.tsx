'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react'
import Disclaimer from '@/components/disclaimer'
import Footer from '@/components/footer'
import VoiceWave from '@/components/voice-wave'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/header'

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
  const [isMicActive, setIsMicActive] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const toggleMic = () => {
    setIsMicActive(!isMicActive)
  }

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header isDrawerOpen={isDrawerOpen} onToggleDrawer={toggleDrawer} />

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
            <div className="max-w-screen-md mx-auto flex flex-col items-center space-y-2">
              <Button 
                size="lg"
                className={`rounded-full px-6 py-6 text-sm font-medium shadow-lg text-white transition-all duration-300 ease-in-out ${
                  isMicActive 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500'
                }`}
                onClick={toggleMic}
              >
                <div className="flex items-center space-x-2">
                  <AnimatePresence mode="wait" initial={false}>
                    {isMicActive ? (
                      <motion.div
                        key="voice-wave"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <VoiceWave isActive={isMicActive} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="mic-icon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Mic className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span>{isMicActive ? 'Listening...' : 'Click to turn on Microphone'}</span>
                </div>
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

