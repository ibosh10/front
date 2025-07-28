"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: number
  name: string
  email: string
  phoneNumber: string
  role: "USER" | "ADMIN"
  googleUser: boolean
  verified: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

interface RegisterData {
  name: string
  email: string
  password: string
  phoneNumber: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchCurrentUser(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await apiClient.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setUser(response.data)
      setError(null)
    } catch (error: any) {
      console.error("Failed to fetch current user:", error)
      // Don't remove token immediately, might be temporary network issue
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
      }
      setError("Failed to authenticate user")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      const response = await apiClient.post("/api/auth/login", {
        email: email.trim(),
        password,
      })

      const { token: newToken, user: userData } = response.data

      // Check if user is verified
      if (!userData.verified) {
        throw new Error("Please verify your email before logging in. Check your email for verification code.")
      }

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setError(null)
      setLoading(true)

      // Clean the data
      const cleanData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phoneNumber: data.phoneNumber.trim(),
      }

      await apiClient.post("/api/auth/register", cleanData)
    } catch (error: any) {
      console.error("Registration error:", error)
      let errorMessage = "Registration failed"

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setError(null)
  }

  return (
      <AuthContext.Provider value={{ user, token, login, register, logout, loading, error }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
