"use client"

import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import {
  Shield,
  Award,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

import heroBg from "@/assets/hero-bg.jpg"
import branchBg from "@/assets/branch-bg.jpg"
import exterior from "@/assets/exterior-2.jpg"
import { HeroBackground } from "@/components/HeroBackground"

const BranchesMap = dynamic(() => import("../BranchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] rounded-2xl bg-[#E4F7E6] animate-pulse" />
  ),
})

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

const stats = [
  { value: "6+", label: "Years Experience" },
  { value: "150K+", label: "Patients Treated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "10+", label: "Specialists" },
]

const whyChooseUsItems = [
  {
    icon: Award,
    title: "You're in Good Hands",
    desc: "Experienced dental professionals dedicated to giving you thoughtful care and a smile you can feel proud of.",
  },
  {
    icon: Shield,
    title: "Care You Can Trust",
    desc: "Modern technology and careful treatment designed to keep your smile healthy, comfortable, and protected.",
  },
  {
    icon: Users,
    title: "Here for Your Journey",
    desc: "A caring team that listens to your needs and supports you through every step of your smile journey.",
  },
]

export default function Home() {
  return (
    <div className="bg-[#0B3D26]">
      {/* ── Hero Section ── */}
<section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden px-4 sm:px-6 md:px-12 py-20">
  <HeroBackground
    videoSrc="/videos/sm-gensan-opening/hero.mp4"
    fallbackImage={heroBg}
  />

  {/* ── Legibility gradient: dark green left → light/transparent right (Adjusted for mobile readability) ── */}
  <div
    className="absolute inset-0 z-[1] pointer-events-none"
    style={{
      backgroundImage:
        "linear-gradient(90deg, rgba(6,38,23,0.98) 0%, rgba(11,61,38,0.92) 50%, rgba(11,61,38,0.75) 80%, rgba(11,61,38,0.4) 100%)",
    }}
  />
  <div
    className="absolute inset-0 z-[1] pointer-events-none md:hidden"
    style={{
      backgroundImage:
        "linear-gradient(180deg, rgba(6,38,23,0.4) 0%, rgba(6,38,23,0.8) 100%)",
    }}
  />

  {/* ── Futuristic glowing accents (Hidden on very small screens to avoid overflow) ── */}
  <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden hidden sm:block">
    {/* Horizontal scan-line sweeping top to bottom */}
    <motion.div
      animate={{ y: ["0%", "100%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 w-full h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(167,232,107,0.5) 30%, rgba(167,232,107,0.7) 50%, rgba(167,232,107,0.5) 70%, transparent)",
        boxShadow: "0 0 12px 1px rgba(167,232,107,0.5)",
      }}
    />

    {/* Corner brackets, top-left — pushed below nav */}
    <div className="absolute top-28 left-6 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-[#A7E86B]/40 rounded-tl-md" />
    {/* Corner brackets, bottom-left */}
    <div className="absolute bottom-10 left-6 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-[#A7E86B]/25 rounded-bl-md" />

    {/* Thin vertical glow line, far right edge, pulsing */}
    <motion.div
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 right-0 w-px h-full"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(167,232,107,0.5) 40%, rgba(79,201,123,0.5) 60%, transparent)",
        boxShadow: "0 0 20px 2px rgba(167,232,107,0.3)",
      }}
    />
  </div>

  <div className="relative max-w-6xl w-full mx-auto z-10 pt-16 sm:pt-20">
    <div className="max-w-2xl text-left">
      {/* Eyebrow with glowing vertical line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <motion.span
          initial={{ height: 0 }}
          animate={{ height: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-[2px] bg-[#A7E86B]"
          style={{ boxShadow: "0 0 8px 1px rgba(167,232,107,0.8)" }}
        />
        <span className="text-[#A7E86B] text-xs sm:text-sm font-medium uppercase tracking-[0.25em] sm:tracking-[0.35em]">
          Dr. Dental Care Center
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-serif text-3xl sm:text-5xl md:text-7xl text-white mb-2 leading-[1.1] tracking-tight drop-shadow-md"
      >
        Your Journey to a
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="font-serif text-3xl sm:text-5xl md:text-7xl mb-4 leading-[1.1] tracking-tight bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #D9F2C4, #A7E86B 45%, #4FC97B)",
        }}
      >
        Perfect Smile
      </motion.h1>

      {/* Glowing line that draws in under the headline */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "5rem", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="h-[2px] mb-6 sm:mb-8"
        style={{
          background:
            "linear-gradient(90deg, #A7E86B, rgba(167,232,107,0))",
          boxShadow: "0 0 10px 1px rgba(167,232,107,0.6)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-[#CFEAD4] text-sm sm:text-lg md:text-xl max-w-xl mb-8 sm:mb-10 font-light leading-relaxed drop-shadow"
      >
        Experience premium dental care with our expert team across
        Mindanao. Compassionate, modern, and dedicated to your oral
        health.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
      >
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto text-[#0B3D26] font-semibold rounded-full px-8 py-6 text-base transition-all duration-300 hover:scale-105"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #D9F2C4, #A7E86B 55%, #4FC97B)",
            boxShadow: "0 0 24px 2px rgba(167,232,107,0.45)",
          }}
        >
          <Link href="/book">
            Book Your Consultation
          </Link>
        </Button>

        <Link
          href="/services"
          className="group inline-flex items-center justify-center sm:justify-start gap-2 text-white text-sm font-medium tracking-wide py-2"
        >
          Explore Our Services
          <ArrowRight
            size={16}
            className="text-[#A7E86B] transition-transform duration-300 group-hover:translate-x-1 shrink-0"
            style={{
              filter: "drop-shadow(0 0 4px rgba(167,232,107,0.6))",
            }}
          />
        </Link>
      </motion.div>
    </div>
  </div>
</section>

{/* ── Trust Bar ── */}
<section className="relative overflow-hidden py-8 md:py-12">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        "radial-gradient(80% 120% at 0% 0%, rgba(79,201,123,0.25), transparent 60%), radial-gradient(80% 120% at 100% 100%, rgba(167,232,107,0.18), transparent 60%), linear-gradient(120deg, #0B3D26, #103F27 50%, #0B3D26)",
    }}
  />

  {/* ── glowing accents, matching hero ── */}
  <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden hidden sm:block">
    {/* scan-line sweep */}
    <motion.div
      animate={{ y: ["0%", "100%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 w-full h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(167,232,107,0.5) 30%, rgba(167,232,107,0.7) 50%, rgba(167,232,107,0.5) 70%, transparent)",
        boxShadow: "0 0 12px 1px rgba(167,232,107,0.5)",
      }}
    />
    {/* corner brackets echoing hero */}
    <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#A7E86B]/30 rounded-tl-md" />
    <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#A7E86B]/25 rounded-br-md" />
  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
    {/* Stat row with glowing dividers instead of card grid */}
    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-6">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="relative text-center px-2 sm:px-4 py-2 group"
        >
          {/* vertical glow divider (skip first item per row depending on viewport) */}
          {i !== 0 && (
            <span
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(167,232,107,0.35), transparent)",
              }}
            />
          )}

          <p
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #D9F2C4, #A7E86B, #4FC97B)",
            }}
          >
            {s.value}
          </p>

          {/* small glow underline */}
          <span
            className="block mx-auto mt-2 sm:mt-3 mb-2 sm:mb-3 h-[2px] w-6 transition-all duration-300 group-hover:w-10"
            style={{
              background: "#A7E86B",
              boxShadow: "0 0 8px 1px rgba(167,232,107,0.6)",
            }}
          />

          <p className="text-[#CFEAD4] text-[11px] sm:text-xs md:text-sm tracking-[0.15em] uppercase font-medium">
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* ── Branches ── */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "#F1FAEE" }}
      >
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
              Seven locations across Mindanao, each ready to give you the same
              quality care, closer to home.
            </p>
          </motion.div>
          <BranchesMap />
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
              Care That Gives You Something to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(100deg, #A7E86B, #4FC97B)",
                }}
              >
                Smile About
              </span>
            </h2>
            <div className="space-y-2">
              {whyChooseUsItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="flex gap-4 p-4 rounded-2xl transition-colors duration-300"
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
