"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

import HeroSection from "@/components/sections/Hero"
import Testimonials from "@/components/sections/Testimonials"
import EventsGallery from "@/components/event-gallery"
import ClinicGalleryHome from "@/components/sections/ClinicGallery"

export default function Home() {
  const [loading, setLoading] = useState(true)

  const { isLoggedIn, user, initializeAuth } = useAuthStore()
  const router = useRouter()

  const getRoleRedirect = (role?: string) => {
    const normalized = role?.trim().toLowerCase().replace(/[\s_-]+/g, "_") ?? ""

    switch (normalized) {
      case "admin":
        return "/admin/dashboard"
      case "front_desk":
      case "frontdesk":
        return "https://appointments.drdentalcarecenter.com/"
      case "customer":
        return "https://members.drdentalcarecenter.com/"
      default:
        return "/"
    }
  }

  useEffect(() => {
    initializeAuth()
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [initializeAuth])

  useEffect(() => {
    if (!loading || !isLoggedIn) return

    const redirectPath = getRoleRedirect(user?.role)

    if (redirectPath === "/") return

    if (redirectPath.startsWith("http")) {
      window.location.assign(redirectPath)
      return
    }

    router.replace(redirectPath)
  }, [loading, isLoggedIn, user?.role, router])

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

  const redirectPath = isLoggedIn ? getRoleRedirect(user?.role) : "/"

  if (isLoggedIn && redirectPath !== "/") {
    return null
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ClinicGalleryHome />
      <EventsGallery />
      <Testimonials />
    </div>
  )
}
