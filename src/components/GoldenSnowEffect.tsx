'use client'

import { useEffect, useState } from 'react'

interface Snowflake {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

export default function GoldenSnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {    // Create only 6 snowflakes maximum
    const createSnowflake = (): Snowflake => ({
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 4 + 3, // Much bigger and more visible
      opacity: Math.random() * 0.7 + 0.4, // Much more visible
      speed: Math.random() * 1 + 0.5 // Faster movement
    })    // Initial snowflakes - make more visible
    setSnowflakes([
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake(),
      createSnowflake() // 10 snowflakes for better visibility
    ])

    // Animation loop with lower frame rate
    const animate = () => {
      setSnowflakes(prev => 
        prev.map(flake => ({
          ...flake,
          y: flake.y + flake.speed,
          x: flake.x + Math.sin(flake.y * 0.01) * 0.2
        })).filter(flake => flake.y < window.innerHeight + 20)
      )
    }

    // Slow down animation to 10fps
    const animationInterval = setInterval(animate, 100)    // Add new snowflakes more frequently for visibility
    const spawnInterval = setInterval(() => {
      setSnowflakes(prev => {
        if (prev.length < 12) { // Allow more snowflakes
          return [...prev, createSnowflake()]
        }
        return prev
      })
    }, 1500) // Every 1.5 seconds

    return () => {
      clearInterval(animationInterval)
      clearInterval(spawnInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {snowflakes.map(flake => (        <div
          key={flake.id}
          className="absolute bg-yellow-400 rounded-full shadow-lg"
          style={{
            left: flake.x + 'px',
            top: flake.y + 'px',
            width: flake.size + 'px',
            height: flake.size + 'px',
            opacity: flake.opacity,
            boxShadow: `0 0 ${flake.size * 3}px rgba(255, 215, 0, 0.8), 0 0 ${flake.size * 6}px rgba(255, 215, 0, 0.4)` // Much more visible glow
          }}
        />
      ))}
    </div>
  )
}
