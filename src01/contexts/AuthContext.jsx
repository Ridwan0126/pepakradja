"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getUserByUsername, setUser, updateUser, getActiveElection } from "../utils/firestore"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentElection, setCurrentElection] = useState(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setAuthUser(userData)

          // Load current active election
          const election = await getActiveElection()
          setCurrentElection(election)
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)

      // Get user from Firestore by username
      const userData = await getUserByUsername(username)

      if (!userData) {
        const errorMessage = "Username atau password salah"
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      // Check password (simple comparison - in production use bcrypt)
      if (userData.password !== password) {
        const errorMessage = "Username atau password salah"
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      // Remove password from user data before storing
      const userWithoutPassword = { ...userData }
      delete userWithoutPassword.password

      // Save user to context and localStorage
      setAuthUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      // Load current active election
      const election = await getActiveElection()
      setCurrentElection(election)

      return userWithoutPassword
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      setAuthUser(null)
      setCurrentElection(null)
      localStorage.removeItem("currentUser")
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const createUser = async (userData) => {
    try {
      setError(null)

      // Generate unique ID for user
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      await setUser(uid, {
        ...userData,
        createdAt: new Date().toISOString(),
      })

      return uid
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateCurrentUser = async (updates) => {
    try {
      setError(null)

      if (!user || !user.id) {
        throw new Error("No user logged in")
      }

      await updateUser(user.id, updates)

      // Update local user state
      const updatedUser = { ...user, ...updates }
      setAuthUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const hasAccess = (page) => {
    if (!user) return false

    // Admin and Ketua have full access
    if (user.role === "admin" || user.role === "ketua") return true

    // Verifikator - data entry pages
    if (user.role === "verifikator") {
      const allowedPages = ["dashboard", "data-pemilih", "verifikasi-data", "laporan-rekap", "laporan-jurnal", "hasil"]
      return allowedPages.includes(page)
    }

    // Coordinator - offline votes
    if (user.role === "coordinator") {
      const allowedPages = ["dashboard", "suara-offline", "laporan-rekap", "laporan-jurnal", "hasil"]
      return allowedPages.includes(page)
    }

    // Pemilih - only voting access
    if (user.role === "pemilih") {
      return page === "voting" || page === "hasil"
    }

    return false
  }

  const value = {
    user,
    loading,
    error,
    currentElection,
    login,
    logout,
    createUser,
    updateCurrentUser,
    hasAccess,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
