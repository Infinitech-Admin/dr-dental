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
        className="relative pt-32 pb-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0B3D26 0%, #0E4A2D 45%, #0B3D26 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          {/* mid-green mesh glows */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[560px] rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.12) 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(79,201,123,0.32), transparent 70%)" }}
          />
          <div
            className="absolute top-1/3 left-0 w-[320px] h-[320px] rounded-full blur-[110px]"
            style={{ background: "radial-gradient(circle, rgba(167,232,107,0.22), transparent 70%)" }}
          />

          {/* Premium grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.05]"
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
                  stroke="#A7E86B"
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
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] mb-5 px-5 py-2 rounded-full border"
              style={{
                color: "#D6F5E6",
                borderColor: "rgba(167,232,107,0.22)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F9552] to-[#A7E86B] animate-pulse" />
              Services
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              <span style={{ color: "#F8FFFB" }}>The Aesthetic </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, #A7E86B 0%, #4FC97B 50%, #1F9552 100%)",
                }}
              >
                Index
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className="h-px w-20"
                style={{
                  background: "linear-gradient(to right, transparent, #A7E86B)",
                }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundImage: "linear-gradient(135deg, #1F9552, #A7E86B)",
                  boxShadow: "0 0 14px rgba(167,232,107,0.6)",
                }}
              />
              <div
                className="h-px w-20"
                style={{
                  background: "linear-gradient(to left, transparent, #A7E86B)",
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
      <section className="relative py-24 overflow-hidden">
        {/* light mesh base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 70% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 60% at 90% 100%, #CFF3D6 0%, transparent 55%), #F1FAEE",
          }}
        />
        <div
          className="absolute top-0 right-[10%] w-[400px] h-[400px] rounded-full blur-[130px] opacity-60 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(79,201,123,0.3), transparent 70%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "#4C6B4C" }}
              size={15}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatments..."
              className="pl-10 pr-10 h-11 rounded-xl border text-[#0B2E1C] placeholder:text-[#4C6B4C]/60 focus-visible:ring-[#1F9552]"
              style={{
                background: "#fff",
                borderColor: "#C8E6C9",
                boxShadow: "0 4px 16px -6px rgba(31,149,82,0.15)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-[#145C36]"
                style={{ color: "#4C6B4C" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tabs — dynamic, built from API categories */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex flex-wrap justify-center rounded-xl p-1 gap-1 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #DCEFD6" }}
            >
              {categories.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className="px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={
                    tab === t
                      ? {
                          backgroundImage:
                            "linear-gradient(135deg, #1F9552, #4FC97B)",
                          color: "#ffffff",
                          boxShadow: "0 6px 18px -4px rgba(31,149,82,0.5)",
                        }
                      : {
                          background: "transparent",
                          color: "#1F9552",
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
          <p className="text-center text-sm mb-10" style={{ color: "#4C6B4C" }}>
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
                    border: "1px solid #DCEFD6",
                    boxShadow: "0 2px 12px rgba(31,149,82,0.06)",
                  }}
                >
                  <div className="h-48" style={{ background: "rgba(79,201,123,0.15)" }} />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-1/3 rounded" style={{ background: "rgba(79,201,123,0.2)" }} />
                    <div className="h-5 w-2/3 rounded" style={{ background: "rgba(79,201,123,0.2)" }} />
                    <div className="h-3 w-full rounded" style={{ background: "rgba(79,201,123,0.1)" }} />
                    <div className="h-3 w-4/5 rounded" style={{ background: "rgba(79,201,123,0.1)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && fetchError && (
            <div className="text-center py-20">
              <p className="text-lg mb-2" style={{ color: "#4C6B4C" }}>
                Failed to load services.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm hover:underline"
                style={{ color: "#1F9552" }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !fetchError && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg mb-2" style={{ color: "#4C6B4C" }}>
                No treatments found.
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-sm hover:underline"
                  style={{ color: "#1F9552" }}
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
                          style={{ color: "#0B2E1C" }}
                        >
                          {category}
                        </h2>
                        <div className="flex-1 h-px" style={{ background: "#DCEFD6" }} />
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "rgba(31,149,82,0.1)", color: "#145C36" }}
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
                              className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                              style={{
                                background: "#fff",
                                border: "1px solid #DCEFD6",
                                boxShadow: "0 4px 16px -6px rgba(31,149,82,0.1)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 16px 40px -8px rgba(31,149,82,0.25), 0 0 0 1px #4FC97B"
                                e.currentTarget.style.borderColor = "#4FC97B"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 4px 16px -6px rgba(31,149,82,0.1)"
                                e.currentTarget.style.borderColor = "#DCEFD6"
                              }}
                            >
                              <div
                                className="absolute top-0 left-0 right-0 h-1 z-10"
                                style={{ backgroundImage: "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)" }}
                              />

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
                                      "linear-gradient(180deg, transparent 40%, rgba(11,61,38,0.35) 100%)",
                                  }}
                                />
                              </div>

                              {/* Body */}
                              <div className="p-6 flex flex-col flex-1">
                                <div
                                  className="w-8 h-0.5 rounded-full mb-3 transition-all duration-300 group-hover:w-14"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(to right, #1F9552, #A7E86B)",
                                  }}
                                />

                                <h3
                                  className="font-serif text-xl mb-2 leading-snug"
                                  style={{ color: "#0B2E1C" }}
                                >
                                  {s.title}
                                </h3>

                                <p
                                  className="text-sm leading-relaxed mb-4 flex-1"
                                  style={{ color: "#4C6B4C" }}
                                >
                                  {s.desc}
                                </p>

                                <div className="flex items-center gap-3 mb-5">
                                  <span
                                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                                    style={{
                                      background: "rgba(31,149,82,0.1)",
                                      color: "#145C36",
                                    }}
                                  >
                                    <Clock size={11} />
                                    {s.duration}
                                  </span>
                                  {s.price > 0 && (
                                    <span
                                      className="text-xs font-semibold bg-clip-text text-transparent"
                                      style={{ backgroundImage: "linear-gradient(100deg, #145C36, #1F9552)" }}
                                    >
                                      ₱{Number(s.price).toLocaleString()}+
                                    </span>
                                  )}
                                </div>

                                <div
                                  className="flex items-center justify-between pt-4"
                                  style={{ borderTop: "1px solid #DCEFD6" }}
                                >
                                  <span
                                    className="text-xs"
                                    style={{ color: "#4C6B4C" }}
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
                                      backgroundImage:
                                        "linear-gradient(135deg, #1F9552, #4FC97B)",
                                      color: "#fff",
                                      boxShadow:
                                        "0 4px 14px -3px rgba(31,149,82,0.4)",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow =
                                        "0 8px 22px -4px rgba(31,149,82,0.6)"
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow =
                                        "0 4px 14px -3px rgba(31,149,82,0.4)"
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
            "linear-gradient(150deg, #0B3D26 0%, #145C36 45%, #0E4A2D 100%)",
        }}
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          {/* Soft radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(79,201,123,0.18) 0%, transparent 65%)",
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
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(167,232,107,0.18), transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-[10%] w-[380px] h-[380px] rounded-full blur-[110px]"
            style={{ background: "radial-gradient(circle, rgba(79,201,123,0.22), transparent 70%)" }}
          />

          {/* Decorative particles */}
          <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full" style={{ background: "rgba(167,232,107,0.5)" }} />
          <div className="absolute bottom-12 right-1/3 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(79,201,123,0.45)" }} />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full" style={{ background: "rgba(207,243,214,0.6)" }} />

          {/* Premium grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.05]"
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
                  stroke="#A7E86B"
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
                  "linear-gradient(to right, transparent, rgba(167,232,107,.9))",
              }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundImage: "linear-gradient(135deg, #1F9552, #A7E86B)",
                boxShadow: "0 0 14px rgba(167,232,107,.6)",
              }}
            />
            <div
              className="h-px w-14"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(167,232,107,.9))",
              }}
            />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light mb-5 tracking-tight">
            <span style={{ color: "#F8FFFB" }}>Not Sure Which Service Is </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(100deg, #A7E86B, #4FC97B)" }}
            >
              Right?
            </span>
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
                backgroundImage: "linear-gradient(135deg, #1F9552 0%, #2FAE63 55%, #4FC97B 100%)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 14px 36px rgba(31,149,82,.4), inset 0 1px 0 rgba(255,255,255,.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(79,201,123,.55), inset 0 1px 0 rgba(255,255,255,.16)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 14px 36px rgba(31,149,82,.4), inset 0 1px 0 rgba(255,255,255,.12)"
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