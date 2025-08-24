'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFarcasterUser } from '@/lib/farcaster'
import { scheduledPostService } from '@/lib/database'
import type { Database } from '@/lib/database.types'

type ScheduledPost = Database['public']['Tables']['scheduled_posts']['Row'] & {
  drafts?: {
    id: string
    content: string
    status: string
  }
}

export default function ScheduledPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { dbUser } = useFarcasterUser()
  const router = useRouter()

  // Load scheduled posts from database
  useEffect(() => {
    const loadScheduledPosts = async () => {
      if (!dbUser?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const posts = await scheduledPostService.getScheduledPosts(dbUser.id)
        setScheduledPosts(posts)
      } catch (err) {
        console.error('Error loading scheduled posts:', err)
        setError('Failed to load scheduled posts')
      } finally {
        setIsLoading(false)
      }
    }

    loadScheduledPosts()
  }, [dbUser?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 0) {
      return 'Overdue'
    } else if (diffInHours < 1) {
      const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60))
      return `In ${diffInMinutes} minutes`
    } else if (diffInHours < 24) {
      return `In ${diffInHours} hours`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `In ${diffInDays} days`
    }
  }

  const handleDeleteScheduledPost = async (postId: string) => {
    if (!dbUser?.id) return

    try {
      await scheduledPostService.deleteScheduledPost(postId, dbUser.id)
      // Remove from local state
      setScheduledPosts(prev => prev.filter(post => post.id !== postId))
    } catch (err) {
      console.error('Error deleting scheduled post:', err)
      setError('Failed to delete scheduled post')
    }
  }

  if (isLoading) {
    return (
      <div className="mini-app mini-app-container">
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
            <span className="font-semibold text-lg">Scheduled Posts</span>
          </div>
          <button
            onClick={() => router.push('/create')}
            className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading scheduled posts...</p>
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
          <span className="font-semibold text-lg">Scheduled Posts</span>
        </div>
        <button
          onClick={() => router.push('/create')}
          className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {scheduledPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">No scheduled posts</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Schedule your first post to get started
            </p>
            <button
              onClick={() => router.push('/create')}
              className="farcaster-button"
            >
              Schedule Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="farcaster-card space-y-4"
              >
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-base">
                  {post.drafts?.content || 'Content not available'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.scheduled_time)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                      post.status === 'posted' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      post.status === 'failed' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatScheduledTime(post.scheduled_time)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {post.status === 'pending' && (
                      <button
                        onClick={() => router.push(`/scheduled/${post.id}/edit`)}
                        className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteScheduledPost(post.id)}
                      className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mini App Bottom Action */}
      <div className="mini-app-bottom-sheet p-4">
        <button
          onClick={() => router.push('/create')}
          className="farcaster-button w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule New Post
        </button>
      </div>
    </div>
  )
}
