import { ChatStep } from "../types"

export const getChatSteps = (): ChatStep[] => [
  {
    id: "genres",
    question: "What genre are you in the mood for? (Choose one that best fits your current vibe)",
    options: [
      "Action",
      "Animation",  
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Science Fiction",
      "Thriller",
      "Fantasy"
    ],
    field: "genres",
    completed: false
  },
  {
    id: "decade",
    question: "When was your ideal movie made?",
    options: [
      "2020s (2020-2025)",
      "2010s (2010-2019)", 
      "2000s (2000-2009)",
      "1990s (1990-1999)",
      "Classic (Before 1970)",
      "Any Time Period"
    ],
    field: "decade",
    completed: false
  },
  {
    id: "language",
    question: "What language would you prefer?",
    options: [
      "English",
      "Korean (한국어)",
      "Japanese (日本語)", 
      "Spanish (Español)",
      "French (Français)",
      "Mandarin (中文)",
      "Hindi (हिन्दी)",
      "Any Language"
    ],
    field: "language",
    completed: false
  },
  {
    id: "rating",
    question: "What content rating fits your mood?",
    options: [
      "G - General Audiences",
      "PG - Parental Guidance", 
      "PG-13 - Parents Cautioned",
      "R - Restricted (17+)",
      "NC-17 - Adults Only",
      "Any Rating"
    ],
    field: "rating",
    completed: false
  },
  {
    id: "popularity",
    question: "Do you want something popular or more of a hidden gem?",
    options: [
      "Blockbuster hits (Very Popular)",
      "Well-known favorites (Popular)",
      "Moderately known (Some buzz)",
      "Hidden gems (Lesser known)",
      "Doesnt matter"
    ],
    field: "popularity",
    completed: false
  },
  
]
