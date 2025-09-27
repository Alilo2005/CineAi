'use client'

import { motion } from 'framer-motion'
import { Heart, Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative z-10 px-4 py-6 sm:px-6 mt-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="glass-effect rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-300 text-center">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <a
                href="https://alilo2005.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-100 hover:text-gold-200 underline transition-colors"
                >
                by Mahdi Ali
                </a>
            </div>
            
            {/* Action links - wrap and center on small screens */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <motion.a
                href="mailto:ma_mahdi@esi.dz"
                aria-label="Contact via email"
                className="flex items-center gap-2 text-gold-100 hover:text-gold-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </motion.a>
              
              <motion.a
                href="https://github.com/Alilo2005"
                aria-label="Visit GitHub profile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gold-100 hover:text-gold-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </motion.a>
            </div>
            
            <p className="text-[11px] sm:text-sm text-gray-400 text-center leading-relaxed">
              Discover amazing movies tailored just for you • Powered by AI
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
