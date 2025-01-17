'use client'

import { useState } from 'react'
import Disclaimer from '@/components/disclaimer'
import Footer from '@/components/footer'
import { Header } from '@/components/header'

export default function Home() {
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false)
    const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false)

    const toggleLeftDrawer = () => setIsLeftDrawerOpen(!isLeftDrawerOpen)
    const toggleRightDrawer = () => setIsRightDrawerOpen(!isRightDrawerOpen)

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <Header isDrawerOpen={isLeftDrawerOpen} onToggleDrawer={toggleLeftDrawer} isRightDrawerOpen={isRightDrawerOpen} onToggleRightDrawer={toggleRightDrawer} />
            {/* React Flow component here */}
            <Disclaimer />
            <Footer />
        </div>
    )
}

