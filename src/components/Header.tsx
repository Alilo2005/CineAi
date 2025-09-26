'use client'

import { motion } from 'framer-motion'
import { Film, Sparkles, Star } from 'lucide-react'

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <motion.div 
            className="flex flex-col items-center space-y-3 sm:space-y-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Logo Section with Enhanced Animation */}
            <div className="relative">
              <motion.div
                className="flex items-center space-x-2 sm:space-x-3"
                animate={{ 
                  filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div 
                  className="relative p-2 sm:p-3 bg-gradient-to-r from-gold-100/20 to-gold-300/20 rounded-xl backdrop-blur-sm border border-gold-100/30"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(255, 215, 0, 0.3)",
                      "0 0 40px rgba(255, 215, 0, 0.5)", 
                      "0 0 20px rgba(255, 215, 0, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Film className="w-6 h-6 sm:w-8 sm:h-8 text-gold-100" />
                  
                  {/* Floating sparkles around the icon */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-200" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-1 -left-1"
                    animate={{ 
                      rotate: -360,
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-gold-300" />
                  </motion.div>
                </motion.div>
                
                {/* Main Title */}
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "linear-gradient(45deg, #ffd700, #ffcc00, #e6b800, #ffd700)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  CineAI
                </motion.h1>
              </motion.div>
            </div>
            
            {/* Enhanced Subtitle */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-medium mb-1">
                AI-Powered Movie Discovery
              </p>
              <motion.p 
                className="text-gold-100/80 text-sm sm:text-base"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Find your perfect film in seconds
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
