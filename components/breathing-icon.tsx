"use client"

import { motion } from 'framer-motion';

const BreathingIcon = () => {
    return (
        <motion.div
        className="w-2 h-2 rounded-full bg-green-500"
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        }}
        />
    );
};

export default BreathingIcon;

