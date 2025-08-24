// Farcaster Mini App integration
import { useEffect, useState } from 'react'
import { userService } from './database'
import { sdk } from '@farcaster/miniapp-sdk'

// Mini App SDK types
interface FarcasterUser {
  fid: number
  username: string
  displayName?: string
  avatarUrl?: string
}

interface MiniAppContext {
  user: FarcasterUser | null
  theme: 'light' | 'dark'
  isReady: boolean
  dbUser: any
  needsSignup: boolean
  isLoading: boolean
  isMiniApp: boolean
}

// Check if running in Mini App environment
const isInMiniApp = async (): Promise<boolean> => {
  try {
    return await sdk.isInMiniApp()
  } catch (error) {
    console.log('Not running in Mini App environment')
    return false
  }
}

// Mini App SDK hook
export const useMiniApp = () => {
  const [context, setContext] = useState<MiniAppContext>({
    user: null,
    theme: 'light',
    isReady: false,
    dbUser: null,
    needsSignup: false,
    isLoading: true,
    isMiniApp: false
  })

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        console.log('Initializing Mini App...')

        // Check if running in Mini App environment
        const miniApp = await isInMiniApp()
        console.log('Is Mini App:', miniApp)

        let farcasterUser: FarcasterUser | null = null
        let dbUser = null
        let needsSignup = false

        if (miniApp) {
          // Call ready() to dismiss the splash screen
          await sdk.actions.ready()
          console.log('✅ Mini App ready() called successfully')

          // Get user data using Quick Auth
          try {
            console.log('Fetching user data with Quick Auth...')
            const response = await sdk.quickAuth.fetch('/api/user-data')

            if (response.ok) {
              const userData = await response.json()
              console.log('✅ User data received:', userData)

              farcasterUser = {
                fid: userData.fid,
                username: userData.username,
                displayName: userData.displayName,
                avatarUrl: userData.avatarUrl
              }

              // Check if user exists in database
              if (farcasterUser) {
                dbUser = await userService.getUserByFarcasterId(farcasterUser.fid)
                if (!dbUser) {
                  needsSignup = true
                }
              }
            } else {
              console.warn('⚠️ Failed to fetch user data:', response.status, response.statusText)
              needsSignup = true
            }
          } catch (authError) {
            console.warn('⚠️ Quick Auth not available:', authError)
            needsSignup = true
          }
        } else {
          // Not in Mini App environment, user needs to sign up
          console.log('Not in Mini App environment, user needs to sign up')
          needsSignup = true
        }

        // Get theme from system preference
        let theme: 'light' | 'dark' = 'light'
        if (typeof window !== 'undefined' && window.matchMedia) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }

        setContext({
          user: farcasterUser,
          theme,
          isReady: true,
          dbUser,
          needsSignup,
          isLoading: false,
          isMiniApp: miniApp
        })

        // Listen for theme changes
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleThemeChange = (e: MediaQueryListEvent) => {
            setContext(prev => ({ ...prev, theme: e.matches ? 'dark' : 'light' }))
          }
          mediaQuery.addEventListener('change', handleThemeChange)

          return () => mediaQuery.removeEventListener('change', handleThemeChange)
        }
      } catch (error) {
        console.error('❌ Failed to initialize Mini App:', error)
        setContext({
          user: null,
          theme: 'light',
          isReady: true,
          dbUser: null,
          needsSignup: true,
          isLoading: false,
          isMiniApp: false
        })
      }
    }

    initMiniApp()
  }, [])

  return context
}

// Hook for getting current user
export const useFarcasterUser = () => {
  const { user, dbUser, isReady, needsSignup, isLoading } = useMiniApp()

  return {
    user,
    dbUser,
    isLoading: !isReady || isLoading,
    needsSignup,
    error: null
  }
}

// Hook for posting casts
export const usePostCast = () => {
  const { isMiniApp } = useMiniApp()

  const postCast = async (content: string) => {
    try {
      console.log('Posting cast:', content)

      if (isMiniApp) {
        const response = await sdk.quickAuth.fetch('/api/post-cast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content })
        })

        if (response.ok) {
          const result = await response.json()
          return { success: true, result }
        } else {
          throw new Error(`Failed to post cast: ${response.status}`)
        }
      } else {
        // Not in Mini App, just log for now
        console.log('📝 Cast content (not in Mini App):', content)
        return { success: true, result: { message: 'Cast posted successfully' } }
      }
    } catch (error) {
      console.error('Error posting cast:', error)
      return { success: false, error }
    }
  }

  return { postCast }
}

// Hook for scheduling casts
export const useScheduleCast = () => {
  const { isMiniApp } = useMiniApp()

  const scheduleCast = async (content: string, scheduledTime: Date) => {
    try {
      console.log('Scheduling cast:', content, 'for:', scheduledTime)

      if (isMiniApp) {
        const response = await sdk.quickAuth.fetch('/api/schedule-cast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, scheduledTime })
        })

        if (response.ok) {
          const result = await response.json()
          return { success: true, result }
        } else {
          throw new Error(`Failed to schedule cast: ${response.status}`)
        }
      } else {
        // Not in Mini App, just log for now
        console.log('📅 Cast to be scheduled (not in Mini App):', content, 'for:', scheduledTime)
        return { success: true, result: { message: 'Cast scheduled successfully' } }
      }
    } catch (error) {
      console.error('Error scheduling cast:', error)
      return { success: false, error }
    }
  }

  return { scheduleCast }
}

// Mini App navigation helpers
export const useMiniAppNavigation = () => {
  const { isMiniApp } = useMiniApp()

  const navigate = async (path: string) => {
    if (isMiniApp) {
      await sdk.actions.openUrl(path)
    } else {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }
  }

  const goBack = async () => {
    if (isMiniApp) {
      await sdk.actions.close()
    } else {
      if (typeof window !== 'undefined') {
        window.history.back()
      }
    }
  }

  const close = async () => {
    if (isMiniApp) {
      await sdk.actions.close()
    } else {
      console.log('Closing Mini App')
    }
  }

  return { navigate, goBack, close }
}

// Mini App theme hook
export const useMiniAppTheme = () => {
  const { theme } = useMiniApp()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return theme
}
