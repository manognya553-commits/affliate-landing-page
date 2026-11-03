import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, ApiError } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiHealth, setApiHealth] = useState({ online: false, latencyMs: 0, db: 'unknown' })

  // Probe API health and real roundtrip latency
  const probeHealth = useCallback(async () => {
    const health = await api.checkHealth()
    setApiHealth(health)
    return health
  }, [])

  // Fetch current authenticated user and profile from FastAPI backend
  const fetchCurrentUser = useCallback(async () => {
    try {
      const meData = await api.get('/api/auth/me')
      if (meData?.user) {
        setUser(meData.user)
        setRoles(meData.roles || [])
        setPermissions(meData.permissions || [])

        // Also fetch full affiliate profile details
        try {
          const profileData = await api.get('/api/affiliate/profile')
          setProfile(profileData)
        } catch {
          // Admin accounts might not require a full affiliate profile
          setProfile(null)
        }
        return meData.user
      }
      setUser(null)
      setRoles([])
      setPermissions([])
      setProfile(null)
      return null
    } catch {
      // 401 Unauthorized or guest visitor
      setUser(null)
      setRoles([])
      setPermissions([])
      setProfile(null)
      return null
    }
  }, [])

  // Initial load
  useEffect(() => {
    let mounted = true

    const init = async () => {
      setLoading(true)
      await probeHealth()
      if (mounted) {
        await fetchCurrentUser()
        setLoading(false)
      }
    }

    init()

    // Periodically refresh latency probe every 30 seconds
    const interval = setInterval(probeHealth, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [probeHealth, fetchCurrentUser])

  // Sign Up
  const signUp = async ({ email, password, preferredLanguage = 'en', ...profileDetails }) => {
    setError(null)
    const payload = {
      email,
      password,
      preferred_language: preferredLanguage === 'te' ? 'te' : 'en',
      ...profileDetails,
    }
    const data = await api.post('/api/auth/signup', payload)
    if (data?.user) {
      setUser(data.user)
      setRoles(data.roles || ['affiliate'])
      setPermissions(data.permissions || [])
      await fetchCurrentUser()
    }
    return data
  }

  // Sign In
  const signIn = async ({ email, password }) => {
    setError(null)
    const data = await api.post('/api/auth/login', { email, password })
    if (data?.user) {
      setUser(data.user)
      setRoles(data.roles || [])
      setPermissions(data.permissions || [])
      await fetchCurrentUser()
    }
    return data
  }

  // Sign Out
  const signOut = async () => {
    setError(null)
    try {
      await api.post('/api/auth/logout', {})
    } catch {
      // Clear client state even if network fails
    }
    setUser(null)
    setRoles([])
    setPermissions([])
    setProfile(null)
  }

  // Password Reset Request
  const resetPassword = async (email) => {
    setError(null)
    return await api.post('/api/auth/forgot-password', { email })
  }

  // Update / Set New Password
  const updatePassword = async ({ token, newPassword }) => {
    setError(null)
    return await api.post('/api/auth/reset-password', {
      token,
      new_password: newPassword,
    })
  }

  // Update Profile details
  const updateProfile = async (updates) => {
    const updated = await api.put('/api/affiliate/profile', updates)
    setProfile(updated)
    return updated
  }

  // Submit Profile for completion (auto-activates)
  const submitProfile = async (payload) => {
    const submitted = await api.post('/api/affiliate/profile/submit', payload)
    setProfile(submitted)
    await fetchCurrentUser()
    return submitted
  }

  // Refresh profile & user on demand
  const refreshProfile = async () => {
    return await fetchCurrentUser()
  }

  const role = roles.includes('admin') ? 'admin' : 'affiliate'
  const status = profile?.status || (roles.includes('admin') ? 'approved' : 'draft')
  const session = user ? { user } : null

  const value = {
    session,
    user,
    roles,
    role,
    permissions,
    profile,
    status,
    loading,
    error,
    apiHealth,
    probeHealth,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    submitProfile,
    refreshProfile,
    isConfigured: true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
