// Farcaster Mini App integration
import { useEffect, useState } from 'react'
import { userService, castdeckService } from './database'

// Import the actual Mini App SDK
import MiniApp from '@farcaster/miniapp-sdk'

// Mini App SDK types
interface MiniAppUser {
  fid: number
  username: string
  displayName?: string
  avatarUrl?: string
}

interface MiniAppContext {
  user: MiniAppUser | null
  theme: 'light' | 'dark'
  isReady: boolean
  dbUser: any // Database user record
}

// Mini App SDK hook
export const useMiniApp = () => {
  const [context, setContext] = useState<MiniAppContext>({
    user: null,
    theme: 'light',
    isReady: false,
    dbUser: null
  })

  useEffect(() => {
    // Initialize Mini App SDK
    const initMiniApp = async () => {
      try {
        console.log('Initializing Mini App SDK...')
        console.log('MiniApp object:', MiniApp)
        console.log('MiniApp.actions:', MiniApp.actions)

        // Call ready() to dismiss the splash screen - this is the key fix
        if (MiniApp.actions && MiniApp.actions.ready) {
          console.log('Calling MiniApp.actions.ready()...')
          await MiniApp.actions.ready()
          console.log('✅ Mini App ready() called successfully - splash screen should be dismissed')
        } else {
          console.warn('⚠️ MiniApp.actions.ready() not available')
        }

        // For now, use fallback user data until we figure out the correct SDK API
        const miniAppUser: MiniAppUser = {
          fid: 12345,
          username: 'alice',
          displayName: 'Alice',
          avatarUrl: 'https://example.com/avatar.jpg'
        }

        // Create user in database
        let dbUser = null
        try {
          dbUser = await userService.getOrCreateUser(
            miniAppUser.fid,
            miniAppUser.username,
            miniAppUser.displayName,
            miniAppUser.avatarUrl
          )
          console.log('✅ Database user created:', dbUser)
        } catch (dbError) {
          console.warn('⚠️ Could not create database user:', dbError)
        }

        // Get theme from system preference
        const theme: 'light' | 'dark' = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

        setContext({
          user: miniAppUser,
          theme,
          isReady: true,
          dbUser
        })

        // Listen for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleThemeChange = (e: MediaQueryListEvent) => {
          setContext(prev => ({ ...prev, theme: e.matches ? 'dark' : 'light' }))
        }
        mediaQuery.addEventListener('change', handleThemeChange)

        return () => mediaQuery.removeEventListener('change', handleThemeChange)
      } catch (error) {
        console.error('❌ Failed to initialize Mini App:', error)

        // Still set ready to true so the app works
        setContext({
          user: null,
          theme: 'light',
          isReady: true,
          dbUser: null
        })
      }
    }

    initMiniApp()
  }, [])

  return context
}

// Hook for getting current user
export const useFarcasterUser = () => {
  const { user, dbUser, isReady } = useMiniApp()

  return {
    user,
    dbUser,
    isLoading: !isReady,
    error: null
  }
}

// Hook for posting casts
export const usePostCast = () => {
  const postCast = async (content: string) => {
    try {
      console.log('Posting cast:', content)

      // TODO: Implement actual Farcaster posting via Mini App SDK
      // if (MiniApp.actions && MiniApp.actions.postCast) {
      //   const result = await MiniApp.actions.postCast({ text: content })
      //   return { success: true, result }
      // }

      return { success: true }
    } catch (error) {
      console.error('Error posting cast:', error)
      return { success: false, error }
    }
  }

  return { postCast }
}

// Hook for scheduling casts
export const useScheduleCast = () => {
  const scheduleCast = async (content: string, scheduledTime: Date) => {
    try {
      console.log('Scheduling cast:', content, 'for:', scheduledTime)

      // TODO: Implement actual scheduling with background job
      // This would create a draft and scheduled post in the database
      // Then set up a background job to post at the scheduled time

      return { success: true }
    } catch (error) {
      console.error('Error scheduling cast:', error)
      return { success: false, error }
    }
  }

  return { scheduleCast }
}

// Mini App navigation helpers
export const useMiniAppNavigation = () => {
  const navigate = async (path: string) => {
    try {
      // Try to use SDK navigation if available
      if (MiniApp.actions && MiniApp.actions.openUrl) {
        await MiniApp.actions.openUrl(path)
      } else {
        // Fallback for development
        window.history.pushState({}, '', path)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback for development
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const goBack = async () => {
    try {
      if (MiniApp.actions && MiniApp.actions.close) {
        await MiniApp.actions.close()
      } else {
        // Fallback for development
        window.history.back()
      }
    } catch (error) {
      console.error('Go back error:', error)
      // Fallback for development
      window.history.back()
    }
  }

  const close = async () => {
    try {
      if (MiniApp.actions && MiniApp.actions.close) {
        await MiniApp.actions.close()
      } else {
        // Fallback for development
        console.log('Closing Mini App')
      }
    } catch (error) {
      console.error('Close error:', error)
      // Fallback for development
      console.log('Closing Mini App')
    }
  }

  return { navigate, goBack, close }
}

// Mini App theme hook
export const useMiniAppTheme = () => {
  const { theme } = useMiniApp()

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return theme
}

// Farcaster Hub API client (placeholder)
export const farcasterHubClient = {
  // Will be implemented when we have proper Farcaster API access
  postCast: async (content: string) => {
    console.log('Posting to Farcaster Hub:', content)
    return { success: true }
  }
}
