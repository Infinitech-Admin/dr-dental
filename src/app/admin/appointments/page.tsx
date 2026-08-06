"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  AlertCircle,
  Stethoscope,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  User,
  Phone,
  FileText,
  Eye,
  Trash2,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { BRANCHES } from "@/lib/branches-data"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

// Normalizes the various shapes the Laravel API returns (plain array,
// { data: [...] }, or paginated { data: { data: [...] } }) into a flat list.
function extractList<T>(data: unknown): T[] {
  const d = data as { data?: { data?: T[] } | T[] } | T[]
  if (Array.isArray(d)) return d
  if (Array.isArray((d as { data?: unknown })?.data)) {
    return (d as { data: T[] }).data
  }
  const nested = (d as { data?: { data?: T[] } })?.data?.data
  if (Array.isArray(nested)) return nested
  return []
}

function groupServicesByCategory(services: Service[]) {
  return services.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category?.trim() || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  confirmed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
}

interface Service {
  id: string
  name: string
  category: string
}

interface Booking {
  id: string
  user_id?: string
  service_id?: string
  service?: { id: string; name: string } | null
  booking_date: string
  status: "pending" | "confirmed" | "cancelled"
  notes?: string | null
  name: string
  email: string
  phone?: string | null
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

function StatusBadge({ status }: { status?: string }) {
  const s = STATUS_STYLES[status as string] || STATUS_STYLES.pending
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full capitalize ${s.dot} `} />
      <span className="capitalize">{status ?? "pending"}</span>
    </span>
  )
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: "success" | "error"
  onClose: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-sm
      ${type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}
    >
      {type === "success" ? (
        <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
      ) : (
        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <XCircle size={14} />
      </button>
    </div>
  )
}

function ConfirmDeleteDialog({
  booking,
  onConfirm,
  onCancel,
}: {
  booking: Booking | null
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!booking) return null
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-red-100 rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Delete Booking</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              This action cannot be undone
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-5">
          Are you sure you want to delete the booking for{" "}
          <span className="font-semibold text-slate-800">
            {booking.name ?? "this patient"}
          </span>
          ?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

type ActionModalState = {
  open: boolean
  type: string | null
  booking: Booking | null
  notes: string
  submitting: boolean
}

function ActionModal({
  modal,
  onClose,
  onSubmit,
  onChange,
}: {
  modal: ActionModalState
  onClose: () => void
  onSubmit: () => void
  onChange: (v: string) => void
}) {
  if (!modal.open || !modal.booking) return null
  const isApprove = modal.type === "approve"
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${isApprove ? "bg-emerald-50" : "bg-red-50"}`}
            >
              {isApprove ? (
                <CheckCircle size={18} className="text-emerald-600" />
              ) : (
                <XCircle size={18} className="text-red-600" />
              )}
            </div>
            <h3 className="font-semibold text-slate-800">
              {isApprove ? "Approve Booking" : "Reject Booking"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <XCircle size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-[#f4f8ff] border border-emerald-100 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          {[
            ["Name", modal.booking.name],
            ["Email", modal.booking.email],
            [
              "Date",
              modal.booking.booking_date
                ? new Date(
                    modal.booking.booking_date.replace(" ", "T"),
                  ).toLocaleDateString()
                : "—",
            ],
            ["Service", modal.booking.service?.name || "—"],
          ].map(([label, val]) => (
            <div key={label}>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {label}
              </span>
              <div className="text-sm text-slate-700 font-medium truncate">
                {val}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            {isApprove ? "Message to Client" : "Reason for Rejection"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={modal.notes}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              isApprove
                ? "We are pleased to confirm your appointment. We look forward to seeing you."
                : "Unfortunately we cannot accommodate this time. Please rebook at a different slot."
            }
            className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 resize-none text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={modal.submitting}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={modal.submitting}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 ${
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {modal.submitting
              ? "Processing…"
              : isApprove
                ? "Approve & Notify"
                : "Reject & Notify"}
          </button>
        </div>
      </div>
    </div>
  )
}

function NewBookingModal({
  open,
  onClose,
  onSuccess,
  token,
  services,
  servicesLoading,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  token: string | null
  services: Service[]
  servicesLoading: boolean
}) {
  type F = {
    name: string
    email: string
    phone: string
    date: string
    time: string
    service_id: string
    branch: string
    notes: string
  }
  const blank: F = {
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service_id: "",
    branch: "",
    notes: "",
  }
  const [form, setForm] = useState<F>(blank)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const groupedServices = groupServicesByCategory(services)

  const TIME_SLOTS = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ]

  if (!open) return null

  const formatTime = (time24: string) => {
    const [hour, minute] = time24.split(":").map(Number)

    const period = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.date || !form.time) {
      setError("Please fill in all required fields.")
      return
    }
    setLoading(true)
    setError("")
    try {
      // service_id is now a real relation coming from /api/services,
      // instead of being crammed as free text into notes.
      const booking_date = `${form.date} ${form.time}:00`

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          booking_date,
          service_id: form.service_id || undefined,
          branch: form.branch || undefined,
          notes: form.notes || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok)
        throw new Error(
          (data as { message?: string }).message || "Failed to create booking.",
        )
      onSuccess()
      onClose()
      setForm(blank)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: keyof F, type: string, ph: string) => (
    <div key={key}>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={ph}
        className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 text-sm"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100 rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-slate-800">New Booking</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <XCircle size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field("Full Name *", "name", "text", "Juan dela Cruz")}
            {field("Email *", "email", "email", "juan@example.com")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Phone", "phone", "tel", "+63 912 345 6789")}

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Branch
              </label>
              <select
                value={form.branch}
                onChange={(e) =>
                  setForm((p) => ({ ...p, branch: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-400 text-sm"
              >
                <option value="">Select a branch</option>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
              Requested Service
            </label>
            <select
              value={form.service_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, service_id: e.target.value }))
              }
              disabled={servicesLoading}
              className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-400 text-sm disabled:opacity-60"
            >
              <option value="">
                {servicesLoading
                  ? "Loading services…"
                  : services.length
                    ? "Select a service"
                    : "No services available"}
              </option>
              {Object.entries(groupedServices).map(([category, items]) => (
                <optgroup key={category} label={category}>
                  {items.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value, time: "" }))
                }
                className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Time *
              </label>
              <select
                value={form.time}
                onChange={(e) =>
                  setForm((p) => ({ ...p, time: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-400 text-sm"
              >
                <option value="">Select time</option>

                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {formatTime(t)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Any additional notes…"
              className="w-full px-3.5 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 text-sm resize-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewModal({
  booking,
  onClose,
}: {
  booking: Booking | null
  onClose: () => void
}) {
  if (!booking) return null

  // Parse booking_date manually to avoid timezone shift
  const parseDateParts = (raw: string) => {
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/)
    if (!match) return null
    return {
      year: +match[1],
      month: +match[2] - 1,
      day: +match[3],
      hour: +match[4],
      minute: +match[5],
    }
  }

  const parts = booking.booking_date
    ? parseDateParts(booking.booking_date)
    : null
  const dateStr = parts
    ? new Date(parts.year, parts.month, parts.day).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—"
  const timeStr = parts
    ? (() => {
        const h = parts.hour
        const ampm = h >= 12 ? "PM" : "AM"
        const dh = h % 12 === 0 ? 12 : h % 12
        return `${dh}:${String(parts.minute).padStart(2, "0")} ${ampm}`
      })()
    : "—"

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Booking Details</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <XCircle size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-0">
          <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Status
            </span>
            <StatusBadge status={booking.status} />
          </div>
          {[
            {
              icon: <User size={14} />,
              label: "Name",
              val: booking.name ?? "—",
            },
            {
              icon: <Mail size={14} />,
              label: "Email",
              val: booking.email ?? "—",
            },
            {
              icon: <Phone size={14} />,
              label: "Phone",
              val: booking.phone ?? "—",
            },
            { icon: <Calendar size={14} />, label: "Date", val: dateStr },
            { icon: <Clock size={14} />, label: "Time", val: timeStr },
            {
              icon: <FileText size={14} />,
              label: "Service",
              val: booking.service?.name ?? "—",
            },
          ].map(({ icon, label, val }) => (
            <div
              key={label}
              className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-slate-500 flex items-center gap-2">
                {icon}
                {label}
              </span>
              <span className="text-sm text-slate-700 font-medium text-right max-w-[58%] break-words">
                {val}
              </span>
            </div>
          ))}
          {booking.notes && (
            <div className="flex items-start justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 flex items-center gap-2">
                <FileText size={14} />
                Notes
              </span>

              <span className="text-sm text-slate-700 font-medium text-right max-w-[58%] break-words">
                {booking.notes}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminBookingsTable() {
  // Get token directly from Zustand store — no localStorage guessing
  const { token } = useAuthStore()

  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>)

  const [bookings, setBookings] = useState<Booking[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [showNewModal, setShowNewModal] = useState(false)
  const [viewBooking, setViewBooking] = useState<Booking | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [actionModal, setActionModal] = useState<ActionModalState>({
    open: false,
    type: null,
    booking: null,
    notes: "",
    submitting: false,
  })

  // Services list, shared by the filter bar and the New Booking form.
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type })

  const fetchServices = useCallback(async () => {
    setServicesLoading(true)
    try {
      const res = await fetch("/api/services?per_page=100", {
        cache: "no-store",
      })
      const data = await res.json().catch(() => ({}))
      setServices(extractList<Service>(data))
    } catch {
      setServices([])
    } finally {
      setServicesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const fetchBookings = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setFetchError("")
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(perPage),
        ...(search ? { search } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(serviceFilter ? { service_id: serviceFilter } : {}),
      })

      const res = await fetch(`${API_URL}/api/bookings?${params}`, {
        headers: { Accept: "application/json", ...authHeader },
      })

      if (res.status === 401) {
        setFetchError(
          "401 Unauthorized — token may have expired. Please log out and log in again.",
        )
        return
      }

      const data = await res.json().catch(() => ({}))

      const list = extractList<Booking>(data)
      const d = data as {
        data?: {
          current_page?: number
          last_page?: number
          per_page?: number
          total?: number
          from?: number
          to?: number
        }
        current_page?: number
        last_page?: number
        per_page?: number
        total?: number
        from?: number
        to?: number
      }
      const src = d?.data && !Array.isArray(d.data) ? d.data : d
      const metaData: PaginationMeta | null = Array.isArray(data)
        ? null
        : {
            current_page: src?.current_page ?? 1,
            last_page: src?.last_page ?? 1,
            per_page: src?.per_page ?? perPage,
            total: src?.total ?? list.length,
            from: src?.from ?? (list.length ? 1 : 0),
            to: src?.to ?? list.length,
          }

      setBookings(list)
      setMeta(metaData)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Network error.")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, perPage, search, statusFilter, serviceFilter, token])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, serviceFilter, perPage])

  const openActionModal = (type: string, booking: Booking) =>
    setActionModal({ open: true, type, booking, notes: "", submitting: false })

  const handleActionSubmit = async () => {
    const { type, booking, notes } = actionModal
    if (!notes.trim()) {
      showToast("Please add a note before submitting.", "error")
      return
    }
    setActionModal((p) => ({ ...p, submitting: true }))
    try {
      const status = type === "approve" ? "confirmed" : "cancelled"
      const res = await fetch(`${API_URL}/api/bookings/${booking?.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeader,
        },
        body: JSON.stringify({ status, notes }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(
          (d as { message?: string }).message || `HTTP ${res.status}`,
        )
      }
      setActionModal({
        open: false,
        type: null,
        booking: null,
        notes: "",
        submitting: false,
      })
      showToast(
        `Booking ${type === "approve" ? "approved" : "rejected"} successfully.`,
        "success",
      )
      fetchBookings()
    } catch (err) {
      showToast("Error: " + errMsg(err), "error")
      setActionModal((p) => ({ ...p, submitting: false }))
    }
  }

  const handleDeleteConfirmed = async () => {
    const id = deleteTarget?.id
    setDeleteTarget(null)
    if (!id) return
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", ...authHeader },
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(
          (d as { message?: string }).message || `HTTP ${res.status}`,
        )
      }
      showToast("Booking deleted.", "success")
      fetchBookings()
    } catch (err) {
      showToast("Delete failed: " + errMsg(err), "error")
    }
  }

  // Parse booking_date manually to avoid UTC timezone shift
  const parseDateParts = (raw: string) => {
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/)
    if (!match) return null
    return {
      year: +match[1],
      month: +match[2] - 1,
      day: +match[3],
      hour: +match[4],
      minute: +match[5],
    }
  }

  const formatTime = (raw: string) => {
    const p = parseDateParts(raw)
    if (!p) return "—"
    const ampm = p.hour >= 12 ? "PM" : "AM"
    const dh = p.hour % 12 === 0 ? 12 : p.hour % 12
    return `${dh}:${String(p.minute).padStart(2, "0")} ${ampm}`
  }

  const formatDate = (raw: string) => {
    const p = parseDateParts(raw)
    if (!p) return "—"
    return new Date(p.year, p.month, p.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatService = (b: Booking) => b.service?.name || "—"

  const safeBookings = Array.isArray(bookings) ? bookings : []
  const totalPages = meta?.last_page ?? 1
  const pendingCount = safeBookings.filter((b) => b.status === "pending").length
  const confirmedCount = safeBookings.filter(
    (b) => b.status === "confirmed",
  ).length
  const cancelledCount = safeBookings.filter(
    (b) => b.status === "cancelled",
  ).length

  return (
    <main className="min-h-screen bg-[#f4f8ff] pt-[12px] pb-12 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Title Section */}
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar size={20} className="text-emerald-600 shrink-0" />

            <h1 className="text-lg font-semibold text-slate-800">
              All Bookings
            </h1>

            {meta && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-semibold">
                {meta.total} total
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={fetchBookings}
              className="w-9 h-9 shrink-0 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center transition-colors"
            >
              <RefreshCw size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => setShowNewModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus size={15} />
              New Booking
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-amber-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Pending
              </p>
              <p className="text-xl font-semibold text-slate-800">
                {pendingCount}
              </p>
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle size={16} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Confirmed
              </p>
              <p className="text-xl font-semibold text-slate-800">
                {confirmedCount}
              </p>
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <XCircle size={16} className="text-red-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Cancelled
              </p>
              <p className="text-xl font-semibold text-slate-800">
                {cancelledCount}
              </p>
            </div>
          </div>
        </div>

        {/* Search + filter */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-3 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearch(searchInput)
              }}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-3 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => setSearch(searchInput)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-colors"
          >
            Search
          </button>

          {/* Status Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-9 pr-8 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Service Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              disabled={servicesLoading}
              className="appearance-none w-full sm:w-auto pl-9 pr-8 py-2.5 bg-[#f4f8ff] border border-emerald-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400 disabled:opacity-60"
            >
              <option value="">
                {servicesLoading ? "Loading services…" : "All services"}
              </option>

              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <Stethoscope
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {fetchError && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={15} />
            {fetchError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Date & Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td colSpan={6} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))}

                {!isLoading && safeBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Stethoscope
                        size={28}
                        className="text-slate-300 mx-auto mb-2"
                      />
                      <p className="text-slate-400 text-sm">
                        No bookings found.
                      </p>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  safeBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-[#f9fbff] transition-colors"
                    >
                      <td className="px-3 sm:px-5 py-3.5">
                        <p className="font-medium text-slate-800 text-sm">
                          {b.name ?? "—"}
                        </p>
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Mail size={11} className="text-emerald-400" />
                            {b.email ?? "—"}
                          </span>
                          {b.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone size={11} className="text-emerald-400" />
                              {b.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3.5 text-slate-600">
                        {formatService(b)}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-emerald-400" />
                            {b.booking_date ? formatDate(b.booking_date) : "—"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} className="text-emerald-400" />
                            {b.booking_date ? formatTime(b.booking_date) : "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        <div className="flex items-center justify-start sm:justify-end gap-1.5">
                          <button
                            onClick={() => setViewBooking(b)}
                            title="View"
                            className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => openActionModal("approve", b)}
                                title="Approve"
                                className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => openActionModal("reject", b)}
                                title="Reject"
                                className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteTarget(b)}
                            title="Delete"
                            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3.5 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing {meta.from}–{meta.to} of {meta.total}
              </p>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} className="text-slate-500" />
                </button>
                <span className="text-xs text-slate-500 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} className="text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <NewBookingModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={fetchBookings}
        token={token}
        services={services}
        servicesLoading={servicesLoading}
      />

      <ViewModal booking={viewBooking} onClose={() => setViewBooking(null)} />

      <ActionModal
        modal={actionModal}
        onClose={() =>
          setActionModal({
            open: false,
            type: null,
            booking: null,
            notes: "",
            submitting: false,
          })
        }
        onSubmit={handleActionSubmit}
        onChange={(v) => setActionModal((p) => ({ ...p, notes: v }))}
      />

      <ConfirmDeleteDialog
        booking={deleteTarget}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}
