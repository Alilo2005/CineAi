'use client'

import { motion } from 'framer-motion'
import { Film, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Film className="w-8 h-8 text-gold-100" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-gold-200" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-gradient">
              CineAI by Mahdi Ali
            </h1>
          </motion.div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-300 mt-2 text-lg"
        >
          Personalized movie recommendations
        </motion.p>
      </div>
    </motion.header>
  )
}
