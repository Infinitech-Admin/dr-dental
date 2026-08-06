"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowLeftCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { toast, Toaster } from "sonner"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const login = useAuthStore((state) => state.login)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Your Laravel response shape: { success, data: { token, user } }
        const token = data.data?.token ?? data.token ?? data.access_token
        const user = data.data?.user ?? data.user

        if (token && user) {
          login({ ...user, token })

          toast.success("Login Successful!", {
            description: "Welcome back to Dr. Dental Care Center!",
          })

          // Respect ?redirect= param (e.g. coming from /book), then fall back to role-based route
          const redirectParam = searchParams.get("redirect")

          const userRole = user?.role?.toLowerCase?.() ?? ""
          const defaultPath = userRole === "admin" ? "/admin/dashboard" : "/"
          const redirectPath = redirectParam ?? defaultPath

          setTimeout(() => {
            router.push(redirectPath)
          }, 1000)
        } else {
          toast.error("Login Failed", {
            description:
              "Could not retrieve user information. Please try again.",
          })
        }
      } else {
        toast.error("Login Failed", {
          description: data.message || "Login failed. Please try again.",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Connection Error", {
        description:
          "Unable to login. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#F3F9EF] flex items-center justify-center px-4 py-10 sm:py-4 relative overflow-hidden">
        {/* Soft base wash so the grid/glow layers have room to read */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E4F0DE] via-[#F3F9EF] to-[#F3F9EF]" />

        {/* Background grid — mid-green lines, tuned for a light base */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(rgba(63,107,74,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(63,107,74,1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] bg-[#7FAE86]/30 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-60px] w-56 sm:w-72 h-56 sm:h-72 bg-[#A9CB9F]/35 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-[-80px] w-48 sm:w-64 h-48 sm:h-64 bg-[#CDE6C4]/40 blur-[100px] rounded-full pointer-events-none" />

        {/* Animated light particles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ y: "110%", opacity: 0, scale: 0.5 }}
              animate={{
                y: "-20%",
                opacity: [0, 0.18, 0.08, 0],
                scale: [0.5, 1.2, 0.8],
                x: [0, (i % 2 === 0 ? 1 : -1) * 30, 0],
              }}
              transition={{
                duration: 9 + i * 2,
                repeat: Infinity,
                delay: i * 1.4,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 rounded-full bg-[#7FAE86]/40 blur-3xl"
              style={{
                width: `${80 + i * 20}px`,
                height: `${80 + i * 20}px`,
                left: `${8 + i * 18}%`,
              }}
            />
          ))}
        </div>

        {/* Decorative cross marks */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 opacity-30 pointer-events-none hidden xs:block">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="32"
              stroke="#3F6B4A"
              strokeWidth="1.5"
            />
            <line
              x1="0"
              y1="16"
              x2="32"
              y2="16"
              stroke="#3F6B4A"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 opacity-30 pointer-events-none hidden xs:block">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="32"
              stroke="#3F6B4A"
              strokeWidth="1.5"
            />
            <line
              x1="0"
              y1="16"
              x2="32"
              y2="16"
              stroke="#3F6B4A"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-md z-10"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#7FAE86]/40 via-[#7FAE86]/10 to-transparent pointer-events-none" />

          <div className="relative bg-white/95 border border-[#DCEBD6] rounded-2xl p-6 sm:p-8 shadow-[0_32px_80px_rgba(63,107,74,0.16),0_0_0_1px_rgba(63,107,74,0.04)] backdrop-blur-xl">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[#5B6F60] hover:text-[#3F6B4A] transition-colors mb-5 sm:mb-6"
            >
              <ArrowLeftCircle className="w-5 h-5" />
              <span className="text-xs tracking-widest uppercase font-medium">
                Back
              </span>
            </button>

            <div className="text-center mb-7 sm:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3F6B4A]/10 to-[#7FAE86]/20 border border-[#3F6B4A]/15 mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 3C10.5 3 7 5.5 7 9c0 2 0.8 3.5 1.5 5 0.7 1.5 1 3 1.2 5.5 0.1 1.2 0.8 2.5 1.8 2.5 0.8 0 1.2-0.8 1.5-2 0.3-1.2 0.5-2 1-2s0.7 0.8 1 2c0.3 1.2 0.7 2 1.5 2 1 0 1.7-1.3 1.8-2.5 0.2-2.5 0.5-4 1.2-5.5C20.2 12.5 21 11 21 9c0-3.5-3.5-6-7-6Z"
                    stroke="#3F6B4A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <h1
                className="text-xl sm:text-2xl font-semibold text-[#1C2B21] tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Welcome Back
              </h1>
              <p className="text-[#3F6B4A] text-xs tracking-[0.2em] uppercase mt-1 font-medium">
                Dr. Dental Care Center
              </p>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#7FAE86] to-transparent mx-auto mt-3" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#5B6F60] uppercase tracking-widest font-medium flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#3F6B4A]" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="you@email.com"
                  className="w-full h-12 rounded-xl bg-[#F6FAF4] border border-[#DCEBD6] hover:border-[#B9D6AF] focus:border-[#3F6B4A] px-4 text-sm text-[#1C2B21] placeholder:text-[#8FA592] focus:outline-none focus:ring-2 focus:ring-[#7FAE86]/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#5B6F60] uppercase tracking-widest font-medium flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#3F6B4A]" /> Password
                  </label>
                  {/* <Link href="/forgot-password" className="text-[11px] text-[#3F6B4A] hover:text-[#2E5138] transition-colors tracking-wide">
                    Forgot password?
                  </Link> */}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your password"
                    className="w-full h-12 rounded-xl bg-[#F6FAF4] border border-[#DCEBD6] hover:border-[#B9D6AF] focus:border-[#3F6B4A] px-4 pr-11 text-sm text-[#1C2B21] placeholder:text-[#8FA592] focus:outline-none focus:ring-2 focus:ring-[#7FAE86]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8FA592] hover:text-[#3F6B4A] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full h-12 rounded-xl font-semibold text-sm tracking-wide overflow-hidden group disabled:opacity-60 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3F6B4A] to-[#5E8F68] group-hover:from-[#345A3E] group-hover:to-[#3F6B4A] transition-all duration-300" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.16) 50%, transparent 60%)",
                    }}
                  />
                  <span className="relative text-white drop-shadow-sm">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[#DCEBD6]" />
                <span className="text-[11px] text-[#8FA592] tracking-widest uppercase">
                  or
                </span>
                <div className="flex-1 h-px bg-[#DCEBD6]" />
              </div>

              <p className="text-center text-sm text-[#5B6F60]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#3F6B4A] hover:text-[#2E5138] font-medium transition-colors"
                >
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
      <Toaster theme="light" />
    </>
  )
}
