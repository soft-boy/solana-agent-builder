'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Bot, Brain, Database, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function AlphaDisclaimer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenAIAgentDisclaimer')
    if (!hasSeenDisclaimer) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('hasSeenAIAgentDisclaimer', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full max-w-7xl p-6 md:p-12 
       rounded-xl shadow-xl
      text-white overflow-y-auto">
        <button 
          onClick={handleDismiss} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="flex flex-col items-center mb-8">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <h2 className="text-4xl font-bold text-center">Solana AI Agent Project: Alpha Version</h2>
        </div>
        <p className="text-xl mb-8 text-center max-w-3xl mx-auto">
          Listen up, you're about to dive into a powerful AI system, still in the alpha phase. Stay alert, keep your mind sharp, and be ready to handle the raw, untamed intelligence. Let’s break it down:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start gap-4">
            <Bot className="h-8 w-8 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Experimental AI Capabilities</h3>
              <p>This AI isn’t perfect yet. It’s raw, and its responses may not always make sense. If you can't handle unpredictability, this isn't for you.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Brain className="h-8 w-8 text-purple-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Ongoing Development</h3>
              <p>We're constantly upgrading. Features will change, adapt, and improve, but if you can’t keep up with the pace of progress, step aside.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Database className="h-8 w-8 text-green-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Data Handling</h3>
              <p>Your data’s safe, but don’t get too comfortable. Be smart about what you share. Not everything should be put out in the open.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MessageSquare className="h-8 w-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Feedback is Crucial</h3>
              <p>Your input will shape the future of this AI. Report bugs, suggest changes, but don’t waste time complaining without a solution.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={handleDismiss}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-20 transition-all duration-300 text-lg py-6 px-12"
          >
            I Understand, I'm Not a Brookie
          </Button>
        </div>
      </div>
    </div>
  )
}
