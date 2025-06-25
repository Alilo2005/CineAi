import { Movie, TMDBResponse } from '../types'

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
const tmdbBaseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL

export async function searchMovieByTitle(title: string, language?: string): Promise<Movie | null> {
  try {
    // Determine the appropriate language code for TMDB API
    const langCode = language && language !== 'Any Language' 
      ? (language.toLowerCase().includes('korean') ? 'ko-KR' :
         language.toLowerCase().includes('japanese') ? 'ja-JP' :
         language.toLowerCase().includes('spanish') ? 'es-ES' :
         language.toLowerCase().includes('french') ? 'fr-FR' : 'en-US')
      : 'en-US'
    
    // Search with specific language first
    const response = await fetch(
      `${tmdbBaseUrl}/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&language=${langCode}&page=1&include_adult=false`
    )

    if (!response.ok) {
      throw new Error('TMDB API request failed')
    }

    let data: TMDBResponse = await response.json()
    
    // If no results with specific language, try with English
    if ((!data.results || data.results.length === 0) && langCode !== 'en-US') {
      const fallbackResponse = await fetch(
        `${tmdbBaseUrl}/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&language=en-US&page=1&include_adult=false`
      )
      
      if (fallbackResponse.ok) {
        data = await fallbackResponse.json()
      }
    }
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0]
      
      // Get additional movie details
      const detailsResponse = await fetch(
        `${tmdbBaseUrl}/movie/${movie.id}?api_key=${tmdbApiKey}&language=${langCode}`
      )
      
      if (detailsResponse.ok) {
        const detailedMovie = await detailsResponse.json()
        return {
          ...movie,
          genres: detailedMovie.genres
        }
      }
      
      return movie
    }
    
    return null
  } catch (error) {
    console.error('Error searching TMDB:', error)
    return null
  }
}

export async function getPopularMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${tmdbBaseUrl}/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1`
    )

    if (!response.ok) {
      throw new Error('TMDB API request failed')
    }

    const data: TMDBResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return []
  }
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${tmdbBaseUrl}/discover/movie?api_key=${tmdbApiKey}&with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`
    )

    if (!response.ok) {
      throw new Error('TMDB API request failed')
    }

    const data: TMDBResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching movies by genre:', error)
    return []
  }
}
