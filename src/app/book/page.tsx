"use client"
import { useState, useEffect, useMemo, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
  MapPin,
  LogIn,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import Header from "@/components/layout/Navbar"
import { BRANCHES } from "@/lib/branches-data"

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

// ── Bold mid-green token system (matches the About page) ──────────────────
const GREEN_DEEP = "#0E7A3F"
const GREEN_MID = "#189A4D"
const GREEN_BRIGHT = "#2FBD63"
const GREEN_LIME = "#5CD97A"

const PAGE_BG = "linear-gradient(160deg, #EAFBF0 0%, #DBF5E4 45%, #C9EED4 100%)"
const HEADER_GLOW =
  "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(47,189,99,0.16) 0%, transparent 60%)"
const ACCENT_GRADIENT = `linear-gradient(135deg, ${GREEN_MID} 0%, ${GREEN_BRIGHT} 55%, ${GREEN_LIME} 100%)`
const ACCENT_GRADIENT_HOVER = `linear-gradient(135deg, ${GREEN_DEEP} 0%, ${GREEN_MID} 55%, ${GREEN_BRIGHT} 100%)`
const BADGE_NUMBER_GRADIENT = `linear-gradient(135deg, ${GREEN_MID}, ${GREEN_BRIGHT})`
const GLOW = "0 0 18px rgba(47,189,99,0.45)"
const GLOW_SOFT = "0 0 15px rgba(47,189,99,0.25)"

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
]

// ── Draft persistence so guests don't lose progress when sent to log in ────
const DRAFT_KEY = "dr_dental_booking_draft"

interface BookingDraft {
  name?: string
  email?: string
  phone?: string
  selectedServiceId?: number | null
  lockedFromUrl?: boolean
  selectedBranchId?: string | null
  selectedDate?: string | null
  selectedTime?: string
}

function readBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as BookingDraft) : null
  } catch {
    return null
  }
}

function generateDays() {
  const days: Date[] = []
  const now = new Date()
  for (let i = 1; i <= 28; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    if (d.getDay() !== 0) days.push(d)
  }
  return days
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function formatTimeTo24(time: string) {
  const [timeValue, modifier] = time.split(" ")
  const [rawHours, rawMinutes] = timeValue.split(":").map(Number)
  let hours = rawHours
  if (modifier === "PM" && hours < 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0
  return `${String(hours).padStart(2, "0")}:${String(rawMinutes).padStart(2, "0")}`
}

interface ApiService {
  id: number
  name: string
  duration?: string
  price?: number
  category?: string
}

function BookInner() {
  const router = useRouter()
  const { isLoggedIn, user, token, _hasHydrated } = useAuthStore()

  // Read any saved draft once, synchronously, before first paint.
  const [draft] = useState<BookingDraft | null>(() => readBookingDraft())

  const [allServices, setAllServices] = useState<ApiService[]>([])
  const [servicesLoading, setServicesLoading] = useState(false)

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    () => draft?.selectedServiceId ?? null,
  )
  const [lockedFromUrl, setLockedFromUrl] = useState(
    () => draft?.lockedFromUrl ?? false,
  )

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    () => draft?.selectedBranchId ?? null,
  )

  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    draft?.selectedDate ? new Date(draft.selectedDate) : null,
  )
  const [selectedTime, setSelectedTime] = useState(
    () => draft?.selectedTime ?? "",
  )

  // Pre-filled from draft (if any); otherwise synced from user after hydration
  const [name, setName] = useState(() => draft?.name ?? "")
  const [email, setEmail] = useState(() => draft?.email ?? "")
  const [phone, setPhone] = useState(() => draft?.phone ?? "")
  const [phoneError, setPhoneError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ── Once the draft has been read into state, clear it from storage ──
  useEffect(() => {
    if (draft && typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_KEY)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-fill name & email/phone once user is available after hydration,
  //     but never clobber values already restored from a draft ──
  useEffect(() => {
    if (user?.name && !name) setName(user.name)
    if (user?.email && !email) setEmail(user.email)
    if (user?.phone && !phone) setPhone(user.phone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    setServicesLoading(true)
    fetch("/api/services?per_page=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const raw: ApiService[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.data)
              ? data.data.data
              : []
        setAllServices(raw)
      })
      .catch(() => {})
      .finally(() => setServicesLoading(false))
  }, [])

  useEffect(() => {
    // Don't let a query param clobber a service already restored from draft
    if (selectedServiceId != null) return
    const params = new URLSearchParams(window.location.search)
    const qId = params.get("service_id")
    if (qId) {
      setSelectedServiceId(Number(qId))
      setLockedFromUrl(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!submitted) return
    if (countdown <= 0) {
      router.push("/profile")
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [submitted, countdown, router])

  const days = generateDays()
  const activeService =
    allServices.find((s) => s.id === selectedServiceId) ?? null
  const activeBranch = BRANCHES.find((b) => b.id === selectedBranchId) ?? null

  // Group services by category for the dropdown
  const groupedServices = useMemo(() => {
    const groups: Record<string, ApiService[]> = {}
    allServices.forEach((s) => {
      const cat = s.category || "Other"
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(s)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [allServices])

  function validatePhone(value: string) {
    if (value.length > 0 && (!/^09/.test(value) || value.length < 11)) {
      setPhoneError("Phone must start with 09 and be exactly 11 digits.")
    } else {
      setPhoneError("")
    }
  }

  // ── Save current form progress and send the user to log in ──
  function saveDraftAndRedirectToLogin() {
    if (typeof window !== "undefined") {
      const toSave: BookingDraft = {
        name,
        email,
        phone,
        selectedServiceId,
        lockedFromUrl,
        selectedBranchId,
        selectedDate: selectedDate ? selectedDate.toISOString() : null,
        selectedTime,
      }
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave))
      } catch {
        // storage unavailable — proceed anyway, just without persistence
      }
    }
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/book"
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  async function handleSubmit() {
    if (
      !selectedDate ||
      !selectedTime ||
      !name ||
      !email ||
      !phone ||
      !selectedBranchId
    ) {
      setError("Please complete all required fields.")
      return
    }
    if (!selectedServiceId) {
      setError("Please select a service.")
      return
    }
    if (!/^09\d{9}$/.test(phone)) {
      setError("Phone number must be 11 digits and start with 09.")
      return
    }

    // Form is complete — now make sure the user is logged in before booking.
    if (!isLoggedIn || !token) {
      saveDraftAndRedirectToLogin()
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: formatDate(selectedDate),
          time: formatTimeTo24(selectedTime),
          guests: 1,
          package: activeService?.name ?? "General Booking",
          service_id: selectedServiceId,
          branch_id: selectedBranchId,
          branch: activeBranch?.name ?? "",
          reservation_fee: activeService?.price ?? 0,
          payment_method: "cash",
          payment_status: "pending",
        }),
      })

      const data = (await response.json()) as Record<string, unknown>

      if (response.status === 401) {
        // Session expired mid-submit — keep their progress and re-auth.
        saveDraftAndRedirectToLogin()
        return
      }
      if (!response.ok || !data.success) {
        throw new Error((data.message as string) || "Failed to save booking.")
      }
      setSubmitted(true)
      router.replace("/profile")
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving your booking.",
      )
    } finally {
      setLoading(false)
    }
  }

  // Wait for auth store hydration only (form itself is public)
  if (!_hasHydrated) return null

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: PAGE_BG }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: HEADER_GLOW }}
          />
          <div className="pointer-events-none absolute top-1/4 -left-20 w-[350px] h-[350px] bg-emerald-300/20 rounded-full blur-[110px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-[300px] h-[300px] bg-lime-300/20 rounded-full blur-[100px]" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative text-center max-w-md"
          >
            <div className="relative w-20 h-20 mx-auto mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: ACCENT_GRADIENT,
                  boxShadow: GLOW,
                }}
              >
                <CheckCircle className="text-white" size={36} />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: "rgba(47,189,99,0.5)" }}
              />
            </div>
            <h2 className="font-serif text-3xl text-[#0E3B22] mb-3">
              Appointment Received
            </h2>
            <p className="text-[#2F6B45] mb-1 font-medium">
              We&apos;ve successfully received your appointment request for{" "}
              {activeService?.name ?? "the selected service"}.
            </p>

            <p className="text-[#5C8F6D] text-sm mb-8">
              Our team will review your request and send a confirmation to{" "}
              <span className="text-[#0E7A3F] font-medium">{email}</span> as
              soon as possible.
            </p>
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#5C8F6D] text-xs">
                Redirecting to home in{" "}
                <span className="text-[#0E7A3F] font-semibold">
                  {countdown}s
                </span>
                …
              </p>
              <div className="w-48 h-1 bg-[#C9EED4] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full rounded-full"
                  style={{ background: ACCENT_GRADIENT }}
                />
              </div>
              <button
                onClick={() => router.push("/")}
                className="mt-2 text-xs text-[#0E7A3F]/70 hover:text-[#0E7A3F] transition-colors underline underline-offset-2"
              >
                Go home now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: HEADER_GLOW }}
        />
        <div className="pointer-events-none absolute top-40 -right-32 w-[420px] h-[420px] bg-emerald-300/15 rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 -left-24 w-[350px] h-[350px] bg-lime-300/15 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">
          <motion.div
            {...fade}
            className="mb-12 flex items-start justify-between flex-wrap gap-4"
          >
            <div>
              <p
                className="text-sm uppercase tracking-[0.3em] mb-3 font-semibold"
                style={{
                  background: ACCENT_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Booking
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#0E3B22]">
                Schedule Your Visit
              </h1>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full self-start mt-2"
              style={{ border: "1px solid #B7ECC4", boxShadow: GLOW_SOFT }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: isLoggedIn ? GREEN_BRIGHT : "#B7ECC4" }}
              />
              {isLoggedIn && user ? (
                <span className="text-[#2F6B45] text-sm">
                  Signed in as{" "}
                  <span className="text-[#0E3B22] font-medium">
                    {user?.name}
                  </span>
                </span>
              ) : (
                <button
                  onClick={saveDraftAndRedirectToLogin}
                  className="flex items-center gap-1.5 text-[#2F6B45] text-sm hover:text-[#0E7A3F] transition-colors"
                >
                  <LogIn size={13} />
                  Booking as guest —{" "}
                  <span className="text-[#0E7A3F] font-medium underline underline-offset-2">
                    sign in
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Form ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1 — Your Information */}
              <motion.div {...fade} transition={{ delay: 0.3 }}>
                <Card className="p-6 bg-white border-[#B7ECC4] shadow-sm">
                  <h3 className="text-[#0E3B22] font-medium mb-4 flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ background: BADGE_NUMBER_GRADIENT }}
                    >
                      1
                    </span>{" "}
                    Your Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#2F6B45] text-xs mb-1.5 flex items-center gap-1">
                        <User size={12} /> Full Name
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#EAFBF0] border-[#B7ECC4] text-[#0E3B22] placeholder:text-[#8FC29E]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2F6B45] text-xs mb-1.5 flex items-center gap-1">
                        <Mail size={12} /> Email
                      </Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="bg-[#EAFBF0] border-[#B7ECC4] text-[#0E3B22]"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[#2F6B45] text-xs mb-1.5 flex items-center gap-1">
                        <Phone size={12} /> Phone
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11)
                          setPhone(val)
                          validatePhone(val)
                        }}
                        className={`bg-[#EAFBF0] border-[#B7ECC4] text-[#0E3B22] placeholder:text-[#8FC29E] ${
                          phoneError
                            ? "border-red-400/60 focus-visible:ring-red-400/30"
                            : ""
                        }`}
                        placeholder="09XXXXXXXXX"
                        maxLength={11}
                        inputMode="numeric"
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1.5">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Step 2 — Service */}
              <motion.div {...fade}>
                <Card className="p-6 bg-white border-[#B7ECC4] shadow-sm">
                  <h3 className="text-[#0E3B22] font-medium mb-4 flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ background: BADGE_NUMBER_GRADIENT }}
                    >
                      2
                    </span>{" "}
                    Select Service
                  </h3>

                  {lockedFromUrl && activeService ? (
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(24,154,77,0.1), rgba(92,217,122,0.08))",
                        border: "1px solid rgba(47,189,99,0.35)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: GREEN_BRIGHT }}
                        />
                        {servicesLoading ? (
                          <span className="text-[#2F6B45] text-sm animate-pulse">
                            Loading…
                          </span>
                        ) : (
                          <span className="text-[#0E3B22] font-medium">
                            {activeService.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#0E7A3F]/70 text-xs">
                          Selected
                        </span>
                        <button
                          onClick={() => {
                            setSelectedServiceId(null)
                            setLockedFromUrl(false)
                          }}
                          className="text-[#5C8F6D] hover:text-[#0E7A3F] text-xs underline underline-offset-2 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Select
                      value={selectedServiceId ? String(selectedServiceId) : ""}
                      onValueChange={(val) => {
                        setSelectedServiceId(Number(val))
                        setLockedFromUrl(false)
                      }}
                    >
                      <SelectTrigger className="bg-[#EAFBF0] border-[#B7ECC4] text-[#0E3B22]">
                        <SelectValue
                          placeholder={
                            servicesLoading
                              ? "Loading services…"
                              : "Choose a service"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {groupedServices.map(([category, services], i) => (
                          <SelectGroup key={category}>
                            {i > 0 && <SelectSeparator />}
                            <SelectLabel className="text-[#0E7A3F] text-xs uppercase tracking-wide">
                              {category}
                            </SelectLabel>
                            {services.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Card>
              </motion.div>

              {/* Step 3 — Branch */}
              <motion.div {...fade} transition={{ delay: 0.05 }}>
                <Card className="p-6 bg-white border-[#B7ECC4] shadow-sm">
                  <h3 className="text-[#0E3B22] font-medium mb-4 flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ background: BADGE_NUMBER_GRADIENT }}
                    >
                      3
                    </span>{" "}
                    Select Branch
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {BRANCHES.map((b) => {
                      const active = selectedBranchId === b.id
                      return (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBranchId(b.id)}
                          className="text-left p-4 rounded-xl border transition-all"
                          style={
                            active
                              ? {
                                  background:
                                    "linear-gradient(135deg, rgba(24,154,77,0.12), rgba(92,217,122,0.1))",
                                  borderColor: "rgba(47,189,99,0.5)",
                                  boxShadow: GLOW_SOFT,
                                }
                              : {
                                  background: "#EAFBF0",
                                  borderColor: "#B7ECC4",
                                }
                          }
                          onMouseEnter={(e) => {
                            if (!active)
                              e.currentTarget.style.background = "#D3F4DD"
                          }}
                          onMouseLeave={(e) => {
                            if (!active)
                              e.currentTarget.style.background = "#EAFBF0"
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-[#0E3B22] font-medium text-sm">
                              {b.name}
                            </span>
                            {active && (
                              <CheckCircle
                                size={14}
                                className="text-[#0E7A3F] shrink-0 mt-0.5"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[#5C8F6D] text-xs mb-1">
                            <MapPin size={11} className="shrink-0" />
                            <span>{b.area}</span>
                          </div>
                          <p className="text-[#5C8F6D] text-xs">{b.hours}</p>
                        </button>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>

              {/* Step 4 — Date */}
              <motion.div {...fade} transition={{ delay: 0.1 }}>
                <Card className="p-6 bg-white border-[#B7ECC4] shadow-sm">
                  <h3 className="text-[#0E3B22] font-medium mb-4 flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ background: BADGE_NUMBER_GRADIENT }}
                    >
                      4
                    </span>{" "}
                    Choose Date
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {days.slice(0, 21).map((d, i) => {
                      const active =
                        selectedDate?.toDateString() === d.toDateString()
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(d)}
                          className="p-2 rounded-lg text-center text-sm transition-all"
                          style={
                            active
                              ? {
                                  background: ACCENT_GRADIENT,
                                  color: "#FFFFFF",
                                  boxShadow: GLOW,
                                }
                              : { background: "#EAFBF0", color: "#2F6B45" }
                          }
                          onMouseEnter={(e) => {
                            if (!active)
                              e.currentTarget.style.background = "#D3F4DD"
                          }}
                          onMouseLeave={(e) => {
                            if (!active)
                              e.currentTarget.style.background = "#EAFBF0"
                          }}
                        >
                          <div className="text-[10px] opacity-70">
                            {d.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="font-medium">{d.getDate()}</div>
                        </button>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>

              {/* Step 5 — Time */}
              <motion.div {...fade} transition={{ delay: 0.2 }}>
                <Card className="p-6 bg-white border-[#B7ECC4] shadow-sm">
                  <h3 className="text-[#0E3B22] font-medium mb-4 flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ background: BADGE_NUMBER_GRADIENT }}
                    >
                      5
                    </span>{" "}
                    Select Time
                  </h3>

                  {!selectedDate ? (
                    <p className="text-[#5C8F6D] text-sm">
                      Choose a date to see available times.
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {timeSlots.map((t) => {
                        const active = selectedTime === t
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className="py-2 px-3 rounded-lg text-sm transition-all"
                            style={
                              active
                                ? {
                                    background: ACCENT_GRADIENT,
                                    color: "#FFFFFF",
                                    boxShadow: GLOW,
                                  }
                                : { background: "#EAFBF0", color: "#2F6B45" }
                            }
                            onMouseEnter={(e) => {
                              if (!active)
                                e.currentTarget.style.background = "#D3F4DD"
                            }}
                            onMouseLeave={(e) => {
                              if (!active)
                                e.currentTarget.style.background = "#EAFBF0"
                            }}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div {...fade} transition={{ delay: 0.2 }}>
                  <Card
                    className="p-6 bg-white overflow-hidden relative"
                    style={{
                      border: "1px solid #B7ECC4",
                      boxShadow: GLOW_SOFT,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ background: ACCENT_GRADIENT }}
                    />
                    <h3 className="text-[#0E3B22] font-medium mb-6 mt-1">
                      Appointment Summary
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#5C8F6D]">Service</span>
                        <span className="text-[#0E3B22] text-right max-w-[60%] leading-snug">
                          {servicesLoading ? (
                            <span className="text-[#8FC29E] animate-pulse">
                              Loading…
                            </span>
                          ) : (
                            (activeService?.name ?? "—")
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5C8F6D]">Branch</span>
                        <span className="text-[#0E3B22] text-right max-w-[60%] leading-snug">
                          {activeBranch?.name ?? "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5C8F6D]">Date</span>
                        <span className="text-[#0E3B22]">
                          {selectedDate
                            ? selectedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5C8F6D]">Time</span>
                        <span className="text-[#0E3B22]">
                          {selectedTime || "—"}
                        </span>
                      </div>
                      <div className="border-t border-[#B7ECC4] pt-4 flex justify-between items-center">
                        <span className="text-[#5C8F6D]">Starting at</span>
                        <Badge
                          className="text-white border-0"
                          style={{ background: ACCENT_GRADIENT }}
                        >
                          {activeService?.price
                            ? `₱${Number(activeService.price).toLocaleString()}`
                            : "—"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#B7ECC4]">
                      <div className="flex items-center gap-2 text-[#5C8F6D] text-xs mb-1">
                        <Calendar size={12} />{" "}
                        {activeBranch
                          ? `Dr. Dental Care Center — ${activeBranch.name}`
                          : "Dr. Dental Care Center"}
                      </div>
                      <div className="flex items-center gap-2 text-[#5C8F6D] text-xs">
                        <Clock size={12} />{" "}
                        {activeBranch?.hours ?? "Mon–Sat: 9AM–7PM"}
                      </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={handleSubmit}
                      disabled={
                        !selectedServiceId ||
                        !selectedBranchId ||
                        !selectedDate ||
                        !selectedTime ||
                        !name ||
                        !email ||
                        !phone ||
                        phoneError !== "" ||
                        loading ||
                        servicesLoading
                      }
                      className="w-full mt-6 text-white border-0 transition-all disabled:opacity-30"
                      style={{ background: ACCENT_GRADIENT, boxShadow: GLOW }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = ACCENT_GRADIENT_HOVER
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = ACCENT_GRADIENT
                      }}
                      size="lg"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
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
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Confirming…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Confirm Booking <ArrowRight size={16} />
                        </span>
                      )}
                    </Button>

                    {!isLoggedIn && (
                      <p className="mt-3 text-center text-[#5C8F6D] text-xs">
                        You&apos;ll be asked to sign in to confirm your
                        appointment.
                      </p>
                    )}
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Book() {
  return (
    <Suspense>
      <BookInner />
    </Suspense>
  )
}
