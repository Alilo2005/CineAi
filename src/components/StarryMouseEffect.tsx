'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

export default function StarryMouseEffect() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    let starId = 0
    let lastTime = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      // Throttle to max 5 stars per second for better performance
      if (now - lastTime < 200) return
      lastTime = now
      
      const newStar: Star = {
        id: starId++,
        x: e.clientX + (Math.random() - 0.5) * 30,
        y: e.clientY + (Math.random() - 0.5) * 30,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2
      }
      
      setStars(prev => {
        const filtered = prev.filter(star => Date.now() - star.id < 1000) // Remove after 1s
        return [...filtered, newStar].slice(-8) // Keep max 8 stars
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: star.x,
              top: star.y,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 215, 0, 0.5)`
            }}
            initial={{ 
              scale: 0, 
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, star.opacity, 0],
              y: star.y - 30
            }}
            exit={{ 
              scale: 0, 
              opacity: 0
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
