import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not logged in
 */
export function useProtectedRoute() {
  const router = useRouter()
  const { isLoggedIn, _hasHydrated } = useAuthStore()

  useEffect(() => {
    if (_hasHydrated && !isLoggedIn) {
      router.replace("/login")
    }
  }, [_hasHydrated, isLoggedIn, router])

  return { isLoggedIn, isHydrated: _hasHydrated }
}

/**
 * Hook to protect admin routes that require admin role
 * Redirects to home if user is not admin
 */
export function useAdminRoute() {
  const router = useRouter()
  const { isLoggedIn, user, _hasHydrated } = useAuthStore()
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    if (!_hasHydrated) {
      return
    }

    if (!isLoggedIn) {
      router.replace("/login")
    } else if (!isAdmin) {
      router.replace("/")
    }
  }, [_hasHydrated, isLoggedIn, isAdmin, router])

  return { isLoggedIn, isAdmin, isHydrated: _hasHydrated }
}
