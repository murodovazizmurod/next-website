'use client'

import { useState, useEffect } from 'react'

const REACTION_TYPES = [
  { emoji: '😂', label: 'Laugh' },
  { emoji: '🗿', label: 'Moyai' },
  { emoji: '👍', label: 'Like' },
  { emoji: '👎', label: 'Dislike' },
] as const

const STORAGE_KEY = 'live_reactions'

interface LiveReactionsProps {
  postId: string
  initialReactions?: Record<string, number>
}

export default function LiveReactions({ postId, initialReactions = {} }: LiveReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions)
  const [isLoading, setIsLoading] = useState(false)
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Read from localStorage after component mounts (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const userReactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string>
        const savedReaction = userReactions[postId] || null
        setUserReaction(savedReaction)
      } catch (error) {
        console.error('Error reading from localStorage:', error)
      }
      setIsInitialized(true)
    }
  }, [postId])

  const handleReaction = async (emoji: string) => {
    if (isLoading || !isInitialized) return

    setIsLoading(true)

    // CRITICAL: Read from localStorage BEFORE any updates
    // This is the source of truth for what reaction the user currently has
    let currentReaction: string | null = null
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        let userReactions: Record<string, string> = {}
        
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            // Handle both object and array formats (legacy support)
            if (Array.isArray(parsed)) {
              userReactions = {}
            } else if (typeof parsed === 'object' && parsed !== null) {
              userReactions = parsed as Record<string, string>
            }
          } catch (parseError) {
            console.error('Error parsing localStorage:', parseError)
            userReactions = {}
          }
        }
        
        currentReaction = userReactions[postId] || null
        // Clean the value for comparison
        if (currentReaction) {
          currentReaction = String(currentReaction).trim()
        }
        
        // Also check state as fallback if localStorage doesn't have it but state does
        if (!currentReaction && userReaction) {
          currentReaction = String(userReaction).trim()
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        currentReaction = userReaction ? String(userReaction).trim() : null
      }
    } else {
      currentReaction = userReaction ? String(userReaction).trim() : null
    }

    // Determine action BEFORE any localStorage updates
    // Compare the emoji parameter (also cleaned) with currentReaction
    const cleanEmoji = String(emoji).trim()
    const isRemoving = currentReaction === cleanEmoji
    const hasExistingReaction = currentReaction !== null && currentReaction !== undefined && currentReaction !== ''
    
    // Determine the action
    let action: 'remove' | 'change' | 'add'
    if (isRemoving) {
      action = 'remove'
    } else if (hasExistingReaction) {
      action = 'change'
    } else {
      action = 'add'
    }
    
    const finalPreviousEmoji = (action === 'change' || action === 'remove') ? currentReaction : null

    try {
      const response = await fetch(`/api/live/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          emoji: cleanEmoji,
          action,
          previousEmoji: finalPreviousEmoji,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReactions(data.reactions || {})
        
        // Update localStorage ONLY after successful API response
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem(STORAGE_KEY)
            let userReactions: Record<string, string> = {}
            
            if (stored) {
              try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                  userReactions = {}
                } else if (typeof parsed === 'object' && parsed !== null) {
                  userReactions = parsed as Record<string, string>
                }
              } catch {
                userReactions = {}
              }
            }
            
            if (action === 'remove') {
              delete userReactions[postId]
              setUserReaction(null)
            } else {
              userReactions[postId] = cleanEmoji
              setUserReaction(cleanEmoji)
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userReactions))
          } catch (error) {
            console.error('Error updating localStorage:', error)
          }
        }
      } else {
        // If API call failed, don't update localStorage
        console.error('API call failed:', await response.text())
      }
    } catch (error) {
      console.error('Error updating reaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-full px-2 py-1">
      {REACTION_TYPES.map(({ emoji, label }) => {
        const count = reactions[emoji] || 0
        const isActive = userReaction === emoji
        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`flex items-center gap-1 text-[10px] hover:opacity-70 transition-opacity disabled:opacity-50 ${
              isActive ? 'opacity-100' : ''
            }`}
            aria-label={isActive ? `Remove ${label}` : label}
            disabled={isLoading || !isInitialized}
            title={isActive ? `Click to remove ${label}` : label}
          >
            <span className={`text-xs ${isActive ? 'scale-110' : ''} transition-transform`}>{emoji}</span>
            {count > 0 && (
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

