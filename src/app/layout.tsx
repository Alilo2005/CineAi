import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CineAI - Personalized Movie Recommendations',
  description: 'Get personalized movie recommendations from our AI chatbot with instant trailer previews',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200">
          {children}
        </div>
      </body>
    </html>
  )
}
