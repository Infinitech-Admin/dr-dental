"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import heroBg from "@/assets/hero-bg.jpg"
import branchBg from "@/assets/branch-bg.jpg"
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
  Quote,
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
    <div className="bg-[#0B3D26]">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* mesh gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(90% 80% at 85% 15%, #CFF3D6 0%, transparent 60%), linear-gradient(160deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
          }}
        />
        {/* hero background image, faded into the mesh */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <Image src={heroBg} alt="" fill priority className="object-cover" />
        </div>
        {/* animated blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 right-[-10%] w-[650px] h-[650px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(31,149,82,0.45), rgba(167,232,107,0.15) 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.5), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#0B3D26 1px, transparent 1px), linear-gradient(90deg, #0B3D26 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fade}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#1F9552]/25 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F9552] to-[#A7E86B] animate-pulse" />
              <p className="text-[#145C36] text-xs font-semibold uppercase tracking-[0.25em]">
                Dr. Dental Care Center
              </p>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
              <span className="text-[#0B2E1C]">Quality Dental Care</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, #145C36 0%, #1F9552 40%, #4FC97B 70%, #A7E86B 100%)",
                }}
              >
                You Can Trust
              </span>
            </h1>

            <p className="text-[#2E4E38] text-lg leading-relaxed max-w-lg mb-4">
              Providing reliable and compassionate dental care for over 6 years.
              Our team is dedicated to helping every patient achieve a healthier
              smile through personalized treatments and modern dental solutions.
            </p>

            <p className="text-[#2E4E38]/80 text-lg leading-relaxed max-w-lg mb-10">
              Your journey to better oral health starts with a dental team that
              cares, listens, and puts your comfort first.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/book">
                <Button
                  size="lg"
                  className="relative text-white font-medium px-8 border-0 shadow-[0_10px_30px_-8px_rgba(31,149,82,0.6)] hover:shadow-[0_14px_38px_-6px_rgba(31,149,82,0.75)] hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, #1F9552 0%, #2FAE63 55%, #4FC97B 100%)",
                  }}
                >
                  Book Appointment <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>

              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-[#1F9552]/40 text-[#145C36] hover:bg-white hover:border-[#1F9552] font-medium px-8 transition-all"
                >
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div
              className="absolute -inset-3 rounded-[2rem] blur-sm opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #1F9552, #A7E86B, #145C36)",
              }}
            />
            <div className="relative rounded-[1.75rem] overflow-hidden border-4 border-white shadow-2xl shadow-[#0B3D26]/20">
              <Image
                src={equipment}
                alt="Dr. Dental Care Center equipment"
                width={600}
                height={450}
                className="w-full h-auto"
              />
            </div>

            {/* floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-[#C8E6C9] flex items-center gap-3"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundImage: "linear-gradient(135deg, #1F9552, #4FC97B)",
                }}
              >
                <Smile size={20} className="text-white" />
              </div>
              <div>
                <p className="font-serif text-2xl text-[#0B2E1C] leading-none">
                  {stats[0]?.value ?? "5K+"}
                </p>
                <p className="text-[#4C6B4C] text-xs mt-1">
                  {stats[0]?.label ?? "Patients Treated"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="relative py-14 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(80% 120% at 0% 0%, rgba(79,201,123,0.25), transparent 60%), radial-gradient(80% 120% at 100% 100%, rgba(167,232,107,0.18), transparent 60%), linear-gradient(120deg, #0B3D26, #103F27 50%, #0B3D26)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              {...fade}
              transition={{ delay: i * 0.1 }}
              className="text-center rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 py-6 px-3 hover:bg-white/[0.1] hover:-translate-y-1 transition-all duration-300"
            >
              <p
                className="text-4xl font-bold font-serif bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(120deg, #A7E86B, #4FC97B)",
                }}
              >
                {s.value}
              </p>
              <p className="text-[#CFEAD4] text-sm mt-2 tracking-wide">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Branches ── */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "#F1FAEE" }}
      >
        {/* section background image */}
        <div className="absolute inset-0">
          <Image
            src={branchBg}
            alt=""
            fill
            className="object-cover opacity-50"
          />
        </div>

        <div
          className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full blur-[120px] opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.3), transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#1F9552]/10 border border-[#1F9552]/20">
              <MapPin size={14} className="text-[#145C36]" />
              <p className="text-[#145C36] text-xs font-semibold uppercase tracking-[0.25em]">
                Find Us
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#0B2E1C] mb-4">
              Our Branches
            </h2>
            <p className="text-[#4C6B4C]">
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
                className="group"
              >
                <Card className="relative h-full p-6 bg-white border-[#C8E6C9] overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1F9552]/10 transition-all duration-300">
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-80"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                    }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #1F9552, #4FC97B)",
                      }}
                    >
                      <MapPin size={18} className="text-white" />
                    </div>
                    <span className="text-xs text-[#4C6B4C] pt-2 font-medium">
                      {b.area}
                    </span>
                  </div>

                  <h3 className="text-[#0B2E1C] font-serif text-lg mb-2">
                    {b.name}
                  </h3>

                  <p className="text-[#4C6B4C] text-sm leading-relaxed mb-4 line-clamp-2">
                    {b.address}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2 text-[#4C6B4C] text-xs">
                      <Calendar size={12} />
                      <span>{b.hours}</span>
                    </div>
                    {b.phone && (
                      <div className="flex items-center gap-2 text-[#4C6B4C] text-xs">
                        <Phone size={12} />
                        <span>{b.phone}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={b.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#145C36] text-sm font-semibold hover:gap-2.5 transition-all"
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
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(90% 70% at 100% 0%, rgba(79,201,123,0.22), transparent 55%), radial-gradient(70% 60% at 0% 100%, rgba(167,232,107,0.15), transparent 55%), linear-gradient(160deg, #0B3D26, #0E4A2D 55%, #0B3D26)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...slideLeft} className="relative">
            <div
              className="absolute -inset-3 rounded-[2rem] blur-md opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #4FC97B, #A7E86B, #1F9552)",
              }}
            />
            <div className="relative rounded-[1.75rem] overflow-hidden border-4 border-white/10 shadow-2xl">
              <Image
                src={exterior}
                alt="Dr. Dental Care Center exterior"
                width={600}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <motion.div {...slideRight}>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/15">
              <Sparkles size={14} className="text-[#A7E86B]" />
              <p className="text-[#A7E86B] text-xs font-semibold uppercase tracking-[0.25em]">
                Why Dr. Dental Care Center
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-10 leading-tight">
              Engineered for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(100deg, #A7E86B, #4FC97B)",
                }}
              >
                Excellence
              </span>
            </h2>
            <div className="space-y-2">
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #1F9552, #4FC97B)",
                      boxShadow: "0 8px 20px -6px rgba(79,201,123,0.5)",
                    }}
                  >
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#B9D6C2] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
