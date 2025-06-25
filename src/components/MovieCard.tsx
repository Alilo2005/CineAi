'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Clock } from 'lucide-react'
import { Movie } from '../types'
import Image from 'next/image'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-xl overflow-hidden max-w-sm"
    >
      <div className="relative">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/60 rounded-lg px-2 py-1 flex items-center space-x-1">
          <Star className="w-4 h-4 text-gold-100" />
          <span className="text-white text-sm font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{movie.title}</h3>
        
        <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Movie</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3">
          {movie.overview}
        </p>
        
        <motion.button
          className="w-full mt-4 py-2 gold-gradient rounded-lg text-dark-400 font-medium hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')
          }}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
}
