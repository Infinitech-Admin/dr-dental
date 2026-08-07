"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Stethoscope,
  Pin,
} from "lucide-react"
import Header from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

// ── Bold mid-green token system (matches Book & About pages) ──────────────
const GREEN_DEEP = "#0E7A3F"
const GREEN_MID = "#189A4D"
const GREEN_BRIGHT = "#2FBD63"
const GREEN_LIME = "#5CD97A"

const PAGE_BG =
  "linear-gradient(160deg, #EAFBF0 0%, #CFF2DC 35%, #B7ECC4 70%, #DBF5E4 100%)"
const HEADER_GLOW =
  "radial-gradient(ellipse 65% 55% at 15% 0%, rgba(47,189,99,0.2) 0%, transparent 60%)"
const ACCENT_GRADIENT = `linear-gradient(135deg, ${GREEN_MID} 0%, ${GREEN_BRIGHT} 55%, ${GREEN_LIME} 100%)`
const ACCENT_GRADIENT_HOVER = `linear-gradient(135deg, ${GREEN_DEEP} 0%, ${GREEN_MID} 55%, ${GREEN_BRIGHT} 100%)`
const AVATAR_GRADIENT = `linear-gradient(145deg, ${GREEN_DEEP} 0%, ${GREEN_MID} 50%, ${GREEN_BRIGHT} 100%)`
const GLOW = "0 0 18px rgba(47,189,99,0.4)"
const GLOW_SOFT = "0 0 15px rgba(47,189,99,0.22)"

type Booking = {
  id: string
  user_id?: string
  service_id?: string
  service?: { id: string; name: string } | null
  booking_date: string
  branch: string | null
  status: "pending" | "confirmed" | "cancelled"
  notes?: string | null
  name: string
  email: string
  phone?: string | null
}

const statusColors: Record<string, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  confirmed: "border-[#2FBD63]/50 bg-[#EAFBF0] text-[#0E7A3F]",
  cancelled: "border-red-300 bg-red-50 text-red-700",
}

function parseDate(booking: Booking): string {
  const raw = booking.booking_date || ""
  if (!raw) return "—"
  const datePart = raw.split(/[ T]/)[0]
  const d = new Date(datePart + "T00:00:00")
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function parseTime(booking: Booking): string {
  const raw = booking.booking_date || ""
  const parts = raw.split(/[ T]/)
  const timePart = parts[1] ?? ""
  if (!timePart) return "—"

  const [h, m] = timePart.split(":").map(Number)
  if (isNaN(h) || isNaN(m)) return "—"
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
}

function parseService(booking: Booking): string {
  return booking.service?.name || "Appointment"
}

export default function ProfilePage() {
  const router = useRouter()
  const { isLoggedIn, user, token } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.replace("/login?redirect=/profile")
    }
  }, [isLoggedIn, token, router])

  useEffect(() => {
    if (!token) return
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load bookings.")
        const list = data.bookings ?? data.data ?? data ?? []
        setBookings(Array.isArray(list) ? list : [])
      } catch (err: unknown) {
        // FIX: Use `unknown` instead of `any` and narrow with instanceof before
        // accessing `.message`, which is the correct TS-safe pattern for caught errors.
        setError(
          err instanceof Error ? err.message : "Could not load your bookings.",
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [token])

  if (!isLoggedIn || !token) return null

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: PAGE_BG }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: HEADER_GLOW }} />
      <div className="pointer-events-none absolute top-32 -right-28 w-[420px] h-[420px] bg-emerald-300/25 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 -left-24 w-[380px] h-[380px] bg-lime-300/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-green-300/15 rounded-full blur-[110px]" />

      <Header />

      <main className="relative flex-1 max-w-5xl mx-auto w-full px-6 pt-28 pb-20">
        <motion.div {...fade} className="mb-10">
          <p
            className="text-sm uppercase tracking-[0.3em] mb-3 font-semibold inline-block"
            style={{
              background: ACCENT_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Account
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#0E3B22]">
            My Profile
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <motion.div
            {...fade}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card
              className="p-6 bg-white/85 backdrop-blur-sm relative overflow-hidden"
              style={{ border: "1px solid #B7ECC4", boxShadow: GLOW_SOFT }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: ACCENT_GRADIENT }}
              />
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-serif mb-5 mt-1"
                style={{ background: AVATAR_GRADIENT, boxShadow: GLOW }}
              >
                {typeof user?.name === "string"
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <h2 className="text-[#0E3B22] text-xl font-medium mb-1">
                {typeof user?.name === "string" ? user.name : ""}
              </h2>
              <p className="text-[#0E7A3F] text-sm mb-6">Patient Account</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-[#2F6B45]">
                  <User size={14} className="text-[#2FBD63] shrink-0" />
                  <span className="truncate">
                    {typeof user?.name === "string" ? user.name : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#2F6B45]">
                  <Mail size={14} className="text-[#2FBD63] shrink-0" />
                  <span className="truncate">
                    {typeof user?.email === "string" ? user.email : ""}
                  </span>
                </div>
                {typeof user?.phone === "string" && user.phone && (
                  <div className="flex items-center gap-3 text-[#2F6B45]">
                    <Phone size={14} className="text-[#2FBD63] shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Bookings */}
          <motion.div
            {...fade}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-[#0E3B22] font-medium text-lg mb-4 flex items-center gap-2">
              <Stethoscope size={16} className="text-[#2FBD63]" />
              My Appointments
            </h3>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl animate-pulse"
                    style={{ background: "rgba(255,255,255,0.4)" }}
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {!loading && !error && bookings.length === 0 && (
              <Card
                className="p-10 bg-white/85 text-center relative overflow-hidden"
                style={{ border: "1px solid #B7ECC4", boxShadow: GLOW_SOFT }}
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: ACCENT_GRADIENT, boxShadow: GLOW }}
                >
                  <Calendar size={26} className="text-white" />
                </div>
                <p className="text-[#5C8F6D] text-sm">No appointments yet.</p>
                <button
                  onClick={() => router.push("/book")}
                  className="mt-5 px-6 py-2.5 text-white text-sm font-medium rounded-full transition-all"
                  style={{ background: ACCENT_GRADIENT, boxShadow: GLOW }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT_GRADIENT_HOVER
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ACCENT_GRADIENT
                  }}
                >
                  Book Now
                </button>
              </Card>
            )}

            {!loading &&
              bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Card
                    className="p-5 bg-white/85 transition-all relative overflow-hidden group"
                    style={{ border: "1px solid #B7ECC4" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = GLOW_SOFT
                      e.currentTarget.style.borderColor = "rgba(47,189,99,0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = "#B7ECC4"
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ background: ACCENT_GRADIENT }}
                    />
                    <div className="flex items-start justify-between gap-4 pl-2">
                      <div className="space-y-1.5">
                        <p className="text-[#0E3B22] font-medium">
                          {parseService(b)}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[#2F6B45] text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} className="text-[#2FBD63]" />
                            {parseDate(b)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} className="text-[#2FBD63]" />
                            {parseTime(b)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Pin size={11} className="text-[#2FBD63]" />
                            {b.branch}
                          </span>
                        </div>
                        {b.notes && (
                          <p className="text-[#0E7A3F] text-xs line-clamp-2 max-w-md">
                            {b.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${statusColors[b.status] ?? "border-[#B7ECC4] text-[#2F6B45]"}`}
                        >
                          {b.status ?? "unknown"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}