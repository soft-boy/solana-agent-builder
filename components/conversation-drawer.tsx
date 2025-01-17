"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

const conversations = [
  { id: 1, title: "Introduction to Solana", date: "2023-05-15" },
  { id: 2, title: "Smart Contracts on Solana", date: "2023-05-16" },
  { id: 3, title: "Solana vs Ethereum", date: "2023-05-17" },
  { id: 4, title: "Solana Tokenomics", date: "2023-05-18" },
  { id: 5, title: "Solana DeFi Ecosystem", date: "2023-05-19" },
]

interface ConversationDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ConversationDrawer({ isOpen, onToggle }: ConversationDrawerProps) {
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle conversation history</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>Conversation History</SheetTitle>
            <SheetClose asChild>
            </SheetClose>
          </SheetHeader>
          <SheetDescription className="mt-2">
            Browse your past conversations about Solana
          </SheetDescription>
          <div className="mt-4 space-y-4">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={onToggle}
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
        </SheetContent>
      </Sheet>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="hidden md:flex"
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isOpen ? "Close conversation history" : "Open conversation history"}
        </span>
      </Button>
    </>
  )
}

