# AI Movie Chatbot - CineAI Recommender

A sophisticated AI-powered movie recommendation chatbot that provides personalized movie suggestions and sends them via email. Built with Next.js, TypeScript, and featuring a beautiful dark gold UI with smooth animations.

## ✨ Features

- **🤖 AI-Powered Recommendations**: Uses OpenAI to analyze user preferences and suggest perfect movies
- **🎬 Rich Movie Data**: Integration with The Movie Database (TMDB) API for comprehensive movie information
- **📧 Email Delivery**: Sends beautifully formatted movie recommendations via EmailJS
- **💫 Interactive Chat**: Engaging conversational interface with smooth animations
- **🎨 Stunning UI**: Dark gold theme with glassmorphism effects and responsive design
- **⚡ Modern Tech Stack**: Built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion

## 🚀 Demo

The chatbot asks users about their movie preferences through an interactive chat interface:
- Favorite genres
- Current mood
- Preferred time period
- Content rating preferences
- Language preferences
- Email for recommendations

Based on these answers, the AI recommends a perfect movie and sends detailed information via email.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark gold theme
- **Animations**: Framer Motion
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Movie Data**: The Movie Database (TMDB) API
- **Email Service**: EmailJS
- **Icons**: Lucide React

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-movie-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add:
   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # TMDB API Configuration  
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   
   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
   ```

4. **Get API Keys**:
   - **OpenAI**: Sign up at [OpenAI](https://platform.openai.com/) and get your API key
   - **TMDB**: Register at [TMDB](https://www.themoviedb.org/settings/api) for a free API key
   - **EmailJS**: Set up an account at [EmailJS](https://www.emailjs.com/) and configure your service

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 EmailJS Setup

1. Create an EmailJS account and service
2. Create an email template with the following variables:
   - `{{to_email}}`
   - `{{movie_title}}`
   - `{{movie_overview}}`
   - `{{movie_rating}}`
   - `{{movie_release_date}}`
   - `{{recommendation_reason}}`
   - `{{movie_poster}}`
   - `{{movie_url}}`
   - `{{from_name}}`

## 🎨 Design Features

- **Dark Gold Theme**: Elegant color scheme with gold accents
- **Glassmorphism Effects**: Modern frosted glass appearance
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Works perfectly on all devices
- **Interactive Elements**: Hover effects and smooth transitions

## 📱 Usage

1. Open the application in your browser
2. Start chatting with the AI assistant
3. Answer questions about your movie preferences
4. Provide your email address (optional but recommended)
5. Receive your personalized movie recommendation
6. Check your email for the detailed recommendation

## 🔮 Features Roadmap

- [ ] User accounts and preference saving
- [ ] Movie watchlists
- [ ] Social sharing of recommendations
- [ ] Multiple recommendation formats
- [ ] Integration with streaming services
- [ ] Movie reviews and ratings
- [ ] Advanced filtering options

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the AI recommendation engine
- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [EmailJS](https://www.emailjs.com/) for email functionality
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ and AI**
