'use client'

import { motion } from 'framer-motion'

interface VoiceWaveProps {
  isActive: boolean
  volume: number
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ isActive, volume }) => {
  const bars = [0, 1, 2]
  const maxHeight = 18

  return (
    <div className="flex items-center justify-center space-x-0.5 h-5 w-5">
      {bars.map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-white/80"
          animate={{
            height: isActive ? [6, Math.max(6, volume * maxHeight), 6] : 6,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default VoiceWave

