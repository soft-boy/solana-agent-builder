import './globals.css'
import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'A modern AI chat interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lexend.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

