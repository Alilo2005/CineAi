'use client'

import { motion } from 'framer-motion'
import { Heart, Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative z-10 p-6 mt-auto"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>by Mahdi Ali</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <motion.a
                href="ma_mahdi@esi.dz"
                className="flex items-center space-x-2 text-gold-100 hover:text-gold-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </motion.a>
              
              <motion.a
                href="https://github.com/Alilo2005"
                className="flex items-center space-x-2 text-gold-100 hover:text-gold-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </motion.a>
            </div>
            
            <p className="text-sm text-gray-400 text-center">
              Discover amazing movies tailored just for you • Powered by AI
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
