"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, MessageSquare, Mic, Wallet, BookOpen } from 'lucide-react'

export function HowItWorksDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out">
          <HelpCircle className="mr-1.5 h-3 w-3" />
          How does it work?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How Solana AI Agent Works</DialogTitle>
          <DialogDescription>
            Understand the key features of our platform
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-start space-x-4">
            <MessageSquare className="h-8 w-8 mt-0.5 text-primary flex-shrink-0" />
            <div className="mt-1">
              <h3 className="font-medium mb-1">AI-Powered Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Engage in natural language conversations about Solana with our advanced AI. Ask questions, explore concepts, and get detailed explanations.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mic className="h-8 w-8 mt-0.5 text-primary flex-shrink-0" />
            <div className="mt-1">
              <h3 className="font-medium mb-1">Voice Interaction</h3>
              <p className="text-sm text-muted-foreground">
                Use the microphone button to speak your queries. Our system converts speech to text and processes your questions in real-time.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Wallet className="h-8 w-8 mt-0.5 text-primary flex-shrink-0" />
            <div className="mt-1">
              <h3 className="font-medium mb-1">Solana Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Solana wallet to access personalized features and real-time blockchain data integration in your conversations.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <BookOpen className="h-8 w-8 mt-0.5 text-primary flex-shrink-0" />
            <div className="mt-1">
              <h3 className="font-medium mb-1">Learning Resources</h3>
              <p className="text-sm text-muted-foreground">
                Access a curated history of conversations to revisit important topics and continue your learning journey in the Solana ecosystem.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

