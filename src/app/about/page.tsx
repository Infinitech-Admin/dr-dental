"use client"
import { useRef, useEffect, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
  MapPin,
  Stethoscope,
  Award,
  Microscope,
  Layers,
  Smile,
  GraduationCap,
  TrendingUp,
  Heart,
  Flag,
  Navigation,
  Clock,
} from "lucide-react"
import missionImage from "@/assets/exterior-5.jpg"
import vissionImage from "@/assets/image.jpg"

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    desc: "Honest recommendations and treatment plans built around what you actually need.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    desc: "Every procedure held to a precision standard, using modern techniques and equipment maintained to the highest level.",
  },
  {
    icon: HeartHandshake,
    title: "Compassion",
    desc: "Dental visits can be stressful. We create a calm, judgment-free space where every patient feels genuinely cared for.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Proud to serve Davao City, Tagum, Bajada, Panabo, General Santos, and Digos — getting to know the families who trust us with their care.",
  },
]

const goals = [
  {
    icon: Stethoscope,
    title: "Deliver Quality Dental Care",
    desc: "To provide comprehensive and personalized dental services that address the unique oral health needs of every patient.",
  },
  {
    icon: Award,
    title: "Become a Leading Dental Brand",
    desc: "To establish Dr. Dental Care Center as a trusted and recognized name in dentistry, known for professionalism, quality care, innovation, and excellent patient experiences.",
  },
  {
    icon: Microscope,
    title: "Advance Through Modern Dentistry",
    desc: "To continuously improve our services by adopting modern dental technologies, techniques, equipment, and practices that support quality and efficient patient care.",
  },
  {
    icon: Layers,
    title: "Provide Comprehensive Dental Services",
    desc: "To offer a wide range of preventive, general, cosmetic, restorative, orthodontic, and specialized dental treatments within the Dr. Dental Care Center network.",
  },
  {
    icon: Smile,
    title: "Create an Exceptional Patient Experience",
    desc: "To provide a welcoming, comfortable, and professional environment where every patient feels heard, respected, informed, and cared for.",
  },
  {
    icon: GraduationCap,
    title: "Build a Strong Team of Dental Professionals",
    desc: "To continuously develop our dentists, specialists, and team members through professional growth, collaboration, and a shared commitment to excellence.",
  },
  {
    icon: TrendingUp,
    title: "Expand with Purpose",
    desc: "To strategically grow Dr. Dental Care Center and make quality dental services accessible to more patients and communities while maintaining consistent standards across all branches.",
  },
  {
    icon: Heart,
    title: "Build Lasting Trust",
    desc: "To develop long-term relationships with our patients through ethical practice, clear communication, professionalism, and genuine care.",
  },
]

// Branch expansion milestones, from the company's development history
const milestones = [
  {
    year: "December 2019",
    place: "Davao City",
    note: "Our first clinic opens in Davao City, marking the beginning of the Dr. Dental Care Center journey.",
  },
  {
    year: "March 2024",
    place: "Tagum City",
    note: "Our first expansion beyond Davao City, bringing comprehensive dental care to more communities in Davao del Norte.",
  },
  {
    year: "November 2024",
    place: "Bajada, Davao City",
    note: "A new Davao City branch opens, making quality and accessible dental care more convenient for patients.",
  },
  {
    year: "August 2025",
    place: "Panabo City",
    note: "Continued expansion across Davao del Norte, bringing Dr. Dental's services closer to more patients.",
  },
  {
    year: "December 2025",
    place: "General Santos City",
    note: "Expanded into Southern Mindanao with a new branch in General Santos City.",
  },
  {
    year: "August 2026",
    place: "Digos City",
    note: "Continued regional growth with a new branch serving patients and communities in Davao del Sur.",
  },
  {
    year: "September 2026",
    place: "Toril, Davao City",
    note: "A new Toril branch will further strengthen our presence and accessibility within Davao City and surrounding communities.",
  },
]

// Time elapsed between consecutive branches — small road-sign captions
// along the route, one shorter than milestones.length.
const gapLabels = [
  "4 years later",
  "8 months later",
  "9 months later",
  "4 months later",
  "8 months later",
  "1 month later",
]

// Shared accent — a vibrant green used for highlights, icons, and dividers
const ACCENT = "#3D9A63"
const ACCENT_LIGHT = "#7ED9A0"

// Milestones are dated by month, so "is this open yet" is decided at
// month granularity against the real current date — not hardcoded.
// A branch is "upcoming" only once its month is strictly after the
// current month; the same month as today counts as already open.
function parseMonthYear(label: string): Date {
  const [monthName, yearStr] = label.split(" ")
  const month = new Date(`${monthName} 1, 2000`).getMonth()
  return new Date(Number(yearStr), month, 1)
}

function useMilestoneStatus() {
  const [today] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const upcoming = milestones.map((m) => parseMonthYear(m.year) > today)
  // "Newest branch" = the most recent one that has actually opened,
  // not just the last item in the array.
  let latestOpenIndex = -1
  upcoming.forEach((isUpcoming, i) => {
    if (!isUpcoming) latestOpenIndex = i
  })

  return { upcoming, latestOpenIndex }
}

// ── Road-journey timeline ────────────────────────────────────────────
// Row height must stay fixed so the hand-authored road path lines up
// exactly with each marker's row.
const ROW_H = 240
const ROAD_W = 220
const X_LEFT = 60
const X_RIGHT = 160
const TOP_PAD = 50

function buildRoad(n: number) {
  const pts = Array.from({ length: n }, (_, i) => ({
    x: i % 2 === 0 ? X_LEFT : X_RIGHT,
    y: TOP_PAD + i * ROW_H,
  }))
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const midY = (p0.y + p1.y) / 2
    d += ` C${p0.x},${midY} ${p1.x},${midY} ${p1.x},${p1.y}`
  }
  return { d, pts, height: TOP_PAD * 2 + (n - 1) * ROW_H }
}

// Tracks which stop the traveling pin is currently nearest to. Shared
// by the HUD readout and the road markers so both stay in lockstep —
// a marker only lights up once the HUD agrees you've reached it.
function useCurrentStopIndex(progress: MotionValue<number>) {
  const [index, setIndex] = useState(0)
  useMotionValueEvent(progress, "change", (v) => {
    const clamped = Math.min(1, Math.max(0, v))
    const next = Math.round(clamped * (milestones.length - 1))
    setIndex((prev) => (next !== prev ? next : prev))
  })
  return index
}

// Whether `ref`'s element currently has any part on screen. Drives the
// HUD's visibility directly from scroll position rather than CSS
// `position: sticky` — sticky is bounded by its own containing block,
// so it inevitably runs out of room and detaches near the end of a
// long section (and can silently break under an ancestor with a CSS
// transform, which several Framer Motion elements on this page use).
// A fixed-position element toggled by real scroll math has neither
// problem: it can stay pinned for the section's entire length.
function useIsSectionInView(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const [active, setActive] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > 0 && v < 1
    setActive((prev) => (prev !== next ? next : prev))
  })
  return active
}

// The pin that travels along the curve as the user scrolls — reads
// getPointAtLength off the actual rendered path, so it always sits
// exactly on the road rather than approximating with keyframes.
function TravelingPin({
  pathRef,
  progress,
}: {
  pathRef: React.RefObject<SVGPathElement | null>
  progress: MotionValue<number>
}) {
  const totalLen = useRef(0)

  useEffect(() => {
    if (pathRef.current) totalLen.current = pathRef.current.getTotalLength()
  }, [pathRef])

  const cx = useTransform(progress, (v) => {
    const p = pathRef.current
    if (!p || !totalLen.current) return X_LEFT
    return p.getPointAtLength(v * totalLen.current).x
  })
  const cy = useTransform(progress, (v) => {
    const p = pathRef.current
    if (!p || !totalLen.current) return TOP_PAD
    return p.getPointAtLength(v * totalLen.current).y
  })

  return (
    <>
      <motion.circle cx={cx} cy={cy} r={12} fill={ACCENT} fillOpacity={0.18} />
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        fill={ACCENT_LIGHT}
        stroke="#0F3D2E"
        strokeWidth={2}
      />
    </>
  )
}

function MilestoneCard({
  m,
  align,
  tag,
  visited,
}: {
  m: (typeof milestones)[number]
  align: "left" | "right"
  tag?: "start" | "latest" | "upcoming"
  visited?: boolean
}) {
  return (
    <div
      className={align === "right" ? "ml-auto" : ""}
      style={{
        opacity: visited === false ? 0.55 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      {tag === "start" && (
        <span
          className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ background: "rgba(61,154,99,0.12)", color: "#2F6B48" }}
        >
          <Flag size={10} /> Where it started
        </span>
      )}
      {tag === "latest" && (
        <span
          className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ background: ACCENT, color: "#F0FDF4" }}
        >
          <Sparkles size={10} /> Newest branch
        </span>
      )}
      {tag === "upcoming" && (
        <span
          className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] border"
          style={{
            background: "#FFFFFF",
            color: "#2F6B48",
            borderColor: ACCENT,
          }}
        >
          <Clock size={10} /> Opening Soon
        </span>
      )}
      <span
        className="block font-serif text-2xl lg:text-3xl leading-none"
        style={{ color: ACCENT }}
      >
        {m.year}
      </span>
      <h3
        className="mt-2 text-lg lg:text-xl font-semibold"
        style={{ color: "#0F3D2E" }}
      >
        {m.place}
      </h3>
      <p
        className="max-w-sm mt-2 text-sm leading-6"
        style={{ color: "#4B6B5C" }}
      >
        {m.note}
      </p>
    </div>
  )
}

// A small GPS-style readout that tracks scroll progress — "Stop 3 of 7,
// Bajada, Davao City" — with a thin progress bar underneath. This is
// the thing that makes the section read as a live journey rather than
// a static illustration. NOTE: for the sticky positioning to actually
// hold while scrolling, this must be rendered as a child of the same
// tall scroll container as the road itself — not a short wrapper div
// of its own (that was the earlier bug: a `sticky` element can only
// stay pinned for as long as its own containing block is on screen).
function TripHUD({
  index,
  progress,
}: {
  index: number
  progress: MotionValue<number>
}) {
  const barScale = useTransform(progress, [0, 1], [0, 1])
  const m = milestones[index]

  return (
    <div
      className="flex w-fit max-w-[92vw] items-center gap-2 sm:gap-3 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_8px_24px_rgba(15,61,46,0.12)] border"
      style={{ borderColor: "rgba(61,154,99,0.25)" }}
    >
      <Navigation
        size={13}
        style={{ color: ACCENT }}
        className="flex-shrink-0"
      />
      <span
        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap"
        style={{ color: "#2F6B48" }}
      >
        Stop {index + 1}/{milestones.length}
      </span>
      <span
        className="hidden sm:inline text-sm font-medium truncate max-w-[140px]"
        style={{ color: "#0F3D2E" }}
      >
        {m.place}
      </span>
      <span className="text-xs whitespace-nowrap" style={{ color: "#4B6B5C" }}>
        {m.year}
      </span>
      <div
        className="ml-1 h-1 w-10 sm:w-14 rounded-full overflow-hidden flex-shrink-0"
        style={{ background: "rgba(61,154,99,0.15)" }}
      >
        <motion.div
          className="h-full rounded-full origin-left"
          style={{ background: ACCENT, scaleX: barScale }}
        />
      </div>
    </div>
  )
}

function DesktopRoad() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.8", "end 0.35"],
  })
  const currentIndex = useCurrentStopIndex(scrollYProgress)
  const isActive = useIsSectionInView(wrapRef)
  const { upcoming, latestOpenIndex } = useMilestoneStatus()
  const { d, pts, height } = buildRoad(milestones.length)

  return (
    <div ref={wrapRef} className="hidden lg:block relative">
      {/* Fixed, not sticky — see useIsSectionInView for why. Stays on
          screen for as long as any part of the road is in view. */}
      {isActive && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30">
          <TripHUD index={currentIndex} progress={scrollYProgress} />
        </div>
      )}

      <div className="relative pt-16">
        <svg
          width={ROAD_W}
          height={height}
          viewBox={`0 0 ${ROAD_W} ${height}`}
          className="absolute left-1/2 -translate-x-1/2 top-0"
          fill="none"
        >
          <path d={d} stroke="#CFE7D9" strokeWidth={10} strokeLinecap="round" />
          <path
            d={d}
            stroke="#FFFFFF"
            strokeWidth={1.5}
            strokeDasharray="6 10"
            strokeLinecap="round"
            opacity={0.9}
          />
          <motion.path
            ref={pathRef}
            d={d}
            stroke={ACCENT}
            strokeWidth={4}
            strokeLinecap="round"
            style={{ pathLength: scrollYProgress }}
          />
          {pts.map((p, i) => {
            const isLast = i === pts.length - 1
            const visited = i <= currentIndex
            return (
              <g key={i}>
                {isLast && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={16}
                    fill="none"
                    stroke={ACCENT_LIGHT}
                    strokeWidth={2}
                    animate={{ r: [12, 20, 12], opacity: [0.7, 0, 0.7] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={9}
                  fill={visited ? ACCENT : "#F3FBF6"}
                  stroke={ACCENT}
                  strokeWidth={2}
                  style={{ transition: "fill 0.35s ease" }}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={700}
                  fill={visited ? "#F0FDF4" : "#0F3D2E"}
                  style={{ transition: "fill 0.35s ease" }}
                >
                  {i + 1}
                </text>
              </g>
            )
          })}
          <TravelingPin pathRef={pathRef} progress={scrollYProgress} />
        </svg>

        {/* interval captions — time elapsed between stops, like small
          distance markers along a highway */}
        {gapLabels.map((label, i) => {
          const midY = (pts[i].y + pts[i + 1].y) / 2
          return (
            <div
              key={label + i}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-dashed px-2.5 py-1 text-[10px] font-medium"
              style={{
                top: midY,
                borderColor: "rgba(61,154,99,0.35)",
                color: "#4B6B5C",
                background: "#F3FBF6",
              }}
            >
              {label}
            </div>
          )
        })}

        <div className="relative z-10">
          {milestones.map((m, i) => {
            const isLeftMarker = i % 2 === 0
            const visited = i <= currentIndex
            const tag: "start" | "latest" | "upcoming" | undefined =
              i === 0
                ? "start"
                : upcoming[i]
                  ? "upcoming"
                  : i === latestOpenIndex
                    ? "latest"
                    : undefined
            return (
              <motion.div
                key={m.place}
                {...fade}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                className="grid items-center"
                style={{
                  gridTemplateColumns: `1fr ${ROAD_W}px 1fr`,
                  minHeight: ROW_H,
                }}
              >
                <div className={isLeftMarker ? "" : "text-right pr-6"}>
                  {!isLeftMarker && (
                    <MilestoneCard
                      m={m}
                      align="right"
                      visited={visited}
                      tag={tag}
                    />
                  )}
                </div>
                <div />
                <div className={isLeftMarker ? "pl-6" : ""}>
                  {isLeftMarker && (
                    <MilestoneCard
                      m={m}
                      align="left"
                      visited={visited}
                      tag={tag}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MobileRoad() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.85", "end 0.4"],
  })
  const currentIndex = useCurrentStopIndex(scrollYProgress)
  const isActive = useIsSectionInView(wrapRef)
  const { upcoming, latestOpenIndex } = useMilestoneStatus()

  const [dotY, setDotY] = useState<number[]>([])
  const [totalHeight, setTotalHeight] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!listRef.current) return
      const containerTop = listRef.current.getBoundingClientRect().top
      const ys = itemRefs.current.map((el) => {
        if (!el) return 0
        const r = el.getBoundingClientRect()
        return r.top - containerTop + r.height / 2
      })
      setDotY(ys)
      setTotalHeight(listRef.current.offsetHeight)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (listRef.current) ro.observe(listRef.current)
    itemRefs.current.forEach((el) => el && ro.observe(el))
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  const topPad = 8
  const bottomPad = 8
  const height = Math.max(totalHeight, 1)
  const roadX = 16
  const first = dotY[0] ?? topPad
  const last = dotY[dotY.length - 1] ?? height - bottomPad
  const d = dotY.length
    ? `M${roadX},${first} L${roadX},${last}`
    : `M${roadX},${topPad} L${roadX},${height - bottomPad}`

  // NOTE: no horizontal padding on wrapRef anymore — the road (SVG)
  // is positioned at the container's true left-0, and it's the card
  // list (`listRef`) that gets pushed right with its own padding.
  // Padding on wrapRef didn't reserve any space for the road, since
  // the SVG's absolute-position ancestor is the child `pt-14` div,
  // not wrapRef — so left-0 landed at the same x as the cards.
  return (
    <div ref={wrapRef} className="lg:hidden relative">
      {isActive && (
        <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30 px-2">
          <TripHUD index={currentIndex} progress={scrollYProgress} />
        </div>
      )}

      <div className="relative pt-14">
        <svg
          width={40}
          height={height}
          viewBox={`0 0 40 ${height}`}
          className="absolute left-0 top-0"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d={d} stroke="#CFE7D9" strokeWidth={8} strokeLinecap="round" />
          <path
            d={d}
            stroke="#FFFFFF"
            strokeWidth={1.2}
            strokeDasharray="5 8"
            opacity={0.9}
          />
          <motion.path
            ref={pathRef}
            d={d}
            stroke={ACCENT}
            strokeWidth={3.5}
            strokeLinecap="round"
            style={{ pathLength: scrollYProgress }}
          />
          {milestones.map((_, i) => {
            const y = dotY[i] ?? topPad
            const visited = i <= currentIndex
            return (
              <circle
                key={i}
                cx={roadX}
                cy={y}
                r={6}
                fill={visited ? ACCENT : "#F3FBF6"}
                stroke={ACCENT}
                strokeWidth={1.5}
                style={{ transition: "fill 0.35s ease, cy 0.2s ease" }}
              />
            )
          })}
          {dotY.length > 0 && (
            <TravelingPin pathRef={pathRef} progress={scrollYProgress} />
          )}
        </svg>

        {/* pl-10/sm:pl-12 reserves the gutter the road actually lives in */}
        <div ref={listRef} className="space-y-8 sm:space-y-10 pl-10 sm:pl-12">
          {milestones.map((m, i) => {
            const visited = i <= currentIndex
            const tag: "start" | "latest" | "upcoming" | undefined =
              i === 0
                ? "start"
                : upcoming[i]
                  ? "upcoming"
                  : i === latestOpenIndex
                    ? "latest"
                    : undefined
            return (
              <motion.div
                key={m.place}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative"
                style={{
                  opacity: visited ? 1 : 0.55,
                  transition: "opacity 0.4s ease",
                }}
              >
                {tag === "start" && (
                  <span
                    className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{
                      background: "rgba(61,154,99,0.12)",
                      color: "#2F6B48",
                    }}
                  >
                    <Flag size={10} /> Where it started
                  </span>
                )}
                {tag === "latest" && (
                  <span
                    className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{ background: ACCENT, color: "#F0FDF4" }}
                  >
                    <Sparkles size={10} /> Newest branch
                  </span>
                )}
                {tag === "upcoming" && (
                  <span
                    className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] border"
                    style={{
                      background: "#FFFFFF",
                      color: "#2F6B48",
                      borderColor: ACCENT,
                    }}
                  >
                    <Clock size={10} /> Opening Soon
                  </span>
                )}
                <span
                  className="block font-serif text-xl sm:text-2xl leading-none"
                  style={{ color: ACCENT }}
                >
                  {m.year}
                </span>
                <h3
                  className="mt-2 text-base sm:text-lg font-semibold"
                  style={{ color: "#0F3D2E" }}
                >
                  {m.place}
                </h3>
                <p
                  className="mt-2 text-sm leading-6 max-w-xl pr-1"
                  style={{ color: "#4B6B5C" }}
                >
                  {m.note}
                </p>

                {i < gapLabels.length && (
                  <div
                    className="mt-4 inline-flex items-center rounded-full border border-dashed px-2.5 py-1 text-[10px] font-medium"
                    style={{
                      borderColor: "rgba(61,154,99,0.35)",
                      color: "#4B6B5C",
                      background: "#F3FBF6",
                    }}
                  >
                    {gapLabels[i]}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OurStorySection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(135deg, #F3FBF6 0%, #E1F5E9 55%, #F7FBF8 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fade}
          className="max-w-3xl mx-auto text-center mb-14 sm:mb-16 md:mb-20"
        >
          <span
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.3em] font-medium mb-4 sm:mb-5 px-3 sm:px-4 py-2 rounded-full"
            style={{ background: "rgba(61,154,99,0.12)", color: "#2F6B48" }}
          >
            <MapPin size={12} />
            Our Story
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12]"
            style={{ color: "#0F3D2E" }}
          >
            The Road So Far —
            <span style={{ color: ACCENT }}> One Branch at a Time</span>
          </h2>
          <p
            className="max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-[15px] md:text-base leading-6 sm:leading-7"
            style={{ color: "#4B6B5C" }}
          >
            What began in Davao City in 2019 has grown into a trusted dental
            network serving communities across Mindanao. Scroll to follow the
            route — each stop is a community we now call home.
          </p>
        </motion.div>

        <DesktopRoad />
        <MobileRoad />

        <motion.div
          {...fade}
          className="relative max-w-3xl mx-auto mt-14 sm:mt-16 md:mt-20 lg:mt-24 pt-8 sm:pt-10 text-center"
          style={{ borderTop: "1px solid rgba(61,154,99,0.25)" }}
        >
          <span
            className="font-serif text-2xl sm:text-3xl"
            style={{ color: ACCENT }}
          >
            Growing Through Trust
          </span>
          <p
            className="mt-4 sm:mt-5 text-sm sm:text-[15px] md:text-base leading-6 sm:leading-7"
            style={{ color: "#4B6B5C" }}
          >
            From one clinic in 2019 to a growing network across Mindanao, Dr.
            Dental Care Center continues to grow through the trust of the
            patients and communities we serve. With approximately 150,000
            patients served, our journey remains focused on delivering quality
            care, modern dentistry, professional expertise, and a warm,
            patient-centered experience.
          </p>
          <p
            className="mt-3 sm:mt-4 text-sm sm:text-[15px] leading-6 sm:leading-7"
            style={{ color: "#4B6B5C" }}
          >
            As we expand to new communities, our commitment remains the same:
            making comprehensive and modern dental care accessible to more
            families across Mindanao.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <div
      className="font-sans overflow-x-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* ── Hero — Green ── */}
      <section
        className="relative pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-16 md:pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F3D2E 0%, #14532D 55%, #1B6B45 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[700px] h-[280px] sm:h-[400px] bg-emerald-400/10 rounded-full blur-[100px] sm:blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[60vw] max-w-[400px] h-[280px] sm:h-[400px] bg-emerald-300/10 rounded-full blur-[80px] sm:blur-[100px]" />
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
                  stroke="#D1FAE5"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fade}>
            <span
              className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-4 sm:mb-5 px-3 sm:px-4 py-1.5 rounded-full border"
              style={{
                color: ACCENT_LIGHT,
                borderColor: "rgba(126,217,160,0.35)",
                background: "rgba(126,217,160,0.08)",
              }}
            >
              About Us · Since 2019
            </span>

            <h1
              className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 leading-tight px-1"
              style={{ color: "#F0FDF4" }}
            >
              Every Smile Deserves a Chance
            </h1>

            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div
                className="h-px w-10 sm:w-16"
                style={{
                  background: `linear-gradient(to right, transparent, ${ACCENT_LIGHT})`,
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: ACCENT_LIGHT }}
              />
              <div
                className="h-px w-10 sm:w-16"
                style={{
                  background: `linear-gradient(to left, transparent, ${ACCENT_LIGHT})`,
                }}
              />
            </div>

            <p
              className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2"
              style={{ color: "#CBE4D6" }}
            >
              Since opening our first clinic in Davao City in December 2019, Dr.
              Dental Care Center has grown into a trusted network across
              Mindanao — serving approximately 150,000 patients and counting,
              one smile at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission — Light Green ── */}
      <section
        className="py-16 sm:py-20 md:py-24"
        style={{
          background: "linear-gradient(135deg, #F3FBF6 0%, #E1F5E9 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-14 items-center">
            <motion.div {...fade} className="order-2 md:order-1">
              <span
                className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4 px-3 py-1 rounded-full"
                style={{ background: "rgba(61,154,99,0.12)", color: "#2F6B48" }}
              >
                <Target size={12} /> Our Mission
              </span>
              <h2
                className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 leading-snug"
                style={{ color: "#0F3D2E" }}
              >
                Comprehensive, Compassionate, and Modern Dental Care
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4"
                style={{ color: "#4B6B5C" }}
              >
                Our mission is to provide comprehensive, modern, and
                personalized dental care that promotes lifelong oral health and
                inspires confidence in every smile.
              </p>
              <p
                className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4"
                style={{ color: "#4B6B5C" }}
              >
                We are committed to combining skilled dental professionals,
                modern technology, quality services, and compassionate care to
                create a comfortable and trusted experience for every patient.
              </p>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "#4B6B5C" }}
              >
                As we continue to grow, we strive to maintain consistent
                standards of professionalism, integrity, innovation, and
                patient-centered care across all Dr. Dental Care Center
                branches.
              </p>
            </motion.div>

            <motion.div
              {...fade}
              className="order-1 md:order-2 rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(61,154,99,0.25)",
                boxShadow: "0 12px 40px rgba(15,61,46,0.12)",
              }}
            >
              <Image
                src={missionImage}
                alt="Our mission — patient-centered dental care"
                width={700}
                height={520}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Vision — White ── */}
      <section
        className="py-16 sm:py-20 md:py-24"
        style={{ background: "#FFFFFF" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-14 items-center">
            <motion.div
              {...fade}
              className="rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(15,61,46,0.1)",
                boxShadow: "0 12px 40px rgba(15,61,46,0.08)",
              }}
            >
              <Image
                src={vissionImage}
                alt="Our vision — the future of dental care in Mindanao"
                width={700}
                height={520}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div {...fade}>
              <span
                className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4 px-3 py-1 rounded-full"
                style={{ background: "rgba(61,154,99,0.12)", color: "#2F6B48" }}
              >
                <Eye size={12} /> Our Vision
              </span>
              <h2
                className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 leading-snug"
                style={{ color: "#0F3D2E" }}
              >
                To become a leading and trusted dental care brand
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4"
                style={{ color: "#5B6B65" }}
              >
                To become a leading and trusted dental care brand, recognized
                for excellence in modern dentistry, comprehensive dental
                services, innovation, and exceptional patient care.
              </p>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "#5B6B65" }}
              >
                We envision Dr. Dental Care Center as a growing dental network
                that makes quality oral healthcare more accessible while
                continuously raising the standard of dental care and patient
                experience in the communities we serve.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Story / Milestones — Road Journey ── */}
      <OurStorySection />

      {/* ── Values — Green ── */}
      <section
        className="py-16 sm:py-20 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #0F3D2E 0%, #14532D 55%, #1B6B45 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fade}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16"
          >
            <span
              className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-4 sm:mb-5 px-3 sm:px-4 py-1.5 rounded-full border"
              style={{
                color: ACCENT_LIGHT,
                borderColor: "rgba(126,217,160,0.35)",
                background: "rgba(126,217,160,0.08)",
              }}
            >
              Our Values
            </span>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight"
              style={{ color: "#F0FDF4" }}
            >
              What Guides Every Visit
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  className="h-full rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(126,217,160,0.4)"
                    e.currentTarget.style.borderColor = "rgba(126,217,160,0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                  }}
                >
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                    }}
                  >
                    <v.icon size={20} color="#0F3D2E" />
                  </div>
                  <h3
                    className="font-serif text-base sm:text-lg mb-2"
                    style={{ color: "#F0FDF4" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#CBE4D6" }}
                  >
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Goals — White ── */}
      <section
        className="py-16 sm:py-20 md:py-24"
        style={{ background: "#FFFFFF" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fade}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16"
          >
            <span
              className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4 px-3 py-1 rounded-full"
              style={{ background: "rgba(61,154,99,0.12)", color: "#2F6B48" }}
            >
              <Target size={12} /> Our Goals
            </span>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl leading-snug"
              style={{ color: "#0F3D2E" }}
            >
              What We&apos;re Working Toward
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {goals.map((g, i) => (
              <motion.div
                key={g.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex gap-3 sm:gap-4 rounded-xl sm:rounded-2xl p-5 sm:p-6"
                style={{
                  background:
                    "linear-gradient(135deg, #F3FBF6 0%, #E1F5E9 100%)",
                  border: "1px solid rgba(15,61,46,0.06)",
                }}
              >
                <div className="flex-shrink-0">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                    }}
                  >
                    <g.icon size={20} color="#0F3D2E" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      className="font-serif text-sm"
                      style={{ color: ACCENT }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="font-serif text-base sm:text-lg leading-snug"
                      style={{ color: "#0F3D2E" }}
                    >
                      {g.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#4B6B5C" }}
                  >
                    {g.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — Always Green ── */}
      <section
        className="py-16 sm:py-20 md:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F3D2E 0%, #14532D 55%, #1B6B45 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(126,217,160,0.1) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-8 left-1/4 w-2 h-2 rounded-full"
            style={{ background: "rgba(126,217,160,0.5)" }}
          />
          <div
            className="absolute bottom-12 right-1/3 w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(126,217,160,0.4)" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full"
            style={{ background: "rgba(126,217,160,0.5)" }}
          />
        </div>

        <motion.div
          {...fade}
          className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div
              className="h-px w-8 sm:w-12"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT_LIGHT})`,
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: ACCENT_LIGHT }}
            />
            <div
              className="h-px w-8 sm:w-12"
              style={{
                background: `linear-gradient(to left, transparent, ${ACCENT_LIGHT})`,
              }}
            />
          </div>

          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 leading-tight"
            style={{ color: "#F0FDF4" }}
          >
            Let&apos;s Take Care of You
          </h2>
          <p
            className="mb-8 sm:mb-10 text-sm sm:text-base px-2"
            style={{ color: "#CBE4D6" }}
          >
            Book a consultation at the branch nearest you, and let&apos;s talk
            about what your smile needs — no rush, no pressure.
          </p>

          <Link
            href="/book"
            className="inline-block w-full sm:w-auto px-4 sm:px-0"
          >
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                color: "#0F3D2E",
                boxShadow: "0 4px 24px rgba(61,154,99,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 32px rgba(61,154,99,0.55)"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 24px rgba(61,154,99,0.35)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Book Free Consultation
              <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
