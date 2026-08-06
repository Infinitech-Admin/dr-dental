"use client"
import { motion } from "framer-motion"
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
    desc: "Proud to serve Davao, General Santos, Tagum, Panabo, and Digos — getting to know the families who trust us with their care.",
  },
]

// Shared accent — a soft champagne gold used sparingly for a premium touch
const GOLD = "#C9A66B"

export default function About() {
  return (
    <div className="font-sans" style={{ background: "#FFFFFF" }}>
      {/* ── Hero — Green ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F3D2E 0%, #14532D 55%, #1B6B45 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-300/10 rounded-full blur-[100px]" />
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

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fade}>
            <span
              className="inline-block text-xs uppercase tracking-[0.35em] mb-5 px-4 py-1.5 rounded-full border"
              style={{
                color: GOLD,
                borderColor: "rgba(201,166,107,0.35)",
                background: "rgba(201,166,107,0.08)",
              }}
            >
              About Us
            </span>

            <h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
              style={{ color: "#F0FDF4" }}
            >
              Every Smile Deserves a Chance
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className="h-px w-16"
                style={{
                  background: `linear-gradient(to right, transparent, ${GOLD})`,
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: GOLD }}
              />
              <div
                className="h-px w-16"
                style={{
                  background: `linear-gradient(to left, transparent, ${GOLD})`,
                }}
              />
            </div>

            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: "#CBE4D6" }}
            >
              For years, Dr. Dental Care Center has been part of countless
              smiles across Mindanao — listening to every story, understanding
              every concern, and making every patient feel seen, valued, and
              cared for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission — Light Green ── */}
      <section
        className="py-24"
        style={{
          background: "linear-gradient(135deg, #F3FBF6 0%, #E1F5E9 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div {...fade} className="order-2 md:order-1">
              <span
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-4 px-3 py-1 rounded-full"
                style={{
                  background: "rgba(201,166,107,0.12)",
                  color: "#9C7A3F",
                }}
              >
                <Target size={12} /> Our Mission
              </span>
              <h2
                className="font-serif text-3xl md:text-4xl mb-5 leading-snug"
                style={{ color: "#0F3D2E" }}
              >
                To care for people, not just teeth.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#4B6B5C" }}
              >
                Every patient who sits in our chair brings their own story —
                some nervous, some overdue for a visit, some simply looking for
                someone who&apos;ll take the time to explain things clearly. Our
                mission is to meet each person where they are, listen before we
                treat, and make sure they leave feeling heard, not just handled.
              </p>
            </motion.div>

            <motion.div
              {...fade}
              className="order-1 md:order-2 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(201,166,107,0.25)",
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
      <section className="py-24" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div
              {...fade}
              className="rounded-2xl overflow-hidden"
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
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-4 px-3 py-1 rounded-full"
                style={{
                  background: "rgba(201,166,107,0.12)",
                  color: "#9C7A3F",
                }}
              >
                <Eye size={12} /> Our Vision
              </span>
              <h2
                className="font-serif text-3xl md:text-4xl mb-5 leading-snug"
                style={{ color: "#0F3D2E" }}
              >
                To be the reason someone smiles a little easier tomorrow.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#5B6B65" }}
              >
                We envision every Dr. Dental Care Center branch as a place where
                patients receive more than treatment — they experience genuine
                care, lasting trust, and a relationship built around their
                well-being.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values — Green ── */}
      <section
        className="py-24"
        style={{
          background:
            "linear-gradient(135deg, #0F3D2E 0%, #14532D 55%, #1B6B45 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-16">
            <span
              className="inline-block text-xs uppercase tracking-[0.35em] mb-5 px-4 py-1.5 rounded-full border"
              style={{
                color: GOLD,
                borderColor: "rgba(201,166,107,0.35)",
                background: "rgba(201,166,107,0.08)",
              }}
            >
              Our Values
            </span>
            <h2
              className="font-serif text-3xl md:text-4xl leading-tight"
              style={{ color: "#F0FDF4" }}
            >
              What Guides Every Visit
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  className="h-full rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(201,166,107,0.4)"
                    e.currentTarget.style.borderColor = "rgba(201,166,107,0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, #E4C896)`,
                    }}
                  >
                    <v.icon size={20} color="#0F3D2E" />
                  </div>
                  <h3
                    className="font-serif text-lg mb-2"
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

      {/* ── CTA — Always Green ── */}
      <section
        className="py-24 relative overflow-hidden"
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
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,166,107,0.1) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-8 left-1/4 w-2 h-2 rounded-full"
            style={{ background: "rgba(201,166,107,0.5)" }}
          />
          <div
            className="absolute bottom-12 right-1/3 w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(201,166,107,0.4)" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full"
            style={{ background: "rgba(201,166,107,0.5)" }}
          />
        </div>

        <motion.div
          {...fade}
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="h-px w-12"
              style={{
                background: `linear-gradient(to right, transparent, ${GOLD})`,
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: GOLD }}
            />
            <div
              className="h-px w-12"
              style={{
                background: `linear-gradient(to left, transparent, ${GOLD})`,
              }}
            />
          </div>

          <h2
            className="font-serif text-3xl md:text-4xl mb-5 leading-tight"
            style={{ color: "#F0FDF4" }}
          >
            Let&apos;s Take Care of You
          </h2>
          <p className="mb-10 text-base" style={{ color: "#CBE4D6" }}>
            Book a consultation at the branch nearest you, and let&apos;s talk
            about what your smile needs — no rush, no pressure.
          </p>

          <Link href="/book">
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #E4C896)`,
                color: "#0F3D2E",
                boxShadow: "0 4px 24px rgba(201,166,107,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 32px rgba(201,166,107,0.55)"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 24px rgba(201,166,107,0.35)"
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