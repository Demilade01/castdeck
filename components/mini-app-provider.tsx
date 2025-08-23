'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useMiniApp, useMiniAppTheme } from '@/lib/farcaster'

interface MiniAppContextType {
  isReady: boolean
  user: any
  theme: 'light' | 'dark'
}

const MiniAppContext = createContext<MiniAppContextType>({
  isReady: false,
  user: null,
  theme: 'light'
})

export const useMiniAppContext = () => useContext(MiniAppContext)

export default function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const { user, theme, isReady } = useMiniApp()
  const currentTheme = useMiniAppTheme()

  // Apply Mini App specific styles
  useEffect(() => {
    if (isReady) {
      // Add Mini App class to body
      document.body.classList.add('mini-app')

      // Set viewport for Mini App
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover')
      }

      // Add safe area CSS variables
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)')
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)')
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)')
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)')
    }
  }, [isReady])

  return (
    <MiniAppContext.Provider value={{ isReady, user, theme: currentTheme }}>
      {children}
    </MiniAppContext.Provider>
  )
}
