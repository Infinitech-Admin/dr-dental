"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Wrench,
  AlignCenter,
  Scissors,
  Shield,
  Activity,
  Stethoscope,
  Baby,
  Ear,
  CalendarCheck,
  FolderOpen,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// ---------- TYPES ----------

type Service = {
  id: number | string
  name: string
  description: string
  category: string
  price: number | string | null
  status?: string
  image?: string | null
}

type Category = {
  id?: number | string
  name: string
  description: string
  icon: React.ElementType
  image: string
}

// Map category names or fallback keys to Lucide icons
const ICON_MAP: Record<string, React.ElementType> = {
  "General Dentistry": Stethoscope,
  "Cosmetic Dentistry": Sparkles,
  "Restorative Dentistry": Wrench,
  Orthodontics: AlignCenter,
  "Wisdom Tooth Removal": Scissors,
  "Dental Implants": Shield,
  "Root Canal Treatment": Activity,
  "Oral Surgery": Scissors,
  "Pediatric Dentistry": Baby,
  "TMJ Treatment": Ear,
}

// ---------- IMAGE HELPER ----------

const getImageUrl = (imagePath: unknown): string => {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    return "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath
  }

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  return `${API_BASE_URL}/${imagePath.replace(/^\/+/, "")}`
}

// ---------- COMPONENT ----------

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(
    null,
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------- FETCH CATEGORIES & SERVICES ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Fetch Categories
        const catResponse = await fetch("/api/service-categories", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        })

        if (!catResponse.ok) {
          throw new Error(`Failed to fetch categories (${catResponse.status})`)
        }

        const catData = await catResponse.json()
        const rawCategories = Array.isArray(catData)
          ? catData
          : catData.data || []

        const mappedCategories: Category[] = rawCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "",
          image: getImageUrl(cat.image),
          icon: ICON_MAP[cat.name] || FolderOpen,
        }))

        setCategories(mappedCategories)

        // 2. Fetch Services (with pagination handling)
        const allServices: Service[] = []
        let page = 1
        let lastPage = 1

        do {
          const response = await fetch(`/api/services?page=${page}`, {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch services (${response.status})`)
          }

          const data = await response.json()

          if (!Array.isArray(data.data)) {
            throw new Error("Invalid services response")
          }

          const pageServices: Service[] = data.data.map((service: any) => ({
            id: Number(service.id),
            name: service.name,
            description: service.description,
            category: service.category,
            price:
              service.price === null || service.price === undefined
                ? null
                : Number(service.price),
            status: service.status,
            image: service.image ?? null,
          }))

          allServices.push(...pageServices)
          lastPage = Number(data.last_page) || 1
          page++
        } while (page <= lastPage)

        setServices(allServices)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load data. Please try again.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ---------- GROUP SERVICES BY CATEGORY ----------

  const servicesByCategory = services.reduce<Record<string, Service[]>>(
    (groups, service) => {
      const category = String(service.category || "").trim()

      if (!category) return groups

      if (!groups[category]) {
        groups[category] = []
      }

      groups[category].push(service)
      return groups
    },
    {},
  )

  // Filter categories that actually have services available
  const activeCategories = categories.filter((cat) => {
    return (servicesByCategory[cat.name]?.length ?? 0) > 0
  })

  // ---------- ACTIVE DETAILS ----------

  const activeCategoryObject = activeCategoryName
    ? categories.find((c) => c.name === activeCategoryName)
    : null

  const activeServices = activeCategoryName
    ? servicesByCategory[activeCategoryName] || []
    : []

  // ---------- PRICE FORMATTER ----------

  const formatPrice = (price: number | string | null) => {
    if (price === null || price === undefined || price === "") {
      return "Price upon consultation"
    }

    const numericPrice = Number(price)

    if (Number.isNaN(numericPrice)) {
      return "Price upon consultation"
    }

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice)
  }

  return (
    <section className="relative min-h-screen bg-[#03110a] overflow-hidden px-4 sm:px-8 py-20 sm:py-32 md:px-16">
      {/* Ambient mesh glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-emerald-500/10 blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full bg-green-400/10 blur-[80px] sm:blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-24 text-center"
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-emerald-400">
            Our Services
          </span>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Comprehensive Dental <span className="text-emerald-400">Care</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-white/50 max-w-xl mx-auto px-2 leading-relaxed">
            Explore our full range of treatments across every branch — tap a
            category to see what&apos;s included.
          </p>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
            <p className="mt-4 text-xs text-white/40">
              Loading dental services...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mx-auto max-w-lg rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && services.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-white/50">
              No dental services are currently available.
            </p>
          </div>
        )}

        {/* CATEGORY GRID */}
        {!loading && !error && activeCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeCategories.map((cat, i) => {
              const Icon = cat.icon
              const categoryServices = servicesByCategory[cat.name] || []

              return (
                <motion.button
                  key={cat.name}
                  onClick={() => setActiveCategoryName(cat.name)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative text-left rounded-2xl border border-emerald-500/20 bg-white/[0.02] backdrop-blur-sm transition-all hover:border-emerald-400/50 hover:bg-emerald-500/[0.04] overflow-hidden w-full cursor-pointer flex flex-col shadow-lg"
                >
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#020b07]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      unoptimized={cat.image.startsWith("http")}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03110a] via-transparent to-transparent opacity-90" />

                    <div className="absolute top-4 left-4 z-10 flex items-center justify-center h-10 w-10 rounded-xl bg-[#03110a]/80 backdrop-blur-md border border-emerald-500/30 shadow-md">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center text-xs text-emerald-400 font-medium">
                      {categoryServices.length}{" "}
                      {categoryServices.length === 1 ? "service" : "services"}
                      <span className="ml-1 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog
        open={!!activeCategoryName}
        onOpenChange={(open) => {
          if (!open) {
            setActiveCategoryName(null)
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] bg-[#04140c] border border-emerald-500/30 p-0 overflow-hidden rounded-2xl flex flex-col">
          <AnimatePresence>
            {activeCategoryObject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex flex-col h-full overflow-hidden"
              >
                <div className="relative border-b border-emerald-500/20 shrink-0 overflow-hidden">
                  <div className="relative w-full h-40 sm:h-48">
                    <Image
                      src={activeCategoryObject.image}
                      alt={activeCategoryObject.name}
                      fill
                      unoptimized={activeCategoryObject.image.startsWith(
                        "http",
                      )}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04140c] via-[#04140c]/70 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex items-end gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 shadow-lg">
                      {(() => {
                        const Icon = activeCategoryObject.icon
                        return <Icon className="h-6 w-6 text-emerald-300" />
                      })()}
                    </div>

                    <div className="min-w-0 pr-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-white truncate drop-shadow-sm">
                        {activeCategoryObject.name}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                        {activeCategoryObject.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {activeServices.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] transition-colors"
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white">
                              {service.name}
                            </h4>
                            <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="mt-4">
                              <span className="text-sm font-semibold text-emerald-400">
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/book?service_id=${encodeURIComponent(
                          String(service.id),
                        )}&service=${encodeURIComponent(service.name)}`}
                        onClick={() => setActiveCategoryName(null)}
                        className="mt-5 self-start inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors whitespace-nowrap"
                      >
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Book Now
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  )
}
