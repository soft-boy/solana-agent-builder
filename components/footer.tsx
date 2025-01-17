'use client'

import Image from 'next/image'
import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="w-full bg-background border-t border-border py-4 px-4 text-center mt-auto">
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">
          Powered by{' '}
          <span className="inline-flex items-center gap-1">
            <a 
              href="https://elizaos.github.io/eliza/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              <Image 
                src="/eliza.ico" 
                alt="elizaOS" 
                width={16} 
                height={16}
                className="inline-block"
              />
              {' '}
              elizaOS
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
