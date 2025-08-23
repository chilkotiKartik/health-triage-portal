"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, authService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "patient" | "doctor" | "admin"
  }) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser()
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login(email, password)
      if (result) {
        setUser(result.user)
        localStorage.setItem("auth_token", result.token)
        localStorage.setItem("auth_user", JSON.stringify(result.user))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "patient" | "doctor" | "admin"
  }): Promise<boolean> => {
    try {
      const result = await authService.register(userData)
      setUser(result.user)
      localStorage.setItem("auth_token", result.token)
      localStorage.setItem("auth_user", JSON.stringify(result.user))
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
