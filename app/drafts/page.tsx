'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Mock data - will be replaced with real data from Supabase
const mockDrafts = [
  {
    id: '1',
    content: 'Just finished building my first Farcaster Mini App! 🚀 The ecosystem is growing so fast...',
    created_at: '2024-01-15T10:30:00Z',
    status: 'draft'
  },
  {
    id: '2',
    content: 'Working on some exciting new features for CastDeck. Can\'t wait to share them with the community!',
    created_at: '2024-01-14T15:45:00Z',
    status: 'draft'
  }
]

export default function DraftsPage() {
  const [drafts] = useState(mockDrafts)
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <span className="font-semibold text-lg">My Drafts</span>
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
        {drafts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">No drafts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first draft to get started
            </p>
            <button
              onClick={() => router.push('/create')}
              className="farcaster-button"
            >
              Create Draft
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="farcaster-card space-y-4"
              >
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-base">
                  {draft.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(draft.created_at)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/drafts/${draft.id}/edit`)}
                      className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/drafts/${draft.id}/schedule`)}
                      className="px-4 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      Schedule
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
          Create New Draft
        </button>
      </div>
    </div>
  )
}
