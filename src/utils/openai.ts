import { UserPreferences, OpenAIMovieRecommendation } from '../types'

export async function getMovieRecommendation(preferences: UserPreferences): Promise<OpenAIMovieRecommendation> {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences)
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const recommendation = await response.json()
    return recommendation
  } catch (error) {
    console.error('Error getting OpenAI recommendation:', error)
    
    // Fallback recommendation based on preferences
    return getFallbackRecommendation(preferences)
  }
}

function getFallbackRecommendation(preferences: UserPreferences): OpenAIMovieRecommendation {
  const genreRecommendations: Record<string, OpenAIMovieRecommendation> = {
    'Action & Adventure': {
      title: "Mad Max: Fury Road",
      reason: "An adrenaline-pumping action masterpiece with incredible visuals and non-stop excitement.",
      tmdbSearchQuery: "Mad Max Fury Road"
    },
    'Comedy': {
      title: "The Grand Budapest Hotel",
      reason: "A whimsical and visually stunning comedy that's both hilarious and heartwarming.",
      tmdbSearchQuery: "The Grand Budapest Hotel"
    },
    'Drama': {
      title: "Parasite",
      reason: "A brilliant social thriller that will keep you engaged while making you think deeply.",
      tmdbSearchQuery: "Parasite 2019"
    },
    'Horror & Thriller': {
      title: "Get Out",
      reason: "A masterfully crafted psychological thriller that's both scary and socially relevant.",
      tmdbSearchQuery: "Get Out 2017"
    },
    'Romance': {
      title: "La La Land",
      reason: "A modern musical romance that's visually stunning and emotionally captivating.",
      tmdbSearchQuery: "La La Land"
    },
    'Sci-Fi & Fantasy': {
      title: "Blade Runner 2049",
      reason: "A visually breathtaking sci-fi epic that perfectly balances action and philosophical depth.",
      tmdbSearchQuery: "Blade Runner 2049"
    }
  }

  const firstGenre = preferences.genres[0] || 'Drama'
  return genreRecommendations[firstGenre] || genreRecommendations['Drama']
}
