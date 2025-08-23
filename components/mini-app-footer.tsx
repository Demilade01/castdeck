'use client'

import { useRouter } from 'next/navigation'

export default function MiniAppFooter() {
  const router = useRouter()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <button
        onClick={() => router.push('/create')}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Create New Draft
      </button>
    </footer>
  )
}
