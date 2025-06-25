# 🎬 AI Movie Chatbot - Vercel Deployment

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy (Simplest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables (see below)
6. Deploy!

### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## 🔑 Environment Variables to Add in Vercel

In your Vercel dashboard, go to Project Settings → Environment Variables and add:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key | Get from themoviedb.org |
| `NEXT_PUBLIC_TMDB_BASE_URL` | `https://api.themoviedb.org/3` | TMDB API base URL |
| `NEXT_PUBLIC_HUGGINGFACE_API_KEY` | Your HF token (optional) | Get from huggingface.co |

## 🎯 Features
- ✅ 100% Free APIs (TMDB + Hugging Face)
- ✅ Smart movie recommendations based on genre, language, decade
- ✅ Official movie trailers embedded
- ✅ Multi-language support (English, Korean, Japanese, Spanish, French)
- ✅ Responsive design with golden theme
- ✅ No email functionality needed

## 🛠 Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- TMDB API
- Hugging Face API

Enjoy your deployed movie chatbot! 🍿
