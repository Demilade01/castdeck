'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFarcasterUser } from '@/lib/farcaster'
import { useAuth } from '@/lib/auth-context'
import { userService } from '@/lib/database'

interface FarcasterUserData {
  fid: number
  username: string
  displayName?: string
  avatarUrl?: string
}

export default function SignupPage() {
  const [userData, setUserData] = useState<FarcasterUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, dbUser } = useFarcasterUser()
  const { refreshUser } = useAuth()
  const router = useRouter()

  // Check if user is already signed up
  useEffect(() => {
    if (dbUser) {
      // User is already signed up, redirect to home
      router.push('/')
      return
    }
    setIsLoading(false)
  }, [dbUser, router])

  // Get user data from Farcaster Quick Auth
  useEffect(() => {
    const getUserData = async () => {
      try {
        // If we have user data from Quick Auth, use it
        if (user) {
          setUserData({
            fid: user.fid,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl
          })
        } else {
          // No user data available, show error
          setError('Could not load your Farcaster account information. Please try again.')
        }
      } catch (err) {
        console.error('Error getting user data:', err)
        setError('Could not load your Farcaster account information')
      }
    }

    getUserData()
  }, [user])

  const handleSignup = async () => {
    if (!userData) return

    setIsSigningUp(true)
    setError(null)

    try {
      // Create user in database
      await userService.getOrCreateUser(
        userData.fid,
        userData.username,
        userData.displayName,
        userData.avatarUrl
      )

      console.log('✅ User signed up successfully')

      // Refresh auth context to update authentication state
      await refreshUser()

      router.push('/')
    } catch (err) {
      console.error('Error signing up:', err)
      setError('Failed to create your account. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleSkip = () => {
    // For now, redirect to home (could implement guest mode later)
    router.push('/')
  }

  if (isLoading) {
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="font-semibold text-lg">CastDeck</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to CastDeck</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage your Farcaster content
          </p>
        </div>

        {/* User Info Card */}
        {userData ? (
          <div className="farcaster-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {userData.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt={userData.displayName || userData.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {userData.displayName || userData.username}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  @{userData.username}
                </p>
                <p className="text-sm text-gray-400">
                  FID: {userData.fid}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="farcaster-card">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Connecting to your Farcaster account...
              </p>
            </div>
          </div>
        )}

        {/* Signup Benefits */}
        <div className="farcaster-card space-y-4">
          <h3 className="font-semibold text-lg">What you can do with CastDeck:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm">Create and save draft posts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm">Schedule posts for later</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm">Track your posting analytics</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Privacy & Data</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            We only store your Farcaster ID, username, and display name to provide our services.
            Your content drafts and scheduled posts are stored securely and are only accessible to you.
            We never post to Farcaster without your explicit permission.
          </p>
        </div>
      </div>

      {/* Mini App Bottom Actions */}
      <div className="mini-app-bottom-sheet p-4 space-y-3">
        <button
          onClick={handleSignup}
          disabled={!userData || isSigningUp}
          className="farcaster-button w-full"
        >
          {isSigningUp ? 'Creating Account...' : 'Connect Farcaster Account'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-full transition-colors"
        >
          Skip for Now
        </button>
      </div>
    </div>
  )
}
