export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  movie?: Movie;
  trailerUrl?: string;
}

export interface UserPreferences {
  genres: string[];
  decade: string;
  language: string;
  rating: string;
  popularity: string;
}

export interface ChatStep {
  id: string;
  question: string;
  options?: string[];
  field: keyof UserPreferences;
  completed: boolean;
}

export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface OpenAIMovieRecommendation {
  title: string;
  reason: string;
  tmdbSearchQuery: string;
}
