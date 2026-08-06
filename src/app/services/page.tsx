"use client"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, X, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

interface Service {
  id: number
  title: string
  desc: string
  duration: string
  image: string
  status: string
  category: string
  price: number
}

interface RawService {
  id: number
  name: string
  description?: string
  duration?: string
  image?: string
  status: string
  category: string
  price: number
}

const ALL_TAB = "All"

export default function Services() {
  const [tab, setTab] = useState(ALL_TAB)
  const [search, setSearch] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setFetchError(false)
      try {
        const res = await fetch("/api/services?per_page=100", {
          cache: "no-store",
        })
        const data = await res.json()

        // Handle both flat array and paginated { data: [...] } shapes
        const raw: RawService[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.data)
              ? data.data.data
              : []

        const formattedServices: Service[] = raw.map((s) => ({
          id: s.id,
          title: s.name,
          desc: s.description || "",
          duration: s.duration || "Varies",
          image: s.image
            ? s.image.startsWith("http")
              ? s.image
              : `${process.env.NEXT_PUBLIC_API_URL}${s.image}`
            : "/placeholder-service.jpg",
          status: s.status,
          category: s.category || "Other",
          price: s.price,
        }))

        setServices(formattedServices)
      } catch (error) {
        console.error("Failed to fetch services:", error)
        setFetchError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Dynamic category list built from whatever the API returns
  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((s) => s.category))).sort(
      (a, b) => a.localeCompare(b),
    )
    return [ALL_TAB, ...unique]
  }, [services])

  const filteredItems = useMemo(() => {
    return services.filter((s) => {
      const matchesTab = tab === ALL_TAB || s.category === tab
      const matchesSearch =
        search === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [services, tab, search])

  // Group filtered items by category so "All" renders sectioned groups
  const groupedItems = useMemo(() => {
    const groups: Record<string, Service[]> = {}
    filteredItems.forEach((s) => {
      if (!groups[s.category]) groups[s.category] = []
      groups[s.category].push(s)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredItems])

  const handleTabChange = (val: string) => {
    setTab(val)
    setSearch("")
  }

  return (
    <div className="font-sans">
      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B2E24 0%, #114837 45%, #1B5E47 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          {/* Soft emerald glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-400/10 rounded-full blur-[140px]" />

          {/* Secondary glow */}
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-emerald-300/8 rounded-full blur-[120px]" />

          {/* Premium grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#A7F3D0"
                  strokeWidth="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Soft vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div {...fade}>
            <span
              className="inline-block text-xs uppercase tracking-[0.35em] mb-5 px-5 py-2 rounded-full border"
              style={{
                color: "#D6F5E6",
                borderColor: "rgba(214,245,230,0.18)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
              }}
            >
              Services
            </span>

            <h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
              style={{ color: "#F8FFFB" }}
            >
              The Aesthetic Index
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className="h-px w-20"
                style={{
                  background: "linear-gradient(to right, transparent, #D4AF37)",
                }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#D4AF37" }}
              />
              <div
                className="h-px w-20"
                style={{
                  background: "linear-gradient(to left, transparent, #D4AF37)",
                }}
              />
            </div>

            <p
              className="text-lg max-w-2xl mx-auto leading-8"
              style={{ color: "#CFE8DD" }}
            >
              Comprehensive dental and aesthetic services, each
              precision-engineered for measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter + Cards ── */}
      <section className="py-24" style={{ background: "#F0FDF4" }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "#94A3B8" }}
              size={15}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatments..."
              className="pl-10 pr-10 h-11 rounded-xl border text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500"
              style={{
                background: "#fff",
                borderColor: "#A7F3D0",
                boxShadow: "0 1px 4px rgba(16,185,129,0.08)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#94A3B8" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tabs — dynamic, built from API categories */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-wrap justify-center rounded-xl p-1 gap-1">
              {categories.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className="px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={
                    tab === t
                      ? {
                          background:
                            "linear-gradient(135deg, #047857, #059669)",
                          color: "#ffffff",
                          boxShadow: "0 2px 12px rgba(5,150,105,0.35)",
                        }
                      : {
                          background: "#ffff",
                          color: "#10B981",
                          boxShadow: "none",
                        }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-center text-sm mb-10" style={{ color: "#94A3B8" }}>
            {!loading &&
              `${filteredItems.length} treatment${filteredItems.length !== 1 ? "s" : ""} found`}
          </p>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{
                    background: "#fff",
                    border: "1px solid #D1FAE5",
                    boxShadow: "0 2px 12px rgba(16,185,129,0.06)",
                  }}
                >
                  <div className="h-48 bg-emerald-100/60" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-1/3 rounded bg-emerald-100" />
                    <div className="h-5 w-2/3 rounded bg-emerald-100" />
                    <div className="h-3 w-full rounded bg-emerald-50" />
                    <div className="h-3 w-4/5 rounded bg-emerald-50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && fetchError && (
            <div className="text-center py-20">
              <p className="text-lg mb-2" style={{ color: "#94A3B8" }}>
                Failed to load services.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm hover:underline"
                style={{ color: "#059669" }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !fetchError && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg mb-2" style={{ color: "#94A3B8" }}>
                No treatments found.
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-sm hover:underline"
                  style={{ color: "#059669" }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Grouped grid by category */}
          {!loading && !fetchError && filteredItems.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab + search}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-16"
              >
                {groupedItems.map(([category, categoryItems]) => (
                  <div key={category}>
                    {/* Only show a group header when viewing "All" categories */}
                    {tab === ALL_TAB && (
                      <div className="flex items-center gap-4 mb-8">
                        <h2
                          className="font-serif text-2xl"
                          style={{ color: "#0F172A" }}
                        >
                          {category}
                        </h2>
                        <div className="flex-1 h-px" />
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background: "#ECFDF5", color: "#10B981" }}
                        >
                          {categoryItems.length}
                        </span>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryItems.map((s) => (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          <Link
                            href={`/services/${s.id}`}
                            className="block h-full"
                          >
                            <div
                              className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer"
                              style={{
                                background: "#fff",
                                border: "1px solid #D1FAE5",
                                boxShadow: "0 2px 12px rgba(16,185,129,0.06)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 8px 32px rgba(5,150,105,0.16), 0 0 0 1px #6EE7B7"
                                e.currentTarget.style.borderColor = "#6EE7B7"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 2px 12px rgba(16,185,129,0.06)"
                                e.currentTarget.style.borderColor = "#D1FAE5"
                              }}
                            >
                              {/* Image */}
                              <div className="h-48 overflow-hidden relative">
                                <Image
                                  src={s.image}
                                  alt={s.title}
                                  width={400}
                                  height={192}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                      "/placeholder-service.jpg"
                                  }}
                                />
                                <div
                                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  style={{
                                    background:
                                      "linear-gradient(180deg, transparent 40%, rgba(4,120,87,0.18) 100%)",
                                  }}
                                />
                              </div>

                              {/* Body */}
                              <div className="p-6 flex flex-col flex-1">
                                <div
                                  className="w-8 h-0.5 rounded-full mb-3 transition-all duration-300 group-hover:w-14"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #059669, #34D399)",
                                  }}
                                />

                                <h3
                                  className="font-serif text-xl mb-2 leading-snug"
                                  style={{ color: "#0F172A" }}
                                >
                                  {s.title}
                                </h3>

                                <p
                                  className="text-sm leading-relaxed mb-4 flex-1"
                                  style={{ color: "#64748B" }}
                                >
                                  {s.desc}
                                </p>

                                <div className="flex items-center gap-3 mb-5">
                                  <span
                                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                                    style={{
                                      background: "#ECFDF5",
                                      color: "#10B981",
                                    }}
                                  >
                                    <Clock size={11} />
                                    {s.duration}
                                  </span>
                                  {s.price > 0 && (
                                    <span
                                      className="text-xs font-semibold"
                                      style={{ color: "#047857" }}
                                    >
                                      ₱{Number(s.price).toLocaleString()}+
                                    </span>
                                  )}
                                </div>

                                <div
                                  className="flex items-center justify-between pt-4"
                                  style={{ borderTop: "1px solid #ECFDF5" }}
                                >
                                  <span
                                    className="text-xs"
                                    style={{ color: "#94A3B8" }}
                                  >
                                    {s.category}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      router.push(
                                        `/book?service_id=${s.id}&service=${encodeURIComponent(s.title)}`,
                                      )
                                    }}
                                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #047857, #059669)",
                                      color: "#fff",
                                      boxShadow:
                                        "0 2px 8px rgba(5,150,105,0.25)",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow =
                                        "0 4px 16px rgba(5,150,105,0.45)"
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow =
                                        "0 2px 8px rgba(5,150,105,0.25)"
                                    }}
                                  >
                                    Book Now <ArrowRight size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #134E4A 0%, #166534 45%, #1F7A5A 100%)",
        }}
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          {/* Soft radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(110,231,183,0.12) 0%, transparent 65%)",
            }}
          />

          {/* Subtle vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.03), transparent 35%, rgba(0,0,0,0.18))",
            }}
          />

          {/* Ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-300/10 rounded-full blur-[120px]" />

          {/* Decorative particles */}
          <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-emerald-200/40" />
          <div className="absolute bottom-12 right-1/3 w-1.5 h-1.5 rounded-full bg-emerald-300/35" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-emerald-100/50" />

          {/* Premium grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="premium-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#BBF7D0"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#premium-grid)" />
          </svg>
        </div>

        <motion.div
          {...fade}
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          {/* Accent Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="h-px w-14"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(187,247,208,.9))",
              }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "#BBF7D0",
                boxShadow: "0 0 14px rgba(187,247,208,.55)",
              }}
            />
            <div
              className="h-px w-14"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(187,247,208,.9))",
              }}
            />
          </div>

          <h2
            className="font-serif text-3xl md:text-5xl font-light mb-5 tracking-tight"
            style={{ color: "#F8FFFB" }}
          >
            Not Sure Which Service Is Right?
          </h2>

          <p
            className="max-w-2xl mx-auto mb-10 text-lg leading-8"
            style={{ color: "#D8EDE4" }}
          >
            Our specialists will create a personalized treatment plan tailored
            to your smile, goals, and lifestyle during your private
            consultation.
          </p>

          <Link href="/book">
            <button
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1B5E47 0%, #2E8B68 100%)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 14px 36px rgba(21,128,61,.28), inset 0 1px 0 rgba(255,255,255,.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #16503C 0%, #25855F 100%)"
                e.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(21,128,61,.38), inset 0 1px 0 rgba(255,255,255,.16)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #1B5E47 0%, #2E8B68 100%)"
                e.currentTarget.style.boxShadow =
                  "0 14px 36px rgba(21,128,61,.28), inset 0 1px 0 rgba(255,255,255,.12)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Book Free Consultation
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
