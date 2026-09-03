"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image, { type StaticImageData } from "next/image"
import { MoveHorizontal, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────
type Case = {
  id: number
  title: string
  category: "Whitening" | "Veneers" | "Orthodontics" | "Implants" | "Restorative"
  description: string
  before: string | StaticImageData
  after: string | StaticImageData
  note: string
}

const categories = ["All", "Whitening", "Veneers", "Orthodontics", "Implants", "Restorative"] as const

// ── Before/After slider ─────────────────────────────────────────────
function BeforeAfterSlider({
  before,
  after,
  title,
  compact = false,
}: {
  before: string | StaticImageData
  after: string | StaticImageData
  title: string
  compact?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    updateFromClientX(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    updateFromClientX(e.clientX)
  }
  const onPointerUp = () => setDragging(false)

  // Prepend NEXT_PUBLIC_API_URL if the image path starts with /storage or a relative path
  const formatImagePath = (img: string | StaticImageData) => {
    if (typeof img === "string" && img.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    }
    return img
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className={`relative w-full ${compact ? "aspect-[4/3]" : "aspect-video"} overflow-hidden select-none touch-none cursor-ew-resize`}
      style={
        compact
          ? undefined
          : {
              borderRadius: "1rem",
              border: "1px solid rgba(167,232,107,0.25)",
              boxShadow: "0 0 40px 2px rgba(167,232,107,0.1), 0 24px 48px -20px rgba(0,0,0,0.6)",
            }
      }
    >
      {/* Before Layer (Always fully visible underneath) */}
      <div className="absolute inset-0">
        <Image src={formatImagePath(before)} alt={`${title} before treatment`} fill className="object-cover" draggable={false} unoptimized />
        <span className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none z-10">
          Before
        </span>
      </div>

      {/* After Layer (Clipped dynamically by the handle position) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={formatImagePath(after)} alt={`${title} after treatment`} fill className="object-cover" draggable={false} unoptimized />
      </div>

      {/* After Label (Detached from clipping so it displays no matter what) */}
      <span className="absolute bottom-3 right-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#0B3D26] bg-[#A7E86B] rounded-full px-2.5 py-1 pointer-events-none z-10 shadow-md">
        After
      </span>

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-20"
        style={{ left: `${pos}%`, background: "#A7E86B", boxShadow: "0 0 12px 1px rgba(167,232,107,0.7)" }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
          style={{
            width: compact ? 30 : 36,
            height: compact ? 30 : 36,
            background: "linear-gradient(135deg, #D9F2C4, #A7E86B)",
            boxShadow: "0 0 0 3px rgba(11,61,38,0.7), 0 4px 14px rgba(0,0,0,0.4)",
          }}
        >
          <MoveHorizontal size={compact ? 12 : 15} className="text-[#0B3D26]" />
        </div>
      </div>
    </div>
  )
}

// ── Case card ───────────────────────────────────────────────────────
function CaseCard({ c, onExpand, index }: { c: Case; onExpand: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col justify-between"
      style={{
        border: "1px solid rgba(167,232,107,0.18)",
        background: "linear-gradient(135deg, #123D2C, #0F3D2E)",
      }}
    >
      <div className="relative">
        <BeforeAfterSlider before={c.before} after={c.after} title={c.title} compact />

        {/* Expand affordance */}
        <button
          onClick={onExpand}
          aria-label={`View ${c.title} full size`}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[#0B3D26] transition-transform duration-200 hover:scale-110 z-30"
          style={{ background: "rgba(217,242,196,0.9)", backdropFilter: "blur(4px)" }}
        >
          <Maximize2 size={12} />
        </button>

        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#0B3D26] bg-[#A7E86B] rounded-full px-2.5 py-0.5 pointer-events-none z-30">
          {c.category}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-white text-sm sm:text-base font-medium mb-1">{c.title}</h3>
          <p className="text-[#CFEAD4] text-xs leading-relaxed font-light line-clamp-2 mb-2">{c.description}</p>
        </div>
        <p className="text-[#7FA78C] text-[11px] italic">{c.note}</p>
      </div>
    </motion.div>
  )
}

// ── Focused view (modal-style) ─────────────────────────────────────
function FocusedCase({
  c,
  onClose,
  onPrev,
  onNext,
}: {
  c: Case
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(6,20,14,0.92)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0F3D2E] border border-[#A7E86B]/30 p-4 sm:p-6 rounded-2xl shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-10 right-0 text-[#CFEAD4] hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          Close <X size={18} />
        </button>

        <button
          onClick={onPrev}
          aria-label="Previous case"
          className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-12 w-9 h-9 rounded-full flex items-center justify-center text-[#A7E86B] hover:text-white transition-colors z-10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,232,107,0.2)" }}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          aria-label="Next case"
          className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-12 w-9 h-9 rounded-full flex items-center justify-center text-[#A7E86B] hover:text-white transition-colors z-10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,232,107,0.2)" }}
        >
          <ChevronRight size={18} />
        </button>

        <div className="rounded-xl overflow-hidden mb-4">
          <BeforeAfterSlider before={c.before} after={c.after} title={c.title} />
        </div>

        <div className="text-center space-y-1.5">
          <span className="text-[#A7E86B] text-[11px] font-medium uppercase tracking-[0.2em]">
            {c.category}
          </span>
          <h3 className="text-white font-serif text-xl sm:text-2xl">{c.title}</h3>
          <p className="text-[#CFEAD4] text-xs sm:text-sm font-light max-w-lg mx-auto">{c.description}</p>
          <p className="text-[#7FA78C] text-xs italic pt-1">{c.note}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
export default function SmileGalleryPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All")
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [focusedId, setFocusedId] = useState<number | null>(null)

  // Direct fetch from Laravel backend using NEXT_PUBLIC_API_URL
  useEffect(() => {
    async function fetchCases() {
      try {
        const query = filter !== "All" ? `?category=${encodeURIComponent(filter)}` : ""
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cases${query}`, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        })
        if (!res.ok) throw new Error("Failed to load cases")
        const data = await res.json()
        
        const items = Array.isArray(data) ? data : data.data || []
        setCases(items)
      } catch (err) {
        console.error("Error fetching cases:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [filter])

  const focusedIndex = cases.findIndex((c) => c.id === focusedId)
  const focused = focusedIndex >= 0 ? cases[focusedIndex] : null

  const goPrev = () => {
    if (focusedIndex < 0) return
    const prevIndex = (focusedIndex - 1 + cases.length) % cases.length
    setFocusedId(cases[prevIndex].id)
  }
  const goNext = () => {
    if (focusedIndex < 0) return
    const nextIndex = (focusedIndex + 1) % cases.length
    setFocusedId(cases[nextIndex].id)
  }

  return (
    <div style={{ background: "#0B3D26" }}>
      {/* ── Header ── */}
      <section className="relative pt-24 sm:pt-28 pb-10 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(70% 60% at 20% 0%, rgba(79,201,123,0.2), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6" style={{ background: "linear-gradient(90deg, transparent, #A7E86B)" }} />
            <span className="text-[#A7E86B] text-xs font-medium uppercase tracking-[0.3em]">Smile Gallery</span>
            <span className="h-px w-6" style={{ background: "linear-gradient(90deg, #A7E86B, transparent)" }} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-3 leading-tight">
            Real results, real patients
          </h1>
          <p className="text-[#CFEAD4] text-sm sm:text-base font-light leading-relaxed">
            Drag the handle on any case to explore the transformation details.
          </p>
        </div>
      </section>

      {/* ── Filter chips ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const active = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="text-xs px-3.5 py-1.5 rounded-full transition-all duration-200"
                style={
                  active
                    ? { background: "linear-gradient(135deg, #D9F2C4, #A7E86B)", color: "#0B3D26", fontWeight: 600 }
                    : { background: "rgba(255,255,255,0.05)", color: "#CFEAD4", border: "1px solid rgba(167,232,107,0.2)" }
                }
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          <div className="text-center text-[#7FA78C] py-16 text-sm">Loading cases...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {cases.map((c, i) => (
                <CaseCard key={c.id} c={c} index={i} onExpand={() => setFocusedId(c.id)} />
              ))}
            </div>
            {cases.length === 0 && (
              <p className="text-center text-[#7FA78C] py-12 text-sm">No cases in this category yet.</p>
            )}
          </>
        )}
      </section>

      <AnimatePresence>
        {focused && (
          <FocusedCase c={focused} onClose={() => setFocusedId(null)} onPrev={goPrev} onNext={goNext} />
        )}
      </AnimatePresence>
    </div>
  )
}