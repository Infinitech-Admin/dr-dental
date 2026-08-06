"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

import HeroSection from "@/components/sections/Hero"
import Testimonials from "@/components/sections/Testimonials"

export default function Home() {
  const [loading, setLoading] = useState(true)

  const { isLoggedIn, user, initializeAuth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initializeAuth()
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [initializeAuth])

  useEffect(() => {
    if (!loading && isLoggedIn && user?.role?.toLowerCase() === "admin") {
      router.replace("/admin/dashboard")
    }
  }, [loading, isLoggedIn, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-400 border-t-transparent" />
          <span className="text-sm font-medium tracking-wide text-green-700">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  if (isLoggedIn && user?.role?.toLowerCase() === "admin") {
    return null
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <Testimonials />
    </div>
  )
}
