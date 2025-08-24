'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFarcasterUser } from '@/lib/farcaster'
import { castdeckService } from '@/lib/database'

export default function CreatePage() {
  const [content, setContent] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { dbUser, needsSignup, isLoading: userLoading } = useFarcasterUser()
  const router = useRouter()

  // Redirect to signup if needed
  useEffect(() => {
    if (!userLoading && needsSignup) {
      router.push('/signup')
    }
  }, [needsSignup, userLoading, router])

  const characterCount = content.length
  const maxCharacters = 320 // Farcaster cast limit

  const handleSave = async () => {
    if (!content.trim() || !dbUser?.id) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Save draft to database
      await castdeckService.createDraftWithScheduling(
        dbUser.id,
        content.trim()
      )

      console.log('✅ Draft saved successfully')
      router.push('/drafts')
    } catch (err) {
      console.error('Error saving draft:', err)
      setError('Failed to save draft. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSchedule = async () => {
    if (!content.trim() || !scheduledTime || !dbUser?.id) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Save scheduled post to database
      await castdeckService.createDraftWithScheduling(
        dbUser.id,
        content.trim(),
        new Date(scheduledTime)
      )

      console.log('✅ Post scheduled successfully')
      router.push('/scheduled')
    } catch (err) {
      console.error('Error scheduling post:', err)
      setError('Failed to schedule post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking user status
  if (userLoading || needsSignup) {
    return (
      <div className="mini-app mini-app-container">
        <div className="p-4 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mini-app mini-app-container">
      {/* Mini App Header */}
      <div className="mini-app-nav">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-lg">Create New</span>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Content Input */}
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on Farcaster?"
            className="farcaster-input w-full resize-none"
            rows={8}
            maxLength={maxCharacters}
          />

          {/* Character Count */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {characterCount}/{maxCharacters} characters
            </span>
            {characterCount > maxCharacters * 0.8 && (
              <span className={`text-sm ${characterCount > maxCharacters ? 'text-red-500' : 'text-yellow-500'}`}>
                {characterCount > maxCharacters ? 'Over limit!' : 'Getting close...'}
              </span>
            )}
          </div>
        </div>

        {/* Scheduling Toggle */}
        <div className="farcaster-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Schedule Post</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Post at a specific time instead of now
              </p>
            </div>
            <button
              onClick={() => setIsScheduling(!isScheduling)}
              className={`w-14 h-7 rounded-full transition-colors ${
                isScheduling ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white dark:bg-black rounded-full transition-transform ${
                isScheduling ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Scheduling Options */}
        {isScheduling && (
          <div className="farcaster-card space-y-3">
            <label className="block text-sm font-medium">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="farcaster-input w-full"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>

      {/* Mini App Bottom Actions */}
      <div className="mini-app-bottom-sheet p-4 space-y-3">
        {isScheduling ? (
          <button
            onClick={handleSchedule}
            disabled={!content.trim() || !scheduledTime || isSubmitting || !dbUser?.id}
            className="farcaster-button w-full"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!content.trim() || isSubmitting || !dbUser?.id}
            className="farcaster-button w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
        )}

        <button
          onClick={() => router.back()}
          className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-full transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
