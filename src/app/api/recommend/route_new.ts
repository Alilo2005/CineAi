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

// Curated movie recommendations by genre and language
const curatedMovies = {
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
  },
  'Animation': {
    'English': 'Spider-Man: Into the Spider-Verse',
    'Korean (한국어)': 'The Little Prince',
    'Japanese (日本語)': 'Your Name',
    'Spanish (Español)': 'Coco',
    'French (Français)': 'The Triplets of Belleville',
    'Any Language': 'Spider-Man: Into the Spider-Verse'
  },
  'Thriller': {
    'English': 'Gone Girl',
    'Korean (한국어)': 'The Chaser',
    'Japanese (日本語)': 'Perfect Blue',
    'Spanish (Español)': 'Sleep Tight',
    'French (Français)': 'Tell No One',
    'Any Language': 'Gone Girl'
  }
}

function getFallbackRecommendation(preferences: UserPreferences): OpenAIMovieRecommendation {
  const primaryGenre = preferences.genres[0] || 'Drama'
  const language = preferences.language || 'Any Language'
  
  const genreMovies = curatedMovies[primaryGenre as keyof typeof curatedMovies] || curatedMovies['Drama']
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
    
    const huggingfaceApiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
    
    if (!huggingfaceApiKey) {
      console.log('No Hugging Face API key found, using curated recommendations')
      const fallback = getFallbackRecommendation(preferences)
      return NextResponse.json(fallback)
    }    // Create a detailed prompt for movie recommendation
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
