"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  Users,
  BarChart3,
  FileText,
  ArrowRight,
  Loader2,
  ChevronDown,
} from "lucide-react"

import { useAuthStore } from "@/store/authStore"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role?: string
}

interface AdminDashboardProps {
  user: User
}

// Shape returned by DashboardController@index
interface RecentBooking {
  name: string | null
  service: string | null
  booking_date: string | null // e.g. "2026-07-15"
  booking_time: string | null // e.g. "14:30:00"
  status: string | null
}

interface DashboardData {
  todays_bookings: number
  active_patients: number
  monthly_revenue: number | string
  pending_appointments: number
  recent_bookings: RecentBooking[]
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(1)}K`
  return `₱${amount.toLocaleString("en-PH")}`
}

function getAvatar(name: string | null): string {
  const safe = name || "Unknown"
  return safe
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("")
}

function formatDate(raw: string | null): string {
  if (!raw) return "—"
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return raw
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(raw: string | null): string {
  if (!raw) return "—"
  const match = raw.match(/^(\d{2}):(\d{2})/)
  if (!match) return raw
  const hour = Number(match[1])
  const minute = Number(match[2])
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${String(minute).padStart(2, "0")} ${ampm}`
}

function getStatus(status: string | null): string {
  const s = status || "pending"
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { token, _hasHydrated } = useAuthStore()

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1) // 1-12
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const years = Array.from({ length: 2 }, (_, i) => now.getFullYear() - i)

  async function fetchDashboard() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        month: String(selectedMonth),
        year: String(selectedYear),
      })
      const res = await fetch(`/api/dashboard?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const json = await res.json()
      if (!res.ok)
        throw new Error(json?.message || "Failed to fetch dashboard data")
      setData(json as DashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!_hasHydrated) return
    fetchDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, _hasHydrated, selectedMonth, selectedYear])

  const revenueNumber = Number(data?.monthly_revenue ?? 0)

  const statCards = [
    {
      label: "Today's Appointments",
      value: loading || !data ? "—" : String(data.todays_bookings),
      icon: CalendarDays,
    },
    {
      label: "Active Patients",
      value: loading || !data ? "—" : data.active_patients.toLocaleString(),
      icon: Users,
    },
    {
      label: "Monthly Revenue",
      value: loading || !data ? "—" : formatRevenue(revenueNumber),
      icon: BarChart3,
    },
    {
      label: "Pending Follow-ups",
      value: loading || !data ? "—" : String(data.pending_appointments),
      icon: FileText,
    },
  ]

  const statusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s === "confirmed" || s === "approved")
      return "bg-emerald-50 text-emerald-600 border border-emerald-100"
    if (s === "in progress" || s === "ongoing")
      return "bg-emerald-50 text-emerald-600 border border-emerald-100"
    if (s === "cancelled" || s === "rejected")
      return "bg-red-50 text-red-600 border border-red-100"
    return "bg-amber-50 text-amber-600 border border-amber-100"
  }

  const recentBookings = data?.recent_bookings ?? []

  return (
    <div
      className="min-h-screen bg-[#f4f7fb] text-slate-900"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <main className="min-h-screen bg-[#f4f8ff] pt-[12px] pb-12 px-4">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Clinic Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* MONTH BUTTON */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="appearance-none flex items-center gap-2 h-10 pl-4 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer font-medium"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* YEAR BUTTON */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none flex items-center gap-2 h-10 pl-4 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer font-medium"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* REFRESH */}
            <button
              onClick={fetchDashboard}
              className="flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ArrowRight size={15} className="rotate-[-90deg]" />
              )}
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong>Could not load dashboard:</strong> {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Icon size={22} className="text-emerald-600" />
                    </div>
                    {loading && (
                      <Loader2
                        size={16}
                        className="animate-spin text-slate-300"
                      />
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight break-words">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* RECENT BOOKINGS TABLE */}
          <div className="2xl:col-span-2 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Bookings
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {loading
                    ? "Loading schedules…"
                    : `Latest ${recentBookings.length} booking${recentBookings.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <Link
                href="/admin/appointments"
                className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Fetching bookings…</span>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <CalendarDays size={32} className="opacity-40" />
                <p className="text-sm">No recent bookings found</p>
              </div>
            ) : (
              <>
                {/* MOBILE CARDS */}
                <div className="block md:hidden p-4 space-y-4">
                  {recentBookings.map((b, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 p-4 bg-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                          {getAvatar(b.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {b.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {b.service || "—"}
                              </p>
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor(
                                getStatus(b.status),
                              )}`}
                            >
                              {getStatus(b.status)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-3">
                            {formatDate(b.booking_date)} ·{" "}
                            {formatTime(b.booking_time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block divide-y divide-slate-100">
                  {recentBookings.map((b, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-all"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                        {getAvatar(b.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {b.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {b.service || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium">
                          {formatDate(b.booking_date)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatTime(b.booking_time)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${statusColor(
                          getStatus(b.status),
                        )}`}
                      >
                        {getStatus(b.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* REVENUE CARD */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 p-6 shadow-xl shadow-emerald-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_35%)]" />
              <div className="relative z-10">
                <p className="text-emerald-100 text-xs uppercase tracking-[0.2em] font-semibold mb-2">
                  Revenue — {MONTHS[selectedMonth - 1]} {selectedYear}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {loading || !data ? "—" : formatRevenue(revenueNumber)}
                </h2>
                <p className="text-emerald-100 text-sm mt-2">
                  From confirmed bookings this period
                </p>
              </div>
            </div>

            {/* QUICK SUMMARY */}
            {!loading && data && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Quick Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Today&apos;s bookings
                    </span>
                    <span className="font-semibold text-slate-800">
                      {data.todays_bookings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Active patients</span>
                    <span className="font-semibold text-slate-800">
                      {data.active_patients}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pending appointments</span>
                    <span className="font-semibold text-slate-800">
                      {data.pending_appointments}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
