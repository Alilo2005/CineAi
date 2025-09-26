'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Clock, Instagram, Share2 } from 'lucide-react'
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
    const shareText = `Just found my perfect movie with CineAI!\n\n${movie.title} (${new Date(movie.release_date).getFullYear()})\nRating: ${movie.vote_average.toFixed(1)}/10\n\n${movie.overview.slice(0, 100)}...\n\n#CineAI #MovieRecommendation #AI #Movies #Film`
    
    // Try to open Instagram app first (mobile), fallback to web
    const instagramAppUrl = `instagram://share?text=${encodeURIComponent(shareText)}`
    const instagramWebUrl = `https://www.instagram.com/`
    
    // For mobile devices, try to open the Instagram app
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Create a temporary link to test if Instagram app is available
      const tempLink = document.createElement('a')
      tempLink.href = instagramAppUrl
      tempLink.click()
      
      // Fallback to web after a short delay if app doesn't open
      setTimeout(() => {
        // Copy text to clipboard for easy sharing
        navigator.clipboard?.writeText(shareText).then(() => {
          alert('Movie details copied to clipboard! Open Instagram to share.')
          window.open(instagramWebUrl, '_blank')
        }).catch(() => {
          // If clipboard API isn't available, show the text
          prompt('Copy this text to share on Instagram:', shareText)
        })
      }, 2000)
    } else {
      // For desktop, copy to clipboard and open Instagram web
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          alert('Movie details copied to clipboard! Open Instagram to share.')
          window.open(instagramWebUrl, '_blank')
        })
      } else {
        // Fallback for older browsers
        prompt('Copy this text to share on Instagram:', shareText)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-xl overflow-hidden w-full max-w-sm mx-auto"
    >
      <div className="relative">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 rounded-lg px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-100" />
          <span className="text-white text-xs sm:text-sm font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-gray-400 text-xs sm:text-sm mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Movie</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
          {movie.overview}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <motion.button
            className="flex-1 py-2 sm:py-2.5 gold-gradient rounded-lg text-dark-400 text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')
            }}
          >
            View Details
          </motion.button>
          
          <motion.button
            className="flex-1 sm:flex-none py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={shareToInstagram}
            title="Share on Instagram"
          >
            <Instagram className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
