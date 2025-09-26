'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Clock, Instagram } from 'lucide-react'
import { Movie } from '../types'
import Image from 'next/image'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'

  const shareToInstagram = () => {
    const shareText = `Just found my perfect movie with CineAI!\n\n${movie.title} (${new Date(movie.release_date).getFullYear()})\nRating: ${movie.vote_average.toFixed(1)}/10\n\n${movie.overview.slice(0, 140)}...\n\n#CineAI #MovieRecommendation #AI #Movies #Film`

    const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`

    // 1) Prefer the Web Share API (lets users pick Instagram DMs on mobile)
    if (typeof window !== 'undefined' && window.navigator && 'share' in window.navigator) {
      // Web Share API available
      (window.navigator as any)
        .share({ title: `${movie.title} • CineAI`, text: shareText, url: tmdbUrl })
        .catch(() => {
          // If user cancels or share fails, try opening Instagram Direct as fallback
          const igDirectAppUrl = 'instagram://direct'
          const igDirectWebUrl = 'https://www.instagram.com/direct/new/'
          const link = document.createElement('a')
          link.href = igDirectAppUrl
          link.click()
          setTimeout(() => {
            window.open(igDirectWebUrl, '_blank')
          }, 1200)
        })
      return
    }

    // 2) Fallback: attempt to open Instagram Direct (app), then web "New message"
    const igDirectAppUrl = 'instagram://direct'
    const igDirectWebUrl = 'https://www.instagram.com/direct/new/'

    const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    )

    if (isMobile) {
      const link = document.createElement('a')
      link.href = igDirectAppUrl
      link.click()
      setTimeout(() => {
        window.open(igDirectWebUrl, '_blank')
      }, 1200)
    } else {
      // Desktop: open Instagram web DMs compose
      window.open(igDirectWebUrl, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-xl overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto"
    >
      <div className="relative">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-40 sm:h-48 md:h-56 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 rounded-md px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-gold-100" />
          <span className="text-white text-xs font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm sm:text-base font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
        
        <div className="flex items-center space-x-3 text-gray-400 text-xs mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Movie</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-3">
          {movie.overview}
        </p>
        
        <div className="flex flex-col gap-2">
          <motion.button
            className="w-full py-2 gold-gradient rounded-lg text-dark-400 text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')
            }}
          >
            View Details
          </motion.button>
          
          <motion.button
            className="w-full py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={shareToInstagram}
            title="Share via Instagram DM"
          >
            <Instagram className="w-3 h-3" />
            <span>Share via Instagram DM</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
