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

  // ── Auth guard — wait for hydration before redirecting ──
  useEffect(() => {
    if (!_hasHydrated) return
    if (!isLoggedIn || !token) {
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/book"
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [_hasHydrated, isLoggedIn, token, router])

  const [allServices, setAllServices] = useState<ApiService[]>([])
  const [servicesLoading, setServicesLoading] = useState(false)

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  )
  const [lockedFromUrl, setLockedFromUrl] = useState(false)

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")

  // Start empty — synced from user after hydration
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ── Auto-fill name & email once user is available after hydration ──
  useEffect(() => {
    if (user?.name) setName(user.name)
    if (user?.email) setEmail(user.email)
    if (user?.phone) setPhone(user.phone)
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
    const params = new URLSearchParams(window.location.search)
    const qId = params.get("service_id")
    if (qId) {
      setSelectedServiceId(Number(qId))
      setLockedFromUrl(true)
    }
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
        router.replace("/login?redirect=/book")
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

  // Show nothing while hydrating or if not logged in
  if (!_hasHydrated || !isLoggedIn || !token) return null

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F3FAF1] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <div className="relative w-20 h-20 mx-auto mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-[#7BC67B]/15 border border-[#7BC67B]/40 flex items-center justify-center"
              >
                <CheckCircle className="text-[#2F5C2F]" size={36} />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-[#7BC67B]/50"
              />
            </div>
            <h2 className="font-serif text-3xl text-[#1F3A1F] mb-3">
              Appointment Received
            </h2>
            <p className="text-[#4C6B4C] mb-1 font-medium">
              We&apos;ve successfully received your appointment request for{" "}
              {activeService?.name ?? "the selected service"}.
            </p>

            <p className="text-[#6B8E6B] text-sm mb-8">
              Our team will review your request and send a confirmation to{" "}
              <span className="text-[#2F5C2F]">{email}</span> as soon as
              possible.
            </p>
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#6B8E6B] text-xs">
                Redirecting to home in{" "}
                <span className="text-[#2F5C2F] font-semibold">
                  {countdown}s
                </span>
                …
              </p>
              <div className="w-48 h-0.5 bg-[#C8E6C9] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-[#7BC67B] rounded-full"
                />
              </div>
              <button
                onClick={() => router.push("/")}
                className="mt-2 text-xs text-[#2F5C2F]/70 hover:text-[#2F5C2F] transition-colors underline underline-offset-2"
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
    <div className="min-h-screen bg-[#F3FAF1] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
          <motion.div
            {...fade}
            className="mb-12 flex items-start justify-between flex-wrap gap-4"
          >
            <div>
              <p className="text-[#2F5C2F] text-sm uppercase tracking-[0.3em] mb-3">
                Booking
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#1F3A1F]">
                Schedule Your Visit
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C8E6C9] rounded-full self-start mt-2">
              <div className="w-2 h-2 rounded-full bg-[#7BC67B] animate-pulse" />
              <span className="text-[#4C6B4C] text-sm">
                Signed in as{" "}
                <span className="text-[#1F3A1F]">{user?.name}</span>
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Form ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1 — Your Information */}
              <motion.div {...fade} transition={{ delay: 0.3 }}>
                <Card className="p-6 bg-white border-[#C8E6C9] shadow-sm">
                  <h3 className="text-[#1F3A1F] font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7BC67B] text-[#1F3A1F] text-xs flex items-center justify-center font-bold">
                      1
                    </span>{" "}
                    Your Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#4C6B4C] text-xs mb-1.5 flex items-center gap-1">
                        <User size={12} /> Full Name
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#F3FAF1] border-[#C8E6C9] text-[#1F3A1F] placeholder:text-[#8FA88F]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label className="text-[#4C6B4C] text-xs mb-1.5 flex items-center gap-1">
                        <Mail size={12} /> Email
                      </Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="bg-[#F3FAF1] border-[#C8E6C9] text-[#1F3A1F]"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[#4C6B4C] text-xs mb-1.5 flex items-center gap-1">
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
                        className={`bg-[#F3FAF1] border-[#C8E6C9] text-[#1F3A1F] placeholder:text-[#8FA88F] ${
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
                <Card className="p-6 bg-white border-[#C8E6C9] shadow-sm">
                  <h3 className="text-[#1F3A1F] font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7BC67B] text-[#1F3A1F] text-xs flex items-center justify-center font-bold">
                      2
                    </span>{" "}
                    Select Service
                  </h3>

                  {lockedFromUrl && activeService ? (
                    <div className="flex items-center justify-between px-4 py-3 bg-[#7BC67B]/10 border border-[#7BC67B]/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#7BC67B] shrink-0" />
                        {servicesLoading ? (
                          <span className="text-[#4C6B4C] text-sm animate-pulse">
                            Loading…
                          </span>
                        ) : (
                          <span className="text-[#1F3A1F] font-medium">
                            {activeService.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#2F5C2F]/70 text-xs">
                          Selected
                        </span>
                        <button
                          onClick={() => {
                            setSelectedServiceId(null)
                            setLockedFromUrl(false)
                          }}
                          className="text-[#6B8E6B] hover:text-[#2F5C2F] text-xs underline underline-offset-2 transition-colors"
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
                      <SelectTrigger className="bg-[#F3FAF1] border-[#C8E6C9] text-[#1F3A1F]">
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
                            <SelectLabel className="text-[#2F5C2F] text-xs uppercase tracking-wide">
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
                <Card className="p-6 bg-white border-[#C8E6C9] shadow-sm">
                  <h3 className="text-[#1F3A1F] font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7BC67B] text-[#1F3A1F] text-xs flex items-center justify-center font-bold">
                      3
                    </span>{" "}
                    Select Branch
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {BRANCHES.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedBranchId === b.id
                            ? "bg-[#7BC67B]/10 border-[#7BC67B]/50 shadow-[0_0_15px_rgba(123,198,123,0.2)]"
                            : "bg-[#F3FAF1] border-[#C8E6C9] hover:bg-[#DCEFD6]/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-[#1F3A1F] font-medium text-sm">
                            {b.name}
                          </span>
                          {selectedBranchId === b.id && (
                            <CheckCircle
                              size={14}
                              className="text-[#2F5C2F] shrink-0 mt-0.5"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6B8E6B] text-xs mb-1">
                          <MapPin size={11} className="shrink-0" />
                          <span>{b.area}</span>
                        </div>
                        <p className="text-[#6B8E6B] text-xs">{b.hours}</p>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Step 4 — Date */}
              <motion.div {...fade} transition={{ delay: 0.1 }}>
                <Card className="p-6 bg-white border-[#C8E6C9] shadow-sm">
                  <h3 className="text-[#1F3A1F] font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7BC67B] text-[#1F3A1F] text-xs flex items-center justify-center font-bold">
                      4
                    </span>{" "}
                    Choose Date
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {days.slice(0, 21).map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        className={`p-2 rounded-lg text-center text-sm transition-all ${
                          selectedDate?.toDateString() === d.toDateString()
                            ? "bg-[#7BC67B] text-[#1F3A1F] shadow-[0_0_15px_rgba(123,198,123,0.35)]"
                            : "bg-[#F3FAF1] text-[#4C6B4C] hover:bg-[#DCEFD6]/70"
                        }`}
                      >
                        <div className="text-[10px] opacity-60">
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="font-medium">{d.getDate()}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Step 5 — Time */}
              <motion.div {...fade} transition={{ delay: 0.2 }}>
                <Card className="p-6 bg-white border-[#C8E6C9] shadow-sm">
                  <h3 className="text-[#1F3A1F] font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7BC67B] text-[#1F3A1F] text-xs flex items-center justify-center font-bold">
                      5
                    </span>{" "}
                    Select Time
                  </h3>

                  {!selectedDate ? (
                    <p className="text-[#6B8E6B] text-sm">
                      Choose a date to see available times.
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 px-3 rounded-lg text-sm transition-all ${
                            selectedTime === t
                              ? "bg-[#7BC67B] text-[#1F3A1F] shadow-[0_0_15px_rgba(123,198,123,0.35)]"
                              : "bg-[#F3FAF1] text-[#4C6B4C] hover:bg-[#DCEFD6]/70"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div {...fade} transition={{ delay: 0.2 }}>
                  <Card className="p-6 bg-white border-[#C8E6C9] shadow-sm">
                    <h3 className="text-[#1F3A1F] font-medium mb-6">
                      Appointment Summary
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B8E6B]">Service</span>
                        <span className="text-[#1F3A1F] text-right max-w-[60%] leading-snug">
                          {servicesLoading ? (
                            <span className="text-[#8FA88F] animate-pulse">
                              Loading…
                            </span>
                          ) : (
                            (activeService?.name ?? "—")
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B8E6B]">Branch</span>
                        <span className="text-[#1F3A1F] text-right max-w-[60%] leading-snug">
                          {activeBranch?.name ?? "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B8E6B]">Date</span>
                        <span className="text-[#1F3A1F]">
                          {selectedDate
                            ? selectedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B8E6B]">Time</span>
                        <span className="text-[#1F3A1F]">
                          {selectedTime || "—"}
                        </span>
                      </div>
                      <div className="border-t border-[#C8E6C9] pt-4 flex justify-between">
                        <span className="text-[#6B8E6B]">Starting at</span>
                        <Badge
                          variant="outline"
                          className="border-[#7BC67B]/50 text-[#2F5C2F]"
                        >
                          {activeService?.price
                            ? `₱${Number(activeService.price).toLocaleString()}`
                            : "—"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#C8E6C9]">
                      <div className="flex items-center gap-2 text-[#6B8E6B] text-xs mb-1">
                        <Calendar size={12} />{" "}
                        {activeBranch
                          ? `Dr. Dental Care Center — ${activeBranch.name}`
                          : "Dr. Dental Care Center"}
                      </div>
                      <div className="flex items-center gap-2 text-[#6B8E6B] text-xs">
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
                      className="w-full mt-6 bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] hover:shadow-[0_0_20px_rgba(123,198,123,0.4)] transition-all disabled:opacity-30"
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
