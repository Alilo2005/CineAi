# CineAI Recommender - Setup Guide

## 🚀 Quick Start

Your AI Movie Chatbot is ready to run! Follow these steps to get it working:

### 1. Start the Development Server

The development server is already running at: **http://localhost:3001**

### 2. Set Up API Keys (Required)

To enable full functionality, you need to set up API keys:

#### OpenAI API (Required for AI recommendations)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account and get your API key
3. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

#### TMDB API (Required for movie data)
1. Go to [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Create a free account and request an API key
3. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key-here
   ```

#### EmailJS (Optional - for email functionality)
1. Go to [EmailJS](https://www.emailjs.com/)
2. Set up a service and email template
3. Add the configuration to your `.env.local` file:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key
   ```

### 3. Test the Application

1. Open your browser and go to http://localhost:3001
2. Start chatting with the AI assistant
3. Answer the questions about your movie preferences
4. Get your personalized movie recommendation!

## 🎨 Features Overview

### Interactive Chat Interface
- **Smart Questions**: The AI asks about genres, mood, time period, ratings, and language preferences
- **Smooth Animations**: Built with Framer Motion for beautiful transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### AI-Powered Recommendations
- **OpenAI Integration**: Uses GPT-3.5-turbo for intelligent movie suggestions
- **Personalized Results**: Tailored recommendations based on your specific preferences
- **Detailed Explanations**: AI explains why each movie is perfect for you

### Rich Movie Data
- **TMDB Integration**: Comprehensive movie information and high-quality posters
- **Movie Details**: Ratings, release dates, overviews, and direct links
- **Visual Appeal**: Beautiful movie cards with smooth hover effects

### Email Delivery
- **Professional Templates**: Beautifully formatted HTML emails
- **Complete Information**: Movie details, posters, and recommendation reasons
- **Instant Delivery**: Powered by EmailJS for reliable email sending

## 🎭 How It Works

1. **Welcome**: The chatbot greets you and explains the process
2. **Preferences Collection**: Interactive questions about your movie taste
3. **AI Analysis**: OpenAI processes your preferences to find the perfect match
4. **Movie Search**: TMDB API fetches detailed movie information
5. **Recommendation Display**: Beautiful presentation of your recommended movie
6. **Email Delivery**: Optional email with all the details

## 🛠️ Customization

### Styling
- Edit `tailwind.config.js` to customize colors and animations
- Modify `src/app/globals.css` for additional styling
- Update component styles in individual `.tsx` files

### Chat Flow
- Modify `src/utils/chatSteps.ts` to change questions
- Update `src/types/index.ts` for new data structures
- Customize AI prompts in `src/app/api/recommend/route.ts`

### Features
- Add new components in `src/components/`
- Create additional API routes in `src/app/api/`
- Extend utilities in `src/utils/`

## 🚨 Troubleshooting

### Common Issues

**No movie recommendations showing**
- Check that your OpenAI API key is valid and has credits
- Verify TMDB API key is correct
- Check browser console for error messages

**Email not sending**
- Verify EmailJS configuration
- Check that all EmailJS environment variables are set
- Ensure your email template includes the required variables

**Styling issues**
- Make sure Tailwind CSS is properly configured
- Check that all dependencies are installed
- Clear browser cache and restart development server

### Need Help?

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure API keys are valid and have proper permissions
4. Restart the development server: `npm run dev`

## 🎉 Enjoy Your Movie Recommendations!

Your AI Movie Chatbot is now ready to help you discover amazing films tailored to your taste!

Visit: **http://localhost:3001**
