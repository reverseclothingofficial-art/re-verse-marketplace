"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface CookieContextType {
  cookieValue: string
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

export const useCookieContext = () => {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error("useCookieContext must be used within a CookieProvider")
  }
  return context
}

interface CookieProviderProps {
  children: ReactNode
}

export const CookieProvider = ({ children }: CookieProviderProps) => {
  const [cookieValue, setCookieValue] = useState("")

  useEffect(() => {
    const fetchCookie = async () => {
      try {
        const res = await fetch("/api/get-cookies")
        if (!res.ok) throw new Error("Failed to fetch cookie")
        const data = await res.json()
        setCookieValue(data.myCookie || "")
      } catch (error) {
        console.error("Error fetching cookie:", error)
      }
    }
    fetchCookie()
  }, [])

  return (
    <CookieContext.Provider value={{ cookieValue }}>
      {children}
    </CookieContext.Provider>
  )
}
