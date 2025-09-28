'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Clock, PlayCircle, Download } from 'lucide-react'
import { Movie } from '../types'
import Image from 'next/image'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'

  // Download the full-size poster image; falls back to opening in a new tab
  const downloadPoster = async () => {
    if (!movie.poster_path) {
      window.alert('No poster available to download for this title.')
      return
    }

    const originalUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
    const slug = `${movie.title}${releaseYear ? '-' + releaseYear : ''}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const fileName = `${slug}-poster.jpg`

    try {
      const res = await fetch(originalUrl, { mode: 'cors' })
      if (!res.ok) throw new Error('Failed to fetch image')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      // Some CDNs may block CORS; open the original image so users can save manually
      const a = document.createElement('a')
      a.href = originalUrl
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.click()
    }
  }

  // Build a Rivestream search URL using the movie title (and year if available)
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
  const rivestreamQuery = [movie.title, releaseYear].filter(Boolean).join(' ')
  const rivestreamUrl = `https://rivestream.org/search?q=${encodeURIComponent(rivestreamQuery)}`

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
          
          {/* Rivestream search button */}
          <motion.a
            href={rivestreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Find ${movie.title} on Rivestream`}
            className="w-full py-2 px-3 bg-white/5 border border-gold-100/40 rounded-lg text-gold-100 text-xs sm:text-sm font-medium hover:bg-gold-100/10 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlayCircle className="w-3 h-3" />
            <span>Find on Rivestream</span>
          </motion.a>
          
          <motion.button
            className="w-full py-2 px-3 bg-gradient-to-r from-gold-200 to-gold-400 rounded-lg text-dark-400 text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadPoster}
            title="Download Poster"
            aria-label={`Download poster for ${movie.title}`}
          >
            <Download className="w-3 h-3" />
            <span>Download Poster</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
