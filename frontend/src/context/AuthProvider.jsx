import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../services/authService'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = authApi.getStoredToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const res = await authApi.verify()
      setUser(res.data?.user ?? null)
    } catch {
      authApi.setStoredToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (payload) => {
    const res = await authApi.login(payload)
    authApi.setStoredToken(res.data.accessToken)
    setUser(res.data.user)
    return res
  }, [])

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload)
    authApi.setStoredToken(res.data.accessToken)
    setUser(res.data.user)
    return res
  }, [])

  const logout = useCallback(() => {
    authApi.setStoredToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
