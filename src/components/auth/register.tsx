"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowLeftCircle,
} from "lucide-react"

import { useRouter } from "next/navigation"
import Link from "next/link"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === "phone") {
      const numbersOnly = value.replace(/\D/g, "")

      setFormData((prev) => ({
        ...prev,
        [field]: numbersOnly,
      }))

      return
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      })

      return
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match. Please check and try again.",
      })

      return
    }

    if (formData.password.length < 8) {
      toast.error("Password Too Short", {
        description: "Password must be at least 8 characters long.",
      })

      return
    }

    // UPDATED: Phone validation — must be exactly 11 digits and start with "09"
    if (
      formData.phone &&
      (formData.phone.length !== 11 || !formData.phone.startsWith("09"))
    ) {
      toast.error("Invalid Phone Number", {
        description:
          "Phone number must be exactly 11 digits and start with 09.",
      })

      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Registration Successful!", {
          description: "You can login now.",
        })

        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        toast.error("Registration Failed", {
          description: data.message || "Registration failed. Please try again.",
        })
      }
    } catch {
      toast.error("Connection Error", {
        description: "Unable to register. Please check your connection.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#F3F9EF] flex items-center justify-center px-4 py-10 relative overflow-hidden">
        {/* Soft base wash so the grid/glow layers have room to read */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E4F0DE] via-[#F3F9EF] to-[#F3F9EF]" />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(63,107,74,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(63,107,74,1) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* GLOWS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#7FAE86]/30 blur-[120px] rounded-full" />

        <div className="absolute bottom-[-80px] left-[-60px] w-72 h-72 bg-[#A9CB9F]/35 blur-[100px] rounded-full" />

        <div className="absolute top-1/3 right-[-80px] w-64 h-64 bg-[#CDE6C4]/40 blur-[100px] rounded-full" />

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-2xl z-10"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#7FAE86]/40 via-[#7FAE86]/10 to-transparent" />

          <div
            className="relative bg-white/95 border border-[#DCEBD6]
                       rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_32px_80px_rgba(63,107,74,0.16),0_0_0_1px_rgba(63,107,74,0.04)]"
          >
            {/* BACK */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[#5B6F60] hover:text-[#3F6B4A] mb-6"
            >
              <ArrowLeftCircle className="w-5 h-5" />

              <span className="text-xs uppercase tracking-widest">Back</span>
            </button>

            {/* HEADER */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3F6B4A]/10 to-[#7FAE86]/20 border border-[#3F6B4A]/15 mb-4">
                <User className="text-[#3F6B4A]" />
              </div>

              <h1 className="text-2xl font-semibold text-[#1C2B21]">
                Create Account
              </h1>

              <p className="text-[#3F6B4A] text-xs uppercase tracking-[0.2em] mt-1">
                Dr. Dental Care Center
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  icon={User}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                />

                <Field
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="you@email.com"
                />

                <div className="md:col-span-2">
                  <PhoneField
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-[#5B6F60] flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#3F6B4A]" />
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Min. 8 characters"
                      className="w-full h-12 rounded-xl bg-[#F6FAF4] border border-[#DCEBD6]
                                 px-4 pr-10 text-[#1C2B21] placeholder:text-[#8FA592]
                                 hover:border-[#B9D6AF] focus:outline-none focus:ring-2 focus:ring-[#7FAE86]/20
                                 focus:border-[#3F6B4A] transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA592] hover:text-[#3F6B4A] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-[#5B6F60] flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#3F6B4A]" />
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.password_confirmation}
                      onChange={(e) =>
                        handleInputChange(
                          "password_confirmation",
                          e.target.value,
                        )
                      }
                      placeholder="Repeat your password"
                      className="w-full h-12 rounded-xl bg-[#F6FAF4] border border-[#DCEBD6]
                                 px-4 pr-10 text-[#1C2B21] placeholder:text-[#8FA592]
                                 hover:border-[#B9D6AF] focus:outline-none focus:ring-2 focus:ring-[#7FAE86]/20
                                 focus:border-[#3F6B4A] transition"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA592] hover:text-[#3F6B4A] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
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
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>
              </button>

              {/* FOOTER */}
              <p className="text-center text-sm text-[#5B6F60]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#3F6B4A] hover:text-[#2E5138] font-medium transition-colors"
                >
                  Sign in
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

// ─── Reusable Field ───────────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string
  icon: React.ElementType
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-widest text-[#5B6F60] flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-[#3F6B4A]" />
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-12 rounded-xl bg-[#F6FAF4] border border-[#DCEBD6]
                   px-4 text-[#1C2B21] placeholder:text-[#8FA592]
                   hover:border-[#B9D6AF] focus:outline-none focus:ring-2 focus:ring-[#7FAE86]/20
                   focus:border-[#3F6B4A] transition"
      />
    </div>
  )
}

// ─── Phone Field with inline validation ──────────────────────────────────────

function PhoneField({
  value,
  onChange,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  // Derive validation state from the current value
  const getValidationState = () => {
    if (value.length === 0) return null
    if (!value.startsWith("09"))
      return { ok: false, message: "Phone number must start with 09." }
    if (value.length < 11)
      return {
        ok: false,
        message: `${value.length}/11 digits — must be exactly 11.`,
      }
    return { ok: true, message: "Valid phone number" }
  }

  const validation = getValidationState()

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-widest text-[#5B6F60] flex items-center gap-2">
        <Phone className="w-3.5 h-3.5 text-[#3F6B4A]" />
        Phone Number
      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="09123456789"
        maxLength={11}
        className={`w-full h-12 rounded-xl bg-[#F6FAF4] border
                   px-4 text-[#1C2B21] placeholder:text-[#8FA592]
                   focus:outline-none focus:ring-2 focus:ring-[#7FAE86]/20
                   focus:border-[#3F6B4A] transition
                   ${
                     validation === null
                       ? "border-[#DCEBD6] hover:border-[#B9D6AF]"
                       : validation.ok
                         ? "border-[#3F6B4A]/60"
                         : "border-red-400/70"
                   }`}
      />

      {validation !== null && (
        <p
          className={`text-[11px] ${
            validation.ok ? "text-[#3F6B4A]" : "text-red-500"
          }`}
        >
          {validation.ok ? "✓ " : ""}
          {validation.message}
        </p>
      )}
    </div>
  )
}
