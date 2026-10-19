"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"

interface ProtectedPageProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
  fallback?: React.ReactNode
}

export function ProtectedPage({ children, requiredRole, fallback }: ProtectedPageProps) {
  const [mounted, setMounted] = useState(false)
  const { isLoggedIn, user } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback || <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isLoggedIn) {
    return fallback || <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>
  }

  if (requiredRole === "admin" && user?.role !== "admin") {
    return fallback || <div className="min-h-screen flex items-center justify-center">Access denied.</div>
  }

  return <>{children}</>
}
