// Trailer functionality using TMDB API
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
const tmdbBaseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL

export interface TrailerVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface TMDBVideosResponse {
  id: number
  results: TrailerVideo[]
}

export async function getMovieTrailer(movieId: number): Promise<string | null> {
  try {
    if (!tmdbApiKey) {
      console.error('TMDB API key not found')
      return null
    }

    const response = await fetch(
      `${tmdbBaseUrl}/movie/${movieId}/videos?api_key=${tmdbApiKey}&language=en-US`
    )

    if (!response.ok) {
      console.error('Failed to fetch movie videos')
      return null
    }

    const data: TMDBVideosResponse = await response.json()
    
    // Find the best trailer (prefer official trailers from YouTube)
    const trailer = data.results.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube' && 
      video.official
    ) || data.results.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube'
    ) || data.results.find(video => 
      video.site === 'YouTube'
    )

    if (trailer) {
      // Return YouTube embed URL without autoplay for better UX
      return `https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1&controls=1`
    }

    return null
  } catch (error) {
    console.error('Error fetching movie trailer:', error)
    return null
  }
}

export function createTrailerEmbed(trailerUrl: string): string {
  return `
    <div class="trailer-container" style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);">
      <iframe 
        src="${trailerUrl}" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `
}
