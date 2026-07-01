'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'careconnect-large-text'

type LargeTextContextValue = {
  largeText: boolean
  toggleLargeText: () => void
}

const LargeTextContext = createContext<LargeTextContextValue>({
  largeText: false,
  toggleLargeText: () => undefined,
})

export function useLargeText() {
  return useContext(LargeTextContext)
}

export function LargeTextProvider({ children }: { children: React.ReactNode }) {
  const [largeText, setLargeText] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const on = window.localStorage.getItem(STORAGE_KEY) === 'on'
      setLargeText(on)
      document.documentElement.classList.toggle('care-large-text', on)
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  const toggleLargeText = useCallback(() => {
    setLargeText((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      } catch {
        // ignore
      }
      document.documentElement.classList.toggle('care-large-text', next)
      return next
    })
  }, [])

  if (!ready) return <>{children}</>

  return (
    <LargeTextContext.Provider value={{ largeText, toggleLargeText }}>
      {children}
    </LargeTextContext.Provider>
  )
}
