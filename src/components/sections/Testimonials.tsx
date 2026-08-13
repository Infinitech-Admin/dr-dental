"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import testimonialsBg from "@/assets/testimonials-bg.png"
import { motion } from "framer-motion"
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

interface Testimonial {
  id: number
  client_name: string
  client_email: string
  rating: number
  message: string
  status: string
  created_at: string
}

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    message: "",
  })

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/testimonials?status=approved", {
          cache: "no-store",
        })
        const data = await res.json()
        // Laravel controller returns a plain array
        setTestimonials(Array.isArray(data) ? data : [])
      } catch {
        console.error("Failed to fetch testimonials")
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length || 1))
  const prev = () =>
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (testimonials.length || 1)) % (testimonials.length || 1),
    )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (name === "message") setCharCount(value.length)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isValid =
    formData.client_name.trim() &&
    formData.client_email.trim() &&
    formData.message.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Field names match Laravel controller validation rules exactly
        body: JSON.stringify({
          client_name: formData.client_name,
          client_email: formData.client_email,
          message: formData.message,
          rating,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      setSubmitted(true)
      setFormData({ client_name: "", client_email: "", message: "" })
      setRating(5)
      setCharCount(0)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const current = testimonials[currentIndex]

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* mesh gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 80% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 70% at 90% 20%, #CFF3D6 0%, transparent 60%), linear-gradient(165deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
        }}
      />
       <div className="absolute inset-0">
          <Image
            src={testimonialsBg}
            alt=""
            fill
            className="object-cover opacity-50"
          />
        </div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-24 w-[550px] h-[550px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(31,149,82,0.35), transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 -left-24 w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(167,232,107,0.35), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div {...fade} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] mb-4 px-4 py-1.5 rounded-full border border-[#1F9552]/25 bg-white/70 backdrop-blur-sm text-[#145C36] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F9552] to-[#A7E86B] animate-pulse" />
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            <span className="text-[#0B2E1C]">Stories From </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, #145C36 0%, #1F9552 40%, #4FC97B 70%, #A7E86B 100%)",
              }}
            >
              Our Patients
            </span>
          </h2>
          <p className="text-[#2E4E38]/80 text-lg">
            Real results from real people who transformed their smile and
            confidence.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT — Carousel */}
          <motion.div {...fade}>
            {loading && (
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-[#7BC67B]/30 animate-pulse shadow-lg shadow-[#1F9552]/5">
                  {/* Stars skeleton */}
                  <div className="flex gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded bg-[#DCEFD6]" />
                    ))}
                  </div>

                  {/* Quote skeleton */}
                  <div className="w-16 h-12 bg-[#7BC67B]/15 rounded mb-3" />

                  {/* Message skeleton */}
                  <div className="space-y-3 mb-8">
                    <div className="h-5 bg-[#DCEFD6] rounded w-full" />
                    <div className="h-5 bg-[#DCEFD6] rounded w-11/12" />
                    <div className="h-5 bg-[#DCEFD6] rounded w-3/4" />
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#DCEFD6] mb-6" />

                  {/* User info */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-[#DCEFD6] rounded" />
                      <div className="h-3 w-24 bg-[#E8F5E1] rounded" />
                    </div>

                    {/* Rating badge */}
                    <div className="h-8 w-16 rounded-full bg-[#7BC67B]/15" />
                  </div>
                </div>

                {/* Navigation skeleton */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="w-10 h-10 rounded-full bg-[#7BC67B]/15" />

                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full bg-[#DCEFD6] ${
                          i === 0 ? "w-8" : "w-2"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#7BC67B]/15" />
                </div>
              </div>
            )}

            {!loading && testimonials.length === 0 && (
              <div className="flex items-center justify-center py-20 rounded-2xl border border-[#C8E6C9] bg-white/60 backdrop-blur-sm text-[#4C6B4C] text-center px-8">
                No testimonials yet — be the first to share your experience!
              </div>
            )}

            {!loading && testimonials.length > 0 && current && (
              <div className="relative">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-white rounded-2xl p-8 md:p-10 border border-[#7BC67B]/30 overflow-hidden shadow-xl shadow-[#1F9552]/10"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                    }}
                  />

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < current.rating
                            ? "fill-[#1F9552] text-[#1F9552]"
                            : "text-[#C8E6C9]"
                        }
                      />
                    ))}
                  </div>

                  <p
                    className="text-6xl font-serif leading-none mb-2 bg-clip-text text-transparent opacity-70"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #1F9552, #A7E86B)",
                    }}
                  >
                    &ldquo;
                  </p>

                  <blockquote className="text-lg md:text-xl text-[#0B2E1C] mb-8 font-light leading-relaxed">
                    {current.message}
                  </blockquote>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#7BC67B]/50 to-transparent mb-6" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#0B2E1C] font-semibold">
                        {current.client_name}
                      </p>
                      <p className="text-[#4C6B4C] text-sm">
                        {new Date(current.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    {/* Rating badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white shadow-md"
                      style={{
                        backgroundImage:
                          "linear-gradient(120deg, #1F9552, #4FC97B)",
                        boxShadow: "0 6px 16px -6px rgba(31,149,82,0.6)",
                      }}
                    >
                      <Star size={14} className="fill-white text-white" />
                      <span className="text-sm font-semibold">
                        {current.rating}/5
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation */}
                {testimonials.length > 1 && (
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <button
                      onClick={prev}
                      className="p-3 rounded-full bg-white border border-[#7BC67B]/30 hover:border-[#1F9552] text-[#145C36] shadow-sm hover:shadow-md transition-all"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === currentIndex
                              ? "w-8"
                              : "bg-[#C8E6C9] hover:bg-[#A8D5A2] w-2"
                          }`}
                          style={
                            i === currentIndex
                              ? {
                                  backgroundImage:
                                    "linear-gradient(90deg, #1F9552, #4FC97B)",
                                }
                              : undefined
                          }
                          aria-label={`Go to ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={next}
                      className="p-3 rounded-full bg-white border border-[#7BC67B]/30 hover:border-[#1F9552] text-[#145C36] shadow-sm hover:shadow-md transition-all"
                      aria-label="Next"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                {/* Counter */}
                {testimonials.length > 1 && (
                  <p className="text-center text-[#4C6B4C] text-sm mt-3">
                    {currentIndex + 1} / {testimonials.length}
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-[#7BC67B]/25">
              {[
                { value: "98%", label: "Patient Satisfaction" },
                { value: "150K+", label: "Patients Treated" },
                { value: "6+", label: "Years of Excellence" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-3xl font-serif mb-1 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(120deg, #145C36, #4FC97B)",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[#4C6B4C] text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            {...fade}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <div
              className="absolute -inset-[2px] rounded-2xl opacity-60 blur-[2px]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #1F9552, #A7E86B, #145C36)",
              }}
            />
            <div className="relative bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-xl shadow-[#1F9552]/10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #1F9552, #4FC97B)",
                    }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[#0B2E1C] text-xl font-semibold">
                    Thank You!
                  </h3>
                  <p className="text-[#4C6B4C] text-sm max-w-xs">
                    Your testimonial has been received and will appear after our
                    team reviews it.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-[#0B2E1C] text-2xl font-serif mb-2">
                    Share Your Experience
                  </h3>
                  <p className="text-[#4C6B4C] text-sm mb-8">
                    Help others discover quality dental care by sharing your
                    story.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#0B2E1C] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="client_name"
                        value={formData.client_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Maria Santos"
                        className="w-full px-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-[#0B2E1C] placeholder-[#4C6B4C]/70 focus:outline-none focus:border-[#1F9552] focus:ring-2 focus:ring-[#1F9552]/25 transition text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#0B2E1C] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="client_email"
                        value={formData.client_email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-[#0B2E1C] placeholder-[#4C6B4C]/70 focus:outline-none focus:border-[#1F9552] focus:ring-2 focus:ring-[#1F9552]/25 transition text-sm"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-[#0B2E1C] mb-3">
                        Your Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              size={28}
                              className={
                                star <= (hoverRating || rating)
                                  ? "fill-[#1F9552] text-[#1F9552]"
                                  : "text-[#C8E6C9]"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[#0B2E1C]">
                          Your Experience
                        </label>
                        <span className="text-xs text-[#4C6B4C]">
                          {charCount}/500
                        </span>
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        maxLength={500}
                        placeholder="Tell us about your dental treatment — what procedure you had, how the team made you feel, and the results you experienced..."
                        className="w-full px-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-[#0B2E1C] placeholder-[#4C6B4C]/70 focus:outline-none focus:border-[#1F9552] focus:ring-2 focus:ring-[#1F9552]/25 transition resize-none text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting || !isValid}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 disabled:bg-[#DCEFD6] disabled:text-[#4C6B4C] text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 text-sm"
                      style={
                        submitting || !isValid
                          ? undefined
                          : {
                              backgroundImage:
                                "linear-gradient(120deg, #1F9552, #2FAE63, #4FC97B)",
                              boxShadow: "0 10px 28px -8px rgba(31,149,82,0.6)",
                            }
                      }
                    >
                      <Send size={16} />
                      {submitting ? "Submitting..." : "Submit Testimonial"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <section className="relative mt-24 overflow-hidden rounded-[2.5rem] max-w-7xl mx-auto">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(80% 120% at 0% 0%, rgba(79,201,123,0.28), transparent 60%), radial-gradient(80% 120% at 100% 100%, rgba(167,232,107,0.2), transparent 60%), linear-gradient(120deg, #0B3D26, #103F27 50%, #0B3D26)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[110px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.35), transparent 70%)",
          }}
        />
        <motion.div
          {...fade}
          className="relative max-w-3xl mx-auto px-6 py-24 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Ready to Transform{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(100deg, #A7E86B, #4FC97B)",
              }}
            >
              Your Smile?
            </span>
          </h2>
          <p className="text-[#B9D6C2] text-lg mb-10">
            Book your consultation today and take the first step toward clinical
            excellence.
          </p>
          <Link href="/book">
            <Button
              size="lg"
              className="text-white font-medium px-10 border-0 hover:-translate-y-0.5 transition-all duration-300"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #1F9552 0%, #2FAE63 55%, #4FC97B 100%)",
                boxShadow: "0 12px 32px -8px rgba(79,201,123,0.7)",
              }}
            >
              Book Your Appointment <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </motion.div>
      </section>
    </section>
  )
}
