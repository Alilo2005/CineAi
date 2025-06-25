import { NextRequest, NextResponse } from 'next/server'
import { UserPreferences, OpenAIMovieRecommendation } from '../../../types'

// TMDB Genre ID mapping for accurate filtering
const genreMapping = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'History': 36,
  'Horror': 27,
  'Music': 10402,
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'Thriller': 53,
  'War': 10752,
  'Western': 37
}

// Language code mapping for TMDB API
const languageMapping = {
  'English': 'en',
  'Korean (한국어)': 'ko',
  'Japanese (日本語)': 'ja',
  'Spanish (Español)': 'es',
  'French (Français)': 'fr',
  'Mandarin (中文)': 'zh',
  'Hindi (हिन्दी)': 'hi',
  'Any Language': 'en'
}

// Year range mapping for release date filtering
const decadeMapping = {
  '2020s (2020-2025)': { primary_release_date_gte: '2020-01-01', primary_release_date_lte: '2025-12-31' },
  '2010s (2010-2019)': { primary_release_date_gte: '2010-01-01', primary_release_date_lte: '2019-12-31' },
  '2000s (2000-2009)': { primary_release_date_gte: '2000-01-01', primary_release_date_lte: '2009-12-31' },
  '1990s (1990-1999)': { primary_release_date_gte: '1990-01-01', primary_release_date_lte: '1999-12-31' },
  '1980s (1980-1989)': { primary_release_date_gte: '1980-01-01', primary_release_date_lte: '1989-12-31' },
  '1970s (1970-1979)': { primary_release_date_gte: '1970-01-01', primary_release_date_lte: '1979-12-31' },
  'Classic (Before 1970)': { primary_release_date_lte: '1969-12-31' },
  'Any Time Period': {}
}

// Popularity sort mapping
const popularityMapping = {
  'Blockbuster hits (Very Popular)': 'popularity.desc',
  'Well-known favorites (Popular)': 'popularity.desc',
  'Moderately known (Some buzz)': 'vote_average.desc',
  'Hidden gems (Lesser known)': 'vote_count.asc',
  "Doesn't matter": 'popularity.desc'
}

async function getMovieFromTMDB(preferences: UserPreferences): Promise<OpenAIMovieRecommendation | null> {
  try {
    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
    const tmdbBaseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL
    
    if (!tmdbApiKey) return null

    // Build TMDB discover query
    const params = new URLSearchParams({
      api_key: tmdbApiKey,
      sort_by: popularityMapping[preferences.popularity as keyof typeof popularityMapping] || 'popularity.desc',
      include_adult: 'false',
      include_video: 'false',
      page: '1'
    })

    // Add genre filter
    const genreId = genreMapping[preferences.genres[0] as keyof typeof genreMapping]
    if (genreId) {
      params.append('with_genres', genreId.toString())
    }

    // Add language filter
    const languageCode = languageMapping[preferences.language as keyof typeof languageMapping]
    if (languageCode && languageCode !== 'en') {
      params.append('with_original_language', languageCode)
    }

    // Add decade filter
    const yearRange = decadeMapping[preferences.decade as keyof typeof decadeMapping]
    if (yearRange) {
      Object.entries(yearRange).forEach(([key, value]) => {
        params.append(key, value)
      })
    }

    // Add rating filter (MPAA rating is complex in TMDB, so we'll use vote_average as proxy)
    if (preferences.rating && preferences.rating !== 'Any Rating') {
      if (preferences.rating.includes('G -')) {
        params.append('vote_average.gte', '6.0')
        params.append('vote_average.lte', '10.0')
      } else if (preferences.rating.includes('PG -') || preferences.rating.includes('PG-13')) {
        params.append('vote_average.gte', '5.0')
      }
    }

    const response = await fetch(`${tmdbBaseUrl}/discover/movie?${params.toString()}`)
    
    if (!response.ok) return null
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      // Get a random movie from the results (not always the first one)
      const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 10))
      const movie = data.results[randomIndex]
      
      return {
        title: movie.title,
        reason: `A ${preferences.genres[0]?.toLowerCase() || 'great'} ${preferences.language && preferences.language !== 'Any Language' ? preferences.language.split(' ')[0] : ''} movie ${preferences.decade !== 'Any Time Period' ? `from the ${preferences.decade}` : ''} that perfectly matches your preferences! ${movie.overview ? movie.overview.substring(0, 150) + '...' : ''}`,
        tmdbSearchQuery: movie.title
      }
    }
    
    return null
  } catch (error) {
    console.error('TMDB Discovery API error:', error)
    return null
  }
}

function getFallbackRecommendation(preferences: UserPreferences): OpenAIMovieRecommendation {
  const primaryGenre = preferences.genres[0] || 'Drama'
  const language = preferences.language || 'Any Language'
  
  // Simple fallback movies by genre and language
  const fallbackMovies = {
    'Action': {
      'English': 'John Wick',
      'Korean (한국어)': 'Oldboy', 
      'Japanese (日本語)': 'Akira',
      'Spanish (Español)': 'El Mariachi',
      'French (Français)': 'Léon: The Professional',
      'Any Language': 'Mad Max: Fury Road'
    },
    'Comedy': {
      'English': 'The Grand Budapest Hotel',
      'Korean (한국어)': 'My Sassy Girl',
      'Japanese (日本語)': 'Tampopo', 
      'Spanish (Español)': 'Instructions Not Included',
      'French (Français)': 'Amélie',
      'Any Language': 'The Grand Budapest Hotel'
    },
    'Drama': {
      'English': 'The Shawshank Redemption',
      'Korean (한국어)': 'Parasite',
      'Japanese (日本語)': 'Tokyo Story',
      'Spanish (Español)': 'The Sea Inside',
      'French (Français)': 'Amour',
      'Any Language': 'The Shawshank Redemption'
    },
    'Horror': {
      'English': 'Hereditary',
      'Korean (한국어)': 'The Wailing',
      'Japanese (日本語)': 'Ringu',
      'Spanish (Español)': 'The Orphanage',
      'French (Français)': 'Martyrs',
      'Any Language': 'Hereditary'
    },
    'Romance': {
      'English': 'When Harry Met Sally',
      'Korean (한국어)': 'My Sassy Girl',
      'Japanese (日本語)': 'Your Name',
      'Spanish (Español)': 'Like Water for Chocolate',
      'French (Français)': 'Amélie',
      'Any Language': 'When Harry Met Sally'
    },
    'Science Fiction': {
      'English': 'Blade Runner 2049',
      'Korean (한국어)': 'Snowpiercer',
      'Japanese (日本語)': 'Ghost in the Shell',
      'Spanish (Español)': 'Timecrimes',
      'French (Français)': 'Alphaville',
      'Any Language': 'Blade Runner 2049'
    }
  }
  
  const genreMovies = fallbackMovies[primaryGenre as keyof typeof fallbackMovies] || fallbackMovies['Drama']
  const movieTitle = genreMovies[language as keyof typeof genreMovies] || genreMovies['Any Language']
  
  return {
    title: movieTitle,
    reason: `A fantastic ${primaryGenre.toLowerCase()} movie${language !== 'Any Language' ? ` in ${language.split(' ')[0]}` : ''} ${preferences.decade !== 'Any Time Period' ? `from the ${preferences.decade}` : ''} that matches your preferences perfectly!`,
    tmdbSearchQuery: movieTitle
  }
}

export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json()
    
    // First try to get movie from TMDB discovery API
    const tmdbRecommendation = await getMovieFromTMDB(preferences)
    if (tmdbRecommendation) {
      console.log('Using TMDB discovery recommendation')
      return NextResponse.json(tmdbRecommendation)
    }
    
    const huggingfaceApiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
    
    if (!huggingfaceApiKey) {
      console.log('No Hugging Face API key found, using fallback recommendations')
      const fallback = getFallbackRecommendation(preferences)
      return NextResponse.json(fallback)
    }

    // Create a detailed prompt for movie recommendation that includes language preference
    const languageContext = preferences.language && preferences.language !== 'Any Language' 
      ? ` in ${preferences.language}` 
      : ' from any country/language'
    
    const prompt = `Recommend one specific movie title for someone who likes ${preferences.genres.join(' and ')} movies and wants a movie${languageContext}${preferences.decade !== 'Any Time Period' ? ` from the ${preferences.decade}` : ''}. Respond with only the movie title.`

    try {
      // Using a simpler text generation model that works well for recommendations
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 20,
            temperature: 0.8,
            do_sample: true
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        let movieTitle = result[0]?.generated_text?.replace(prompt, '').trim()
        
        // Clean up the response to get just the movie title
        if (movieTitle) {
          movieTitle = movieTitle.split('\n')[0].split('.')[0].trim()
          // Remove common prefixes
          movieTitle = movieTitle.replace(/^(I recommend|Try|Watch|Consider)/i, '').trim()
          
          if (movieTitle.length > 5 && movieTitle.length < 50) {
            const recommendation: OpenAIMovieRecommendation = {
              title: movieTitle,
              reason: `AI-recommended ${preferences.genres.join(' and ')} movie that perfectly matches your preferences!`,
              tmdbSearchQuery: movieTitle
            }
            
            return NextResponse.json(recommendation)
          }
        }
      }
    } catch (error) {
      console.log('Hugging Face API error:', error)
    }

    // Always fallback to curated recommendations if AI fails
    console.log('Using curated fallback recommendation')
    const fallback = getFallbackRecommendation(preferences)
    return NextResponse.json(fallback)

  } catch (error) {
    console.error('Error in recommendation API:', error)
    
    // Return a safe fallback recommendation
    const fallback: OpenAIMovieRecommendation = {
      title: "The Shawshank Redemption",
      reason: "A timeless masterpiece that's perfect for any mood. This film will leave you feeling inspired and emotionally fulfilled.",
      tmdbSearchQuery: "The Shawshank Redemption"
    }
    
    return NextResponse.json(fallback)
  }
}
