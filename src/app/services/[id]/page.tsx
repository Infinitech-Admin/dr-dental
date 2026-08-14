"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Clock, Tag } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import servicesBg from "@/assets/services-bg.png"

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
            : "/placeholder-service.png",
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
              : "/placeholder-service.png",
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
      <div className="font-sans">
        {/* ── Hero Skeleton ── */}
        <section
          className="relative pt-32 pb-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #0B3D26 0%, #0E4A2D 45%, #0B3D26 100%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.12) 70%)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(79,201,123,0.28), transparent 70%)",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-6">
            <div
              className="h-4 w-32 rounded mb-8 animate-pulse"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
            <div
              className="h-6 w-28 rounded-full mb-4 animate-pulse"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />
            <div
              className="h-12 w-3/4 rounded mb-2 animate-pulse"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
            <div
              className="h-12 w-1/2 rounded animate-pulse"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          </div>
        </section>

        {/* ── Content Skeleton ── */}
        <section
          className="relative py-16 overflow-hidden"
          style={{
            background:
              "radial-gradient(100% 70% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 60% at 90% 100%, #CFF3D6 0%, transparent 55%), #F1FAEE",
          }}
        >
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Image skeleton */}
              <div
                className="rounded-2xl aspect-[4/3] animate-pulse"
                style={{ background: "rgba(79,201,123,0.15)" }}
              />

              {/* Info skeleton */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="h-7 w-24 rounded-full animate-pulse"
                    style={{ background: "rgba(79,201,123,0.15)" }}
                  />
                  <div
                    className="h-7 w-28 rounded-full animate-pulse"
                    style={{ background: "rgba(79,201,123,0.15)" }}
                  />
                </div>

                <div className="space-y-2.5 mb-8">
                  <div
                    className="h-3.5 w-full rounded animate-pulse"
                    style={{ background: "rgba(79,201,123,0.12)" }}
                  />
                  <div
                    className="h-3.5 w-full rounded animate-pulse"
                    style={{ background: "rgba(79,201,123,0.12)" }}
                  />
                  <div
                    className="h-3.5 w-2/3 rounded animate-pulse"
                    style={{ background: "rgba(79,201,123,0.12)" }}
                  />
                </div>

                <div className="mb-6">
                  <div
                    className="h-3 w-16 rounded mb-2 animate-pulse"
                    style={{ background: "rgba(79,201,123,0.12)" }}
                  />
                  <div
                    className="h-9 w-32 rounded animate-pulse"
                    style={{ background: "rgba(79,201,123,0.2)" }}
                  />
                  <div
                    className="h-3 w-48 rounded mt-3 animate-pulse"
                    style={{ background: "rgba(79,201,123,0.1)" }}
                  />
                </div>

                <div
                  className="h-3 w-40 rounded mb-6 animate-pulse"
                  style={{ background: "rgba(79,201,123,0.1)" }}
                />

                <div
                  className="h-12 w-40 rounded-xl animate-pulse"
                  style={{ background: "rgba(79,201,123,0.25)" }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (fetchError || !service) {
    return (
      <div
        className="font-sans min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(100% 70% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 60% at 90% 100%, #CFF3D6 0%, transparent 55%), #F1FAEE",
        }}
      >
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: "#4C6B4C" }}>
            Service not found.
          </p>
          <Link href="/services">
            <button
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg"
              style={{
                backgroundImage: "linear-gradient(135deg, #1F9552, #4FC97B)",
                color: "#fff",
                boxShadow: "0 6px 18px -4px rgba(31,149,82,0.4)",
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
            "linear-gradient(160deg, #0B3D26 0%, #0E4A2D 45%, #0B3D26 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.12) 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, rgba(79,201,123,0.28), transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <button
            onClick={() => router.push("/services")}
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
            style={{ color: "#A7E86B" }}
          >
            <ArrowLeft size={14} /> Back to Services
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-4 px-3 py-1 rounded-full border"
              style={{
                color: "#D6F5E6",
                borderColor: "rgba(167,232,107,0.25)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#1F9552] to-[#A7E86B]" />
              {service.category}
            </span>

            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{ color: "#F8FFFB" }}
            >
              {service.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section
        className="relative py-16 overflow-hidden"
        style={{
          background:
            "radial-gradient(100% 70% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 60% at 90% 100%, #CFF3D6 0%, transparent 55%), #F1FAEE",
        }}
      >
        <div
          className="absolute top-0 right-[10%] w-[350px] h-[350px] rounded-full blur-[120px] opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.28), transparent 70%)",
          }}
        />
        <div className="absolute inset-0">
          <Image
            src={servicesBg}
            alt=""
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-10 items-start"
          >
            {/* Image */}
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-[1.5rem] blur-md opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #1F9552, #A7E86B, #145C36)",
                }}
              />
              <div
                className="relative rounded-2xl overflow-hidden border-2 border-white"
                style={{ boxShadow: "0 12px 36px -10px rgba(11,61,38,0.3)" }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "/placeholder-service.png"
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: "rgba(31,149,82,0.1)",
                    color: "#145C36",
                  }}
                >
                  <Clock size={12} /> {service.duration}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: "rgba(31,149,82,0.1)",
                    color: "#145C36",
                  }}
                >
                  <Tag size={12} /> {service.category}
                </span>
              </div>

              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "#4C6B4C" }}
              >
                {service.desc || "No description available for this treatment."}
              </p>

              {service.price > 0 && (
                <div className="mb-6">
                  <span
                    className="text-xs block mb-1"
                    style={{ color: "#4C6B4C" }}
                  >
                    Starting at
                  </span>
                  <span
                    className="text-3xl font-serif bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #145C36, #1F9552, #4FC97B)",
                    }}
                  >
                    ₱{Number(service.price).toLocaleString()}
                  </span>
                  <p
                    className="text-xs mt-2 max-w-sm"
                    style={{ color: "#4C6B4C" }}
                  >
                    Final cost varies by case complexity and materials used.
                  </p>
                </div>
              )}

              <p className="text-xs mb-6 max-w-sm" style={{ color: "#4C6B4C" }}>
                Service availability may vary by branch.
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/book?service_id=${service.id}&service=${encodeURIComponent(service.title)}`,
                  )
                }
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #1F9552 0%, #2FAE63 55%, #4FC97B 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 28px -6px rgba(31,149,82,0.5)",
                }}
              >
                Book Now <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Related Services ── */}
      {(relatedLoading || related.length > 0) && (
        <section
          className="relative pb-24 overflow-hidden"
          style={{
            background:
              "radial-gradient(100% 70% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 60% at 90% 100%, #CFF3D6 0%, transparent 55%), #F1FAEE",
          }}
        >
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-2xl" style={{ color: "#0B2E1C" }}>
                Related Services
              </h2>
              <div className="flex-1 h-px" style={{ background: "#DCEFD6" }} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden animate-pulse"
                    style={{
                      background: "#fff",
                      border: "1px solid #DCEFD6",
                    }}
                  >
                    <div
                      className="h-36"
                      style={{ background: "rgba(79,201,123,0.15)" }}
                    />
                    <div className="p-5 space-y-2">
                      <div
                        className="h-4 w-2/3 rounded"
                        style={{ background: "rgba(79,201,123,0.2)" }}
                      />
                      <div
                        className="h-3 w-full rounded"
                        style={{ background: "rgba(79,201,123,0.1)" }}
                      />
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
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/services/${r.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        router.push(`/services/${r.id}`)
                      }
                    }}
                    className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                    style={{
                      background: "#fff",
                      border: "1px solid #DCEFD6",
                      boxShadow: "0 4px 16px -6px rgba(31,149,82,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 16px 36px -8px rgba(31,149,82,0.25), 0 0 0 1px #4FC97B"
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
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                      }}
                    />
                    <div className="h-36 overflow-hidden relative pointer-events-none">
                      <Image
                        src={r.image}
                        alt={r.title}
                        width={300}
                        height={144}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            "/placeholder-service.png"
                        }}
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1 pointer-events-none">
                      <h3
                        className="font-serif text-base mb-2 leading-snug"
                        style={{ color: "#0B2E1C" }}
                      >
                        {r.title}
                      </h3>

                      <div className="flex items-center justify-between mt-auto pt-3">
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            background: "rgba(31,149,82,0.1)",
                            color: "#145C36",
                          }}
                        >
                          <Clock size={10} />
                          {r.duration}
                        </span>
                        {r.price > 0 && (
                          <span
                            className="text-xs font-semibold bg-clip-text text-transparent"
                            style={{
                              backgroundImage:
                                "linear-gradient(100deg, #145C36, #1F9552)",
                            }}
                          >
                            ₱{Number(r.price).toLocaleString()}+
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
