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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Drafts</h1>
        <button
          onClick={() => router.push('/create')}
          className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Drafts List */}
      <div className="space-y-3">
        {drafts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first draft to get started
            </p>
            <button
              onClick={() => router.push('/create')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Create Draft
            </button>
          </div>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
            >
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {draft.content}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(draft.created_at)}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/drafts/${draft.id}/edit`)}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/drafts/${draft.id}/schedule`)}
                    className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
