'use client'

import { motion } from 'framer-motion'

interface VoiceWaveProps {
  isActive: boolean
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ isActive }) => {
  return (
    <div className="flex items-center justify-center space-x-0.5 h-5 w-5">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-white/80"
          animate={{
            height: isActive ? [6, 12, 18, 12, 6] : 6,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default VoiceWave

