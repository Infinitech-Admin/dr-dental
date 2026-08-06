"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    <section className="bg-gradient-to-br from-[#F1FAEE] to-[#E8F5E1] py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div {...fade} className="text-center mb-16">
          <span
            className="inline-block text-xs uppercase tracking-[0.35em] mb-4 px-4 py-1.5 rounded-full border"
            style={{
              color: "#2F5C2F",
              borderColor: "rgba(123,198,123,0.4)",
              background: "rgba(123,198,123,0.12)",
            }}
          >
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1F3A1F] mb-4">
            Stories From Our Patients
          </h2>
          <p className="text-[#4C6B4C] text-lg">
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
                <div className="bg-white rounded-2xl p-8 md:p-10 border border-[#7BC67B]/30 animate-pulse">
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
              <div className="flex items-center justify-center py-20 rounded-2xl border border-[#C8E6C9] text-[#4C6B4C] text-center px-8">
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
                  className="bg-white rounded-2xl p-8 md:p-10 border border-[#7BC67B]/30"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < current.rating
                            ? "fill-[#2F5C2F] text-[#2F5C2F]"
                            : "text-[#C8E6C9]"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-6xl text-[#7BC67B]/40 font-serif leading-none mb-2">
                    &ldquo;
                  </p>

                  <blockquote className="text-lg md:text-xl text-[#1F3A1F] mb-8 font-light leading-relaxed">
                    {current.message}
                  </blockquote>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#C8E6C9] to-transparent mb-6" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1F3A1F] font-semibold">
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
                    <div className="flex items-center gap-1.5 bg-[#7BC67B]/15 px-3 py-1.5 rounded-full">
                      <Star
                        size={14}
                        className="fill-[#2F5C2F] text-[#2F5C2F]"
                      />
                      <span className="text-[#2F5C2F] text-sm font-semibold">
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
                      className="p-3 rounded-full bg-[#7BC67B]/20 hover:bg-[#7BC67B]/30 text-[#2F5C2F] transition-all"
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
                              ? "bg-[#7BC67B] w-8"
                              : "bg-[#C8E6C9] hover:bg-[#A8D5A2] w-2"
                          }`}
                          aria-label={`Go to ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={next}
                      className="p-3 rounded-full bg-[#7BC67B]/20 hover:bg-[#7BC67B]/30 text-[#2F5C2F] transition-all"
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
            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-[#C8E6C9]">
              {[
                { value: "98%", label: "Patient Satisfaction" },
                { value: "5K+", label: "Patients Treated" },
                { value: "6+", label: "Years of Excellence" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-serif text-[#2F5C2F] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[#4C6B4C] text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div {...fade} transition={{ delay: 0.15 }}>
            <div className="bg-white/70 backdrop-blur-sm border border-[#C8E6C9] rounded-2xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#7BC67B]/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#2F5C2F]" />
                  </div>
                  <h3 className="text-[#1F3A1F] text-xl font-semibold">
                    Thank You!
                  </h3>
                  <p className="text-[#4C6B4C] text-sm max-w-xs">
                    Your testimonial has been received and will appear after our
                    team reviews it.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-[#1F3A1F] text-2xl font-serif mb-2">
                    Share Your Experience
                  </h3>
                  <p className="text-[#4C6B4C] text-sm mb-8">
                    Help others discover quality dental care by sharing your
                    story.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#1F3A1F] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="client_name"
                        value={formData.client_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Maria Santos"
                        className="w-full px-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-[#1F3A1F] placeholder-[#4C6B4C]/70 focus:outline-none focus:border-[#7BC67B] focus:ring-1 focus:ring-[#7BC67B]/50 transition text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#1F3A1F] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="client_email"
                        value={formData.client_email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-[#1F3A1F] placeholder-[#4C6B4C]/70 focus:outline-none focus:border-[#7BC67B] focus:ring-1 focus:ring-[#7BC67B]/50 transition text-sm"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-[#1F3A1F] mb-3">
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
                                  ? "fill-[#2F5C2F] text-[#2F5C2F]"
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
                        <label className="text-sm font-medium text-[#1F3A1F]">
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
                        className="w-full px-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-[#1F3A1F] placeholder-[#4C6B4C]/70 focus:outline-none focus:border-[#7BC67B] focus:ring-1 focus:ring-[#7BC67B]/50 transition resize-none text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting || !isValid}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#7BC67B] hover:bg-[#6BB86B] disabled:bg-[#DCEFD6] disabled:text-[#4C6B4C] text-[#1F3A1F] font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#7BC67B]/30 disabled:cursor-not-allowed text-sm"
                    >
                      <Send size={16} />
                      {submitting ? "Submitting..." : "Submit Testimonial"}
                    </button>

                    <p className="text-xs text-[#4C6B4C] text-center">
                      ✓ Reviewed by our team before publishing
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <section className="pt-24 relative overflow-hidden">
        <div className="absolute inset-0" />
        <motion.div
          {...fade}
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[#1F3A1F] mb-6">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-[#4C6B4C] text-lg mb-10">
            Book your consultation today and take the first step toward clinical
            excellence.
          </p>
          <Link href="/book">
            <Button
              size="lg"
              className="bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] font-medium px-10 hover:shadow-[0_0_20px_rgba(123,198,123,0.4)] transition-all"
            >
              Book Your Appointment <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </motion.div>
      </section>
    </section>
  )
}