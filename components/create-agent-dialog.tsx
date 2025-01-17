'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CreateAgentDialog() {
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')

  const handleCreateAgent = () => {
    // Here you would typically handle the agent creation logic
    console.log('Creating agent:', { name: agentName, description: agentDescription })
    // Reset form and close dialog
    setAgentName('')
    setAgentDescription('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-sm font-medium">Create Agent</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Set up a new AI agent with a name and description. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agent-name" className="text-right">
              Name
            </Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agent-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="agent-description"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateAgent}>Create Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

