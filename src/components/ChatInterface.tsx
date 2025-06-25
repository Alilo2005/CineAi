'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Star, Calendar, Heart } from 'lucide-react'
import { ChatMessage, ChatStep, UserPreferences, Movie } from '../types'
import MovieCard from './MovieCard'
import LoadingSpinner from './LoadingSpinner'
import { getChatSteps } from '../utils/chatSteps'
import { getMovieRecommendation } from '../utils/openai'
import { searchMovieByTitle } from '../utils/tmdb'
import { getMovieTrailer } from '../utils/trailer'

export default function ChatInterface() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [messageIdCounter, setMessageIdCounter] = useState(0)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    genres: [],
    decade: '',
    language: '',
    rating: '',
    popularity: '',
    showTrailer: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [chatCompleted, setChatCompleted] = useState(false)
  const [recommendedMovie, setRecommendedMovie] = useState<Movie | null>(null)
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false)
  const [pendingResponse, setPendingResponse] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatSteps = getChatSteps()
  
  // Helper function to generate unique message IDs
  const generateMessageId = () => {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substr(2, 9)
    const newId = `${timestamp}-${messageIdCounter}-${randomSuffix}`
    setMessageIdCounter(prev => prev + 1)
    return newId
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    // Only run on client side after mounting
    if (!mounted) return
    
    // Initial greeting
    const initialMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'bot',
      content: "🎬 Welcome to CineAI! I'm your personal movie curator. I'll ask you a few questions to find the perfect movie for you today. Ready to discover your next favorite film?",
      timestamp: new Date()
    }
    setMessages([initialMessage])

    // First question
    setTimeout(() => {
      if (currentStep === 0 && chatSteps.length > 0) {
        askNextQuestion()
      }    
    }, 1500)  }, [mounted])
  const askQuestionForStep = (stepIndex: number) => {
    console.log('askQuestionForStep called - stepIndex:', stepIndex, 'total steps:', chatSteps.length)
    
    if (stepIndex < chatSteps.length && chatSteps[stepIndex]) {
      const step = chatSteps[stepIndex]
      console.log('Asking question for step:', stepIndex, 'question:', step.question)
      
      const questionMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',
        content: step.question,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, questionMessage])
    } else {
      console.log('No question available for step:', stepIndex, 'chatSteps.length:', chatSteps.length)
    }
  }

  const askNextQuestion = () => {
    askQuestionForStep(currentStep)
  }

  const handleUserResponse = async (response: string) => {
    if (currentStep >= chatSteps.length) {
      return
    }
      
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: response,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    const currentStepData = chatSteps[currentStep]
    let updatedPreferences = { ...userPreferences }
    
    if (currentStepData.field === 'genres') {
      const currentGenres = Array.isArray(userPreferences.genres) ? userPreferences.genres : []
      
      if (currentGenres.includes(response)) {
        return
      }
      updatedPreferences.genres = [...currentGenres, response]
      setUserPreferences(updatedPreferences)
      return    } else {
      // Handle trailer preference
      if (currentStepData.field === 'showTrailer') {
        const showTrailer = response.includes('Yes') ? 'yes' : 'no'
        updatedPreferences = {
          ...updatedPreferences,
          showTrailer: showTrailer
        } as UserPreferences
        setUserPreferences(updatedPreferences)
          
        const trailerMessage: ChatMessage = {
          id: generateMessageId(),
          type: 'bot',
          content: showTrailer === 'yes' ? 
            `Perfect! I'll include the trailer with your recommendation! 🎬` :
            `Got it! I'll just show you the movie details! 📝`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, trailerMessage])
        
        setTimeout(() => {
          getRecommendation(updatedPreferences)
        }, 800)
        return
      }
      
      setWaitingForConfirmation(true)
      setPendingResponse(response)
    }
  }
    const handleGenreConfirmation = () => {
    const currentGenres = Array.isArray(userPreferences.genres) ? userPreferences.genres : []
    
    if (currentGenres.length === 0) {      
      const noGenreMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',
        content: "Please select at least one genre to continue!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, noGenreMessage])
      return
    }

    const confirmMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'bot',
      content: `Perfect! ${Array.isArray(userPreferences.genres) ? userPreferences.genres.join(', ') : 'Unknown genres'} selected! 🎬`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, confirmMessage])

    const nextStep = currentStep + 1
    console.log('handleGenreConfirmation - moving from step', currentStep, 'to step', nextStep)
    
    const continueMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'bot',
      content: "Let's keep going! 🚀",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, continueMessage])

    // Update step first, then ask next question
    setCurrentStep(nextStep)

    if (nextStep < chatSteps.length) {
      setTimeout(() => {
        console.log('handleGenreConfirmation - About to ask question for step:', nextStep)
        askQuestionForStep(nextStep)
      }, 1000)
    } else {
      setTimeout(() => {
        getRecommendation(userPreferences)
      }, 500)
    }
  }
  const getRecommendation = async (preferences: UserPreferences) => {
    setIsLoading(true)
    
    try {
      const loadingMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',
        content: "🤖 Let me analyze your preferences and find the perfect movie for you...",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, loadingMessage])

      const recommendation = await getMovieRecommendation(preferences)
      const movieData = await searchMovieByTitle(recommendation.tmdbSearchQuery, preferences.language)
      
      if (movieData) {
        setRecommendedMovie(movieData)
        
        const recommendationMessage: ChatMessage = {
          id: generateMessageId(),
          type: 'bot',
          content: `🎉 Perfect! I found the ideal movie for you: **${movieData.title}**\n\n${recommendation.reason}`,
          timestamp: new Date(),
          movie: movieData
        }
        setMessages(prev => [...prev, recommendationMessage])
        
        // Handle trailer functionality
        if (preferences.showTrailer === 'yes') {
          const trailerUrl = await getMovieTrailer(movieData.id)
          
          if (trailerUrl) {
            const trailerMessage: ChatMessage = {
              id: generateMessageId(),
              type: 'bot',
              content: `🎬 Here's the official trailer for **${movieData.title}**! Get ready for an amazing movie experience!`,
              timestamp: new Date(),
              trailerUrl: trailerUrl
            }
            setMessages(prev => [...prev, trailerMessage])
          } else {
            const noTrailerMessage: ChatMessage = {
              id: generateMessageId(),
              type: 'bot',
              content: `🎬 Sorry, I couldn't find a trailer for this movie, but I'm sure you'll love it anyway!`,
              timestamp: new Date()
            }
            setMessages(prev => [...prev, noTrailerMessage])
          }
        }
        
        // Final message
        const finalMessage: ChatMessage = {
          id: generateMessageId(),
          type: 'bot',
          content: `🎬 Perfect! Enjoy your movie night. Feel free to ask for another recommendation anytime!`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, finalMessage])
      }
      
    } catch (error) {
      console.error('Error getting recommendation:', error)
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',
        content: "😅 Sorry, I had trouble finding a recommendation. Let's try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setChatCompleted(true)
    }
  }
  
  const resetChat = () => {
    setMessages([])
    setCurrentStep(0)
    setMessageIdCounter(0)
    setUserPreferences({
      genres: [],
      decade: '',
      language: '',
      rating: '',
      popularity: '',
      showTrailer: ''
    })
    setChatCompleted(false)
    setRecommendedMovie(null)
    setWaitingForConfirmation(false)
    setPendingResponse(null)
    
    setTimeout(() => {      
      const initialMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',
        content: "🎬 Welcome back! Ready to find another amazing movie?",
        timestamp: new Date()
      }
      setMessages([initialMessage])
      
      setTimeout(() => {
        if (chatSteps.length > 0) {
          askNextQuestion()
        }
      }, 1000)
    }, 500)
  }

  const handleConfirmation = (action: 'continue') => {
    setWaitingForConfirmation(false)
    
    if (pendingResponse && currentStep < chatSteps.length) {
      const currentStepData = chatSteps[currentStep]
      let updatedPreferences = { ...userPreferences }
      
      updatedPreferences = {
        ...updatedPreferences,
        [currentStepData.field]: pendingResponse
      } as UserPreferences
      setUserPreferences(updatedPreferences)
      
      const feedbackMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',        content: currentStepData.field === 'showTrailer' ? 
          `Perfect! I'll ${pendingResponse.includes('Yes') ? 'include' : 'skip'} the trailer ✓` :
          `Perfect! You selected "${pendingResponse}" ✓`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, feedbackMessage])
    }
    
    setPendingResponse(null)
    
    const nextStep = currentStep + 1
    console.log('handleConfirmation - moving from step', currentStep, 'to step', nextStep)

    const continueMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'bot',
      content: "Let's keep going! 🚀",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, continueMessage])

    // Update step first, then ask next question
    setCurrentStep(nextStep)

    if (nextStep < chatSteps.length) {
      setTimeout(() => {
        console.log('handleConfirmation - About to ask question for step:', nextStep)
        askQuestionForStep(nextStep)
      }, 1000)
    } else {
      setTimeout(() => {
        getRecommendation(userPreferences)
      }, 500)
    }
  }
  if (!mounted) {
    return <div className="glass-effect rounded-3xl p-6 min-h-[40vh] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }    return (
    <div className="w-full flex justify-center items-start min-h-screen py-8">
      <div className="glass-effect rounded-3xl p-8 w-full max-w-4xl mx-auto flex flex-col relative overflow-hidden" style={{ minHeight: 'fit-content', height: 'auto' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-gold-100/5 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold-200/10 rounded-full"
          animate={{ 
            scale: [1.2, 1, 1.2], 
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-8 h-8 bg-gold-300/5 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Floating Action Button for Reset */}
      {chatCompleted && (
        <motion.button
          onClick={resetChat}
          className="absolute top-6 right-6 z-20 w-14 h-14 bg-gradient-to-r from-gold-100 to-gold-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        >
          <motion.span
            className="text-dark-400 font-bold text-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
        </motion.button>
      )}      {/* Enhanced Progress Indicator - Always Visible with more spacing */}
      {!chatCompleted && currentStep < chatSteps.length && (
        <motion.div 
          className="mb-6 p-6 bg-gradient-to-r from-gold-100/10 via-gold-200/10 to-gold-300/10 backdrop-blur-sm rounded-2xl border border-gold-100/30 relative overflow-hidden"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold-100/5 via-transparent to-gold-300/5"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative z-10">            <div className="flex items-center justify-between mb-4">
              <motion.span 
                className="text-base text-gray-200 font-semibold flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gold-100 text-xl"
                >
                  🎯
                </motion.span>
                Question {currentStep + 1} of {chatSteps.length}
              </motion.span>
              <motion.span 
                className="text-sm text-gold-100 font-bold px-4 py-2 bg-gold-100/20 rounded-full border border-gold-100/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {Math.round(((currentStep + 1) / chatSteps.length) * 100)}% Complete
              </motion.span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-5 overflow-hidden border border-white/20 mb-6">              <motion.div 
                className="bg-gradient-to-r from-gold-200 via-gold-100 to-gold-300 h-5 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / chatSteps.length) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/40 rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    boxShadow: ["0 0 10px rgba(255,255,255,0.5)", "0 0 20px rgba(255,215,0,0.8)", "0 0 10px rgba(255,255,255,0.5)"]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </div>
              {chatSteps[currentStep] && (
              <motion.div 
                className="p-5 bg-gradient-to-r from-gold-100/15 to-transparent rounded-xl border-l-4 border-gold-100"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.p 
                  className="text-lg text-gold-100 font-semibold flex items-center gap-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {chatSteps[currentStep].question.includes('genres') ? '🎭' :
                     chatSteps[currentStep].question.includes('mood') ? '😊' :
                     chatSteps[currentStep].question.includes('time period') ? '📅' :
                     chatSteps[currentStep].question.includes('rating') ? '⭐' :
                     chatSteps[currentStep].question.includes('Language') ? '🌍' :
                     chatSteps[currentStep].question.includes('trailer') ? '🎬' : '❓'}
                  </motion.span>
                  <span>
                    {chatSteps[currentStep].question.includes('genres') ? 'Genre Selection' :
                     chatSteps[currentStep].question.includes('mood') ? 'Mood Selection' :
                     chatSteps[currentStep].question.includes('time period') ? 'Decade Selection' :
                     chatSteps[currentStep].question.includes('rating') ? 'Rating Selection' :
                     chatSteps[currentStep].question.includes('Language') ? 'Language Selection' :                     chatSteps[currentStep].question.includes('trailer') ? 'Trailer Preference' : 
                     `Step ${currentStep + 1}`}
                  </span>
                </motion.p>
                  {/* Current Question Display */}
                <motion.div
                  className="p-4 bg-white/10 rounded-lg border border-white/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <motion.p 
                    className="text-white text-base leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {chatSteps[currentStep].question}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}      {/* Messages with Enhanced Animations and Better Spacing */}
      <div className="overflow-y-auto space-y-8 mb-8 px-3 py-2" style={{ maxHeight: '60vh' }}>
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.3 } }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                bounce: 0.3
              }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div 
                className={`chat-bubble ${message.type === 'user' ? 'user-bubble' : 'bot-bubble'} max-w-[80%] relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.02, 
                  y: -3,
                  boxShadow: message.type === 'user' 
                    ? '0 15px 30px rgba(255, 215, 0, 0.25)' 
                    : '0 15px 30px rgba(255, 255, 255, 0.15)'
                }}
                transition={{ duration: 0.2 }}
              >
                {message.type === 'bot' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-gold-100/5"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                  <div className="flex items-start space-x-4 relative z-10">
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-gold-100 to-gold-300' 
                        : 'bg-gradient-to-r from-blue-400 to-purple-500'
                    }`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {message.type === 'user' ? (
                      <User className="w-6 h-6 text-dark-400" />
                    ) : (
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Bot className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                  <div className="flex-1 min-w-0">                    <motion.div 
                      className="text-white whitespace-pre-line leading-relaxed text-base"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p>{message.content}</p>
                    </motion.div>
                    {message.trailerUrl && (
                      <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                      >
                        <div 
                          style={{ 
                            position: 'relative', 
                            width: '100%', 
                            paddingBottom: '56.25%', 
                            height: 0, 
                            overflow: 'hidden', 
                            borderRadius: '12px', 
                            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)', 
                            margin: '10px 0' 
                          }}
                        >
                          <iframe 
                            src={message.trailerUrl} 
                            style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%', 
                              border: 'none' 
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            title="Movie Trailer"
                          />
                        </div>
                      </motion.div>
                    )}
                    {message.movie && (
                      <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                      >
                        <MovieCard movie={message.movie} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="flex justify-start"
          >
            <div className="bot-bubble relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-100/10 via-transparent to-gold-300/10"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative z-10">
                <LoadingSpinner />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>      {/* Enhanced Input Options with Better Spacing */}
      {!chatCompleted && currentStep < chatSteps.length && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="space-y-6 mt-4"
        >
          {/* Universal Continue Button - Enhanced */}
          {waitingForConfirmation && chatSteps[currentStep]?.field !== 'genres' && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="flex justify-center py-4"
            >
              <motion.button
                onClick={() => handleConfirmation('continue')}
                className="px-12 py-5 bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300 rounded-xl text-dark-400 font-bold text-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(255, 215, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {currentStep === 1 ? "Perfect choice!" :
                   currentStep === 2 ? "Awesome!" :
                   currentStep === 3 ? "Excellent!" :
                   currentStep === 4 ? "Fantastic!" :
                   currentStep === 5 ? "Get My Recommendation!" :
                   "Continue"} 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* Enhanced Options Display */}
          {!waitingForConfirmation && (
            <>
              {/* Genre selection with enhanced styling */}              {chatSteps[currentStep].field === 'genres' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-gradient-to-r from-gold-100/10 to-transparent rounded-lg border-l-4 border-gold-100">
                    <p className="text-gray-200 text-base font-medium">
                      Selected: {Array.isArray(userPreferences.genres) && userPreferences.genres.length > 0 ? (
                        <span className="text-gold-100 font-semibold">
                          {userPreferences.genres.join(', ')}
                        </span>
                      ) : (
                        <span className="text-gray-400">None yet</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {chatSteps[currentStep].options?.map((option, index) => {
                      const currentGenres = Array.isArray(userPreferences.genres) ? userPreferences.genres : []
                      const isSelected = currentGenres.includes(option)
                      return (
                        <motion.button
                          key={option}
                          onClick={() => !isSelected && handleUserResponse(option)}
                          disabled={isSelected}
                          className={`p-5 rounded-xl transition-all duration-300 relative overflow-hidden text-base font-medium ${
                            isSelected 
                              ? 'bg-gradient-to-r from-gold-100/30 to-gold-300/30 border-2 border-gold-100/70 text-gold-100 cursor-not-allowed'
                              : 'bg-white/5 border-2 border-white/20 text-white hover:bg-gradient-to-r hover:from-gold-100/20 hover:to-gold-300/20 hover:border-gold-100/50'
                          }`}
                          whileHover={!isSelected ? { 
                            scale: 1.05, 
                            boxShadow: '0 15px 30px rgba(255, 215, 0, 0.25)',
                            y: -3
                          } : {}}
                          whileTap={!isSelected ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                        >
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-gold-100/10 to-gold-300/10"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <span className="relative z-10 font-medium">
                            {isSelected ? `✓ ${option}` : option}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                    {Array.isArray(userPreferences.genres) && userPreferences.genres.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", bounce: 0.4 }}
                      className="flex justify-center pt-6"
                    >
                      <motion.button
                        onClick={handleGenreConfirmation}
                        className="px-12 py-5 bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300 rounded-xl text-dark-400 font-bold text-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 25px 50px rgba(255, 215, 0, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                          {userPreferences.genres.length === 1 ? "That's perfect!" : 
                           userPreferences.genres.length === 2 ? "Great combo!" :
                           userPreferences.genres.length >= 3 ? "Awesome selection!" : 
                           "Continue"}
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}              {/* Regular options for other steps with enhanced styling */}
              {chatSteps[currentStep].field !== 'genres' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-gradient-to-r from-gold-100/10 to-transparent rounded-lg border-l-4 border-gold-100">
                    <p className="text-gray-200 text-base font-medium">
                      Choose one option:
                      {pendingResponse && (
                        <span className="text-gold-100 ml-3 font-semibold">Selected: {pendingResponse}</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chatSteps[currentStep].options?.map((option, index) => {
                      const isSelected = pendingResponse === option
                      return (
                        <motion.button
                          key={option}
                          onClick={() => !isSelected && handleUserResponse(option)}
                          disabled={isSelected}
                          className={`p-5 rounded-xl transition-all duration-300 relative overflow-hidden text-base font-medium ${
                            isSelected 
                              ? 'bg-gradient-to-r from-gold-100/30 to-gold-300/30 border-2 border-gold-100/70 text-gold-100 cursor-not-allowed'
                              : 'bg-white/5 border-2 border-white/20 text-white hover:bg-gradient-to-r hover:from-gold-100/20 hover:to-gold-300/20 hover:border-gold-100/50'
                          }`}
                          whileHover={!isSelected ? { 
                            scale: 1.05, 
                            boxShadow: '0 15px 30px rgba(255, 215, 0, 0.25)',
                            y: -3
                          } : {}}
                          whileTap={!isSelected ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                        >
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-gold-100/10 to-gold-300/10"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <span className="relative z-10 font-medium">
                            {isSelected ? `✓ ${option}` : option}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}                {/* No special input needed for trailer preference - uses regular options */}
            </>
          )}
        </motion.div>
      )}      {/* Current Selections Summary - Compact and Content-Responsive */}
      {!chatCompleted && (userPreferences.genres.length > 0 || userPreferences.decade || userPreferences.rating || userPreferences.language || userPreferences.popularity) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-gold-100/10 to-transparent rounded-xl border border-gold-100/20 relative overflow-hidden"
          style={{ height: 'auto', minHeight: 'fit-content' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold-100/5 via-transparent to-gold-300/5"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gold-100 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg"
                >
                  📋
                </motion.span>
                Your Selections:
              </h3>
              <motion.button
                onClick={() => {                  let targetStep = 0
                  if (!userPreferences.genres.length) targetStep = 0
                  else if (!userPreferences.decade) targetStep = 1
                  else if (!userPreferences.language) targetStep = 2
                  else if (!userPreferences.rating) targetStep = 3
                  else if (!userPreferences.popularity) targetStep = 4
                  else targetStep = Math.max(0, currentStep - 1)
                  
                  setCurrentStep(targetStep)
                  setWaitingForConfirmation(false)
                  setPendingResponse(null)
                  
                  const editMessage: ChatMessage = {
                    id: generateMessageId(),
                    type: 'bot',
                    content: "Let's go back and edit your selections! 📝",
                    timestamp: new Date()
                  }
                  setMessages(prev => [...prev, editMessage])
                  
                  setTimeout(() => askNextQuestion(), 800)
                }}
                className="px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                ✏️ Edit
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">              {Array.isArray(userPreferences.genres) && userPreferences.genres.length > 0 && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="text-base">🎭</span>
                  <span className="text-white font-medium">Genres:</span> 
                  <span className="text-gold-100 truncate">{userPreferences.genres.join(', ')}</span>
                </motion.div>
              )}              {userPreferences.decade && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-base">�</span>
                  <span className="text-white font-medium">Decade:</span> 
                  <span className="text-gold-100">{userPreferences.decade}</span>
                </motion.div>
              )}
              {userPreferences.language && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-base">🌍</span>
                  <span className="text-white font-medium">Language:</span> 
                  <span className="text-gold-100">{userPreferences.language}</span>
                </motion.div>
              )}
              {userPreferences.rating && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-base">�</span>
                  <span className="text-white font-medium">Rating:</span> 
                  <span className="text-gold-100">{userPreferences.rating}</span>
                </motion.div>
              )}
              {userPreferences.popularity && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-base">📈</span>
                  <span className="text-white font-medium">Popularity:</span> 
                  <span className="text-gold-100">{userPreferences.popularity}</span>
                </motion.div>
              )}
              {userPreferences.rating && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-base">⭐</span>
                  <span className="text-white font-medium">Rating:</span> 
                  <span className="text-gold-100">{userPreferences.rating}</span>
                </motion.div>
              )}
              {userPreferences.language && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-base">🌍</span>
                  <span className="text-white font-medium">Language:</span> 
                  <span className="text-gold-100">{userPreferences.language}</span>
                </motion.div>
              )}
            </div>
          </div>        </motion.div>
      )}
    </div>
    </div>  )
}
