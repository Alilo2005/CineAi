# Movie Recommendation Wizard Flow Documentation

## Overview
This document describes the structured, step-by-step flow for the CineAI movie recommendation chatbot. The wizard follows a strict pattern where each step requires explicit user confirmation before advancing.

## Flow Architecture

### Core Principles
1. **Sequential Steps**: Users progress through 6 distinct steps in order
2. **Explicit Confirmation**: Every step requires a button click to advance (no auto-advance)
3. **Visual Feedback**: Clear confirmation messages after each selection
4. **Edit Capability**: Users can go back and modify previous answers
5. **Progress Tracking**: Visual progress indicator throughout the flow

## Step-by-Step Flow

### Step 1: Genre Selection 🎭
- **Type**: Multi-select
- **Question**: "What genres do you enjoy? (Pick as many as you like!)"
- **Options**: Action & Adventure, Comedy, Drama, Horror & Thriller, Romance, Sci-Fi & Fantasy, Documentary, Animation, Mystery & Crime
- **Behavior**: 
  - Users can select multiple genres
  - Selected genres show with checkmarks
  - Confirmation button appears only after at least one genre is selected
  - Button text changes based on selection count:
    - 1 genre: "That's perfect!"
    - 2 genres: "Great combo!"
    - 3+ genres: "Awesome selection!"

### Step 2: Mood Selection 😊
- **Type**: Single-select
- **Question**: "What's your mood today? How do you want to feel after watching?"
- **Options**: Excited & Energized, Relaxed & Calm, Inspired & Motivated, Entertained & Laughing, Thoughtful & Reflective, Scared & Thrilled, Romantic & Warm
- **Behavior**:
  - Single selection only
  - Shows feedback: "Perfect! You selected [option] ✓"
  - Confirmation button: "Perfect choice!"

### Step 3: Decade Selection 📅
- **Type**: Single-select
- **Question**: "Any preference for the time period?"
- **Options**: Latest (2020s), Recent (2010s), 2000s, 90s, 80s, 70s or Earlier, No Preference
- **Behavior**:
  - Single selection only
  - Shows feedback: "Perfect! You selected [option] ✓"
  - Confirmation button: "Awesome!"

### Step 4: Rating Selection ⭐
- **Type**: Single-select
- **Question**: "What age rating would you prefer?"
- **Options**: G (General), PG (Parental Guidance), PG-13 (Teens), R (Mature), No Preference
- **Behavior**:
  - Single selection only
  - Shows feedback: "Perfect! You selected [option] ✓"
  - Confirmation button: "Excellent!"

### Step 5: Language Selection 🌍
- **Type**: Single-select
- **Question**: "Language preference for the movie?"
- **Options**: English, Spanish, French, Japanese, Korean, Any Language
- **Behavior**:
  - Single selection only
  - Shows feedback: "Perfect! You selected [option] ✓"
  - Confirmation button: "Fantastic!"

### Step 6: Email Collection 📧
- **Type**: Input or Skip
- **Question**: "Enter your email to receive the recommendation, or skip to just see it here:"
- **Options**: Email input field + Skip button
- **Behavior**:
  - Users can enter email OR click "Skip Email"
  - Email validation on enter/send
  - Different feedback based on choice:
    - Email provided: "Perfect! I'll send your recommendation to [email] ✓"
    - Skipped: "No worries! Let's get your recommendation! 🎬"
  - Confirmation button: "Get My Recommendation!"

### Final Step: AI Recommendation 🤖
- **Process**: 
  1. Show loading animation
  2. Call OpenAI API with user preferences
  3. Search TMDB for movie data
  4. Display recommendation with movie card
  5. Send email if provided
  6. Show completion message

## User Experience Features

### Progress Tracking
- Visual progress bar showing current step and percentage complete
- Step indicator with icons and descriptive names
- Current selections summary panel

### Edit Functionality
- "Edit" button in summary panel
- Allows jumping back to any previous step
- Resets all downstream answers when editing
- Maintains data integrity

### Visual Feedback
- Smooth animations using Framer Motion
- Gold accent color scheme (#ffd700)
- Glassmorphism effects
- Loading spinners and transitions

### Error Handling
- Graceful API error recovery
- Input validation
- Fallback messages for failed operations

## Technical Implementation Details

### State Management
```typescript
interface UserPreferences {
  genres: string[]      // Multi-select array
  mood: string         // Single selection
  decade: string       // Single selection
  rating: string       // Single selection
  language: string     // Single selection
  email: string        // Input or 'skip'
}
```

### Flow Control States
- `currentStep`: Tracks which step user is on (0-5)
- `waitingForConfirmation`: Controls when confirmation button shows
- `pendingResponse`: Stores user's response before confirmation
- `chatCompleted`: Indicates flow completion

### Confirmation Pattern
1. User makes selection → Shows feedback message
2. Sets `waitingForConfirmation = true`
3. Shows custom confirmation button
4. User clicks button → Advances to next step
5. Repeats until completion

## API Integrations

### OpenAI Integration
- Sends structured preferences to GPT for movie recommendation
- Returns movie title and reasoning
- Uses conversation context for personalized suggestions

### TMDB Integration
- Searches for recommended movie details
- Fetches poster images, ratings, and metadata
- Provides rich movie cards with visual information

### EmailJS Integration
- Sends formatted recommendation emails
- Includes movie details and AI reasoning
- Graceful handling of email delivery failures

## Customization Options

### Adding New Steps
1. Add step definition to `chatSteps.ts`
2. Update `UserPreferences` interface
3. Add handling in `handleUserResponse`
4. Update progress calculation

### Modifying Options
- Edit options arrays in `chatSteps.ts`
- Maintain consistent option formatting
- Consider impact on AI prompt generation

### Styling Customization
- Modify Tailwind classes for color scheme
- Adjust animation timings in Framer Motion
- Update button text and emoji usage

## Flow Validation

### Required Validations
- At least one genre must be selected
- All single-select steps must have a choice
- Email validation (if provided)
- API response handling

### Edge Cases Handled
- Back navigation and data reset
- Multiple rapid selections
- API failures and retries
- Invalid email formats
- Missing or malformed responses

This documentation provides a complete reference for understanding, maintaining, and extending the movie recommendation wizard flow.
