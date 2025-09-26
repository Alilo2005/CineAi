'use client'

import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { Movie } from '../types'
import Image from 'next/image'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'

  const shareToInstagramDM = () => {
    const shareText = `Check out this movie recommendation from CineAI!\n\n${movie.title} (${new Date(movie.release_date).getFullYear()})\nRating: ${movie.vote_average.toFixed(1)}/10\n\n${movie.overview.slice(0, 150)}...\n\nMore details: https://www.themoviedb.org/movie/${movie.id}\n\n#CineAI #MovieRecommendation`
    
    // Create Instagram DM URL with pre-filled text
    const instagramDMUrl = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(shareText)}`
    
    // For mobile devices, try to open Instagram app first
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Try Instagram app first
      const instagramAppUrl = `instagram://share?text=${encodeURIComponent(shareText)}`
      window.location.href = instagramAppUrl
      
      // Fallback to web DM after a delay
      setTimeout(() => {
        window.open(instagramDMUrl, '_blank')
      }, 2000)
    } else {
      // For desktop, open Instagram web DM directly
      window.open(instagramDMUrl, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto space-y-3 px-2 sm:px-4"
    >
      {/* Movie Details Card */}
      <div className="glass-effect rounded-xl p-4 sm:p-6 border border-gold-100/20">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative w-32 sm:w-40 lg:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-gold-100/20">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
              />
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold-100 mb-2">
                {movie.title}
              </h3>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 text-sm text-gold-200/80">
                <span className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-medium">{movie.vote_average.toFixed(1)}/10</span>
                </span>
                <span>•</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
            
            <p className="text-white/90 leading-relaxed text-sm sm:text-base line-clamp-3 sm:line-clamp-4">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
      
      {/* Instagram DM Share Button */}
      <div className="flex justify-center px-2">
        <motion.button
          onClick={shareToInstagramDM}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 w-full max-w-xs sm:max-w-none sm:w-auto justify-center"
          whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(236, 72, 153, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          title="Share in Instagram DM"
        >
          <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Share in DM</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
