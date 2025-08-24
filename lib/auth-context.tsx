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
    // In a real app, you might want to clear local storage or call an API
  }

  const refreshUser = async () => {
    if (user?.farcaster_id) {
      try {
        const refreshedUser = await userService.getUserByFarcasterId(user.farcaster_id)
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
