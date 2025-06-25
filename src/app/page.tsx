'use client'

import { useState } from 'react'
import ChatInterface from '../components/ChatInterface'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StarryMouseEffect from '../components/StarryMouseEffect'
import GoldenSnowEffect from '../components/GoldenSnowEffect'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Cool Background Effects - Lower z-index for better performance */}
      <GoldenSnowEffect />
      <StarryMouseEffect />
      
      {/* Main Content */}
      <div className="relative z-20">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <ChatInterface />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  )
}
