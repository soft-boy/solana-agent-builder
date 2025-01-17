'use client'

import { motion } from 'framer-motion'

interface VoiceWaveProps {
  isActive: boolean
}

const VoiceWave = ({ isActive }: VoiceWaveProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full">
      <motion.div
        className="relative w-4 h-4"
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 3V21M8 7V17M16 7V17M4 11V13M20 11V13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
      <span className="text-white font-medium">Listening...</span>
    </div>
  )
}

export default VoiceWave

// Example usage:
export function Demo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <VoiceWave isActive={true} />
    </div>
  )
}

