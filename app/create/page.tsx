'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const [content, setContent] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const characterCount = content.length
  const maxCharacters = 320 // Farcaster cast limit

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      // TODO: Implement save to database
      console.log('Saving draft:', content)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push('/drafts')
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSchedule = async () => {
    if (!content.trim() || !scheduledTime) return

    setIsSubmitting(true)
    try {
      // TODO: Implement scheduling
      console.log('Scheduling post:', content, 'for:', scheduledTime)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push('/scheduled')
    } catch (error) {
      console.error('Error scheduling post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Create New</h1>
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Input */}
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening on Farcaster?"
          className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800"
          rows={6}
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
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="font-semibold">Schedule Post</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Post at a specific time instead of now
          </p>
        </div>
        <button
          onClick={() => setIsScheduling(!isScheduling)}
          className={`w-12 h-6 rounded-full transition-colors ${
            isScheduling ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
            isScheduling ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Scheduling Options */}
      {isScheduling && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Scheduled Time
          </label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800"
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {isScheduling ? (
          <button
            onClick={handleSchedule}
            disabled={!content.trim() || !scheduledTime || isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!content.trim() || isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
        )}

        <button
          onClick={() => router.back()}
          className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
