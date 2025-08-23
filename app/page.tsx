import Link from "next/link";

export default function Home() {
  return (
      <div className="mini-app mini-app-container">
      {/* Mini App Header */}
      <div className="mini-app-nav">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="font-semibold text-lg">CastDeck</span>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to CastDeck</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Schedule and manage your Farcaster content
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Link
            href="/drafts"
            className="farcaster-card block w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg">My Drafts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">View and edit your saved drafts</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/scheduled"
            className="farcaster-card block w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg">Scheduled Posts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your scheduled content</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="farcaster-card">
          <h3 className="font-semibold text-lg mb-4">Your Content</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Drafts</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini App Bottom Action */}
      <div className="mini-app-bottom-sheet p-4">
        <Link
          href="/create"
          className="farcaster-button w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Draft
        </Link>
      </div>
    </div>
  );
}
