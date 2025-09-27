'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useFarcasterUser } from './farcaster'
import { userService } from './database'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  signOut: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { dbUser, needsSignup, isLoading: userLoading } = useFarcasterUser()

  useEffect(() => {
    if (!userLoading) {
      if (dbUser && !needsSignup) {
        setIsAuthenticated(true)
        setUser(dbUser)
      } else if (dbUser && dbUser.fid) {
        // Even if we need signup, if we have a valid FID, we can authenticate
        // This handles the case where we have minimal user data from the JWT
        setIsAuthenticated(true)
        setUser(dbUser)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
      setIsLoading(false)
    }
  }, [dbUser, needsSignup, userLoading])

  const signOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    // Clear any stored tokens or session data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farcaster_token')
      sessionStorage.removeItem('farcaster_token')
    }
  }

  const refreshUser = async () => {
    if (user?.farcaster_id || user?.fid) {
      try {
        const userId = user.farcaster_id || user.fid
        const refreshedUser = await userService.getUserByFarcasterId(userId)
        if (refreshedUser) {
          setUser(refreshedUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error refreshing user:', error)
      }
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}