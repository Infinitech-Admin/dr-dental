"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import equipment from "@/assets/equipment-2.jpg"
import exterior from "@/assets/exterior-2.jpg"
import { BRANCHES } from "@/lib/branches-data"
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  Star,
  Sparkles,
  Smile,
  Heart,
  Zap,
  Loader2,
  GraduationCap,
  Stethoscope,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const slideLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const slideRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Smile,
  Shield,
  Heart,
  Zap,
  Star,
  Award,
  Users,
}

const FALLBACK_ICONS: React.ElementType[] = [
  Sparkles,
  Smile,
  Shield,
  Heart,
  Zap,
  Star,
  Award,
  Users,
]

const CREDENTIAL_ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  Stethoscope,
  Star,
  Award,
}

function CredentialIcon({
  name,
  ...props
}: {
  name: string
  size?: number
  className?: string
}) {
  const Icon = CREDENTIAL_ICON_MAP[name] ?? Award
  return <Icon {...props} />
}

interface Service {
  id: number
  name: string
  description: string
  icon?: string
  price?: number
  duration?: number
  category?: string
}

type Credential = {
  icon: string
  label: string
  value: string
  sub: string
}

type Stat = { value: string; label: string }

type DoctorProfile = {
  name: string
  title: string
  role: string
  bio: string
  quote: string
  location: string
  since_year: string
  image_url: string | null
  credentials: Credential[]
}

type AboutData = {
  stats: Stat[]
  doctor: DoctorProfile | null
}

function normalizeServices(raw: unknown): Service[] {
  if (Array.isArray(raw)) return raw as Service[]
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data as Service[]
    if (Array.isArray(obj.services)) return obj.services as Service[]
  }
  return []
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [about, setAbout] = useState<AboutData | null>(null)

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((raw) => setServices(normalizeServices(raw)))
      .catch(console.error)
      .finally(() => setServicesLoading(false))

    fetch("/api/about", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: AboutData) => setAbout(d))
      .catch(console.error)
  }, [])

  const stats: Stat[] = about?.stats?.length
    ? about.stats
    : [
        { value: "5K+", label: "Patients Treated" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "6+", label: "Years Experience" },
        { value: "10+", label: "Specialists" },
      ]

  const doctor = about?.doctor ?? null

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0B1220] to-[#020617]" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-600/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fade}>
            <p className="text-emerald-400 text-sm uppercase tracking-[0.3em] mb-6">
              Dr. Dental Care Center
            </p>

            <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Quality Dental Care You Can Trust
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-6">
              Providing reliable and compassionate dental care for over 6 years.
              Our team is dedicated to helping every patient achieve a healthier
              smile through personalized treatments and modern dental solutions.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-10">
              Your journey to better oral health starts with a dental team that
              cares, listens, and puts your comfort first.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/book">
                <Button
                  size="lg"
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 font-medium px-8 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all"
                >
                  Book Appointment <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>

              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 font-medium px-8 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all"
                >
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <Image
              src={equipment}
              alt="Dr. Dental Care Center equipment"
              width={600}
              height={450}
              className="rounded-2xl shadow-2xl shadow-emerald-400/5 border border-white/5"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="border-y border-white/5 bg-[#0B1220]/50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              {...fade}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-emerald-400 font-serif">
                {s.value}
              </p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Branches ── */}
      <section className="bg-[#0B1220] py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-400/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-400 text-sm uppercase tracking-[0.3em] mb-3">
              Find Us
            </p>
            <h2 className="font-serif text-4xl text-white mb-4">
              Our Branches
            </h2>
            <p className="text-slate-400">
              {BRANCHES.length} locations across Mindanao, each ready to give
              you the same quality care, closer to home.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES.map((b, i) => (
              <motion.div
                key={b.id}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Card className="h-full p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/[0.07] hover:border-emerald-400/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-500 pt-2">
                      {b.area}
                    </span>
                  </div>

                  <h3 className="text-white font-serif text-lg mb-2">
                    {b.name}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {b.address}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={12} />
                      <span>{b.hours}</span>
                    </div>
                    {b.phone && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Phone size={12} />
                        <span>{b.phone}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={b.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                  >
                    Get Directions <ArrowRight size={14} />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="bg-[#020617] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade}>
            <Image
              src={exterior}
              alt="Dr. Dental Care Center exterior"
              width={600}
              height={450}
              className="rounded-2xl border border-white/5"
            />
          </motion.div>
          <motion.div {...fade} transition={{ delay: 0.2 }}>
            <p className="text-emerald-400 text-sm uppercase tracking-[0.3em] mb-3">
              Why Dr. Dental Care Center
            </p>
            <h2 className="font-serif text-4xl text-white mb-8">
              Engineered for Excellence
            </h2>
            {[
              {
                icon: Award,
                title: "Board-Certified Specialists",
                desc: "Every procedure performed by verified experts with 10+ years of experience.",
              },
              {
                icon: Shield,
                title: "State-of-the-Art Technology",
                desc: "3D imaging, laser systems, and AI-assisted diagnostics for unmatched precision.",
              },
              {
                icon: Users,
                title: "Patient-First Philosophy",
                desc: "Personalized treatment plans designed around your unique goals and comfort.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <item.icon size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
