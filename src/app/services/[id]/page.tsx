"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Clock, Tag } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

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

export default function ServiceDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [service, setService] = useState<Service | null>(null)
  const [related, setRelated] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchService = async () => {
      setLoading(true)
      setFetchError(false)
      try {
        const res = await fetch(`/api/services/${id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Not found")
        const data = await res.json()

        // Handle both flat object and { data: {...} } shapes
        const s: RawService = data?.data ? data.data : data

        setService({
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
        })
      } catch (error) {
        console.error("Failed to fetch service:", error)
        setFetchError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  // Fetch related services once we know the current service's category
  useEffect(() => {
    if (!service) return

    const fetchRelated = async () => {
      setRelatedLoading(true)
      try {
        const res = await fetch("/api/services?per_page=100", {
          cache: "no-store",
        })
        const data = await res.json()

        const raw: RawService[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.data)
              ? data.data.data
              : []

        const formatted: Service[] = raw
          .filter((s) => s.category === service.category && s.id !== service.id)
          .map((s) => ({
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
          .slice(0, 3)

        setRelated(formatted)
      } catch (error) {
        console.error("Failed to fetch related services:", error)
      } finally {
        setRelatedLoading(false)
      }
    }

    fetchRelated()
  }, [service])

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

  if (fetchError || !service) {
    return (
      <div
        className="font-sans min-h-screen flex items-center justify-center"
        style={{ background: "#F0FDF4" }}
      >
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: "#94A3B8" }}>
            Service not found.
          </p>
          <Link href="/services">
            <button
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #047857, #059669)",
                color: "#fff",
              }}
            >
              <ArrowLeft size={14} /> Back to Services
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans">
      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #030F0A 0%, #07281B 60%, #0A4E2F 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <button
            onClick={() => router.push("/services")}
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: "#6EE7B7" }}
          >
            <ArrowLeft size={14} /> Back to Services
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block text-xs uppercase tracking-[0.3em] mb-4 px-3 py-1 rounded-full border"
              style={{
                color: "#6EE7B7",
                borderColor: "rgba(110,231,183,0.25)",
                background: "rgba(16,185,129,0.08)",
              }}
            >
              {service.category}
            </span>

            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{ color: "#ECFDF5" }}
            >
              {service.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16" style={{ background: "#F0FDF4" }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-10 items-start"
          >
            {/* Image */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid #D1FAE5",
                boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
              }}
            >
              <Image
                src={service.image}
                alt={service.title}
                width={600}
                height={450}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "/placeholder-service.jpg"
                }}
              />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: "#ECFDF5", color: "#10B981" }}
                >
                  <Clock size={12} /> {service.duration}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: "#ECFDF5", color: "#10B981" }}
                >
                  <Tag size={12} /> {service.category}
                </span>
              </div>

              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "#64748B" }}
              >
                {service.desc || "No description available for this treatment."}
              </p>

              {service.price > 0 && (
                <div className="mb-8">
                  <span
                    className="text-xs block mb-1"
                    style={{ color: "#94A3B8" }}
                  >
                    Starting at
                  </span>
                  <span
                    className="text-3xl font-serif"
                    style={{ color: "#047857" }}
                  >
                    ₱{Number(service.price).toLocaleString()}+
                  </span>
                </div>
              )}

              <Link
                href={`/book?service_id=${service.id}&service=${encodeURIComponent(service.title)}`}
              >
                <button
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #047857, #10B981)",
                    color: "#fff",
                    boxShadow: "0 4px 24px rgba(16,185,129,0.35)",
                  }}
                >
                  Book Now <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Related Services ── */}
      {(relatedLoading || related.length > 0) && (
        <section className="pb-24" style={{ background: "#F0FDF4" }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-2xl" style={{ color: "#0F172A" }}>
                Related Services
              </h2>
              <div className="flex-1 h-px" style={{ background: "#D1FAE5" }} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden animate-pulse"
                    style={{
                      background: "#fff",
                      border: "1px solid #D1FAE5",
                    }}
                  >
                    <div className="h-36 bg-emerald-100/60" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-emerald-100" />
                      <div className="h-3 w-full rounded bg-emerald-50" />
                    </div>
                  </div>
                ))}

              {!relatedLoading &&
                related.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35 }}
                  >
                    <Link href={`/services/${r.id}`} className="block h-full">
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
                        <div className="h-36 overflow-hidden relative">
                          <Image
                            src={r.image}
                            alt={r.title}
                            width={300}
                            height={144}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                "/placeholder-service.jpg"
                            }}
                          />
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3
                            className="font-serif text-base mb-2 leading-snug"
                            style={{ color: "#0F172A" }}
                          >
                            {r.title}
                          </h3>

                          <div className="flex items-center justify-between mt-auto pt-3">
                            <span
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                              style={{
                                background: "#ECFDF5",
                                color: "#10B981",
                              }}
                            >
                              <Clock size={10} />
                              {r.duration}
                            </span>
                            {r.price > 0 && (
                              <span
                                className="text-xs font-semibold"
                                style={{ color: "#047857" }}
                              >
                                ₱{Number(r.price).toLocaleString()}+
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
