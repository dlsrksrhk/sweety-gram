'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import * as realApi from '@/lib/api/auth'
import * as mockApi from '@/lib/api/auth.mock'
import { useAuthStore } from '@/lib/stores/use-auth-store'
import type { LoginFormData, RegisterFormData } from '@/lib/schemas/auth-schema'

const api = process.env.NEXT_PUBLIC_USE_MOCK === 'true' ? mockApi : realApi
const { login, register, logout: logoutApi } = api

export function useLogin() {
  const { setUser, setToken } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: LoginFormData) => login(email, password),
    onSuccess: ({ user, token }) => {
      setUser(user)
      setToken(token)
      document.cookie = `auth-token=${token}; path=/`
      router.push('/feed')
    },
  })
}

export function useRegister() {
  const { setUser, setToken } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ username, email, password }: RegisterFormData) =>
      register(username, email, password),
    onSuccess: ({ user, token }) => {
      setUser(user)
      setToken(token)
      document.cookie = `auth-token=${token}; path=/`
      router.push('/feed')
    },
  })
}

export function useLogout() {
  const { token, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => logoutApi(token ?? ''),
    onSuccess: () => {
      logout()
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      queryClient.clear()
      router.push('/')
    },
  })
}
