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
  MapPin,
  Stethoscope,
  Award,
  Microscope,
  Layers,
  Smile,
  GraduationCap,
  TrendingUp,
  Heart,
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
    note: "A new Toril branch further strengthens our presence and accessibility within Davao City and surrounding communities.",
  },
]

// Shared accent — a vibrant green used for highlights, icons, and dividers
const ACCENT = "#3D9A63"
const ACCENT_LIGHT = "#7ED9A0"

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
                style={{
                  background: "rgba(61,154,99,0.12)",
                  color: "#2F6B48",
                }}
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
                style={{
                  background: "rgba(61,154,99,0.12)",
                  color: "#2F6B48",
                }}
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

      {/* ── Our Story / Milestones — Light Green ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32"
        style={{
          background:
            "linear-gradient(135deg, #F3FBF6 0%, #E1F5E9 55%, #F7FBF8 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <motion.div
            {...fade}
            className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          >
            <span
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.3em] font-medium mb-4 sm:mb-5 px-3 sm:px-4 py-2 rounded-full"
              style={{
                background: "rgba(61,154,99,0.12)",
                color: "#2F6B48",
              }}
            >
              <MapPin size={12} />
              Our Story
            </span>

            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12]"
              style={{ color: "#0F3D2E" }}
            >
              From One Clinic to a Growing
              <span style={{ color: ACCENT }}> Mindanao Network</span>
            </h2>

            <p
              className="max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-[15px] md:text-base leading-6 sm:leading-7"
              style={{ color: "#4B6B5C" }}
            >
              What began in Davao City in 2019 has grown into a trusted dental
              network serving communities across Mindanao. Each new branch
              reflects our commitment to making modern, comprehensive, and
              compassionate dental care more accessible.
            </p>
          </motion.div>

          {/* TIMELINE */}
          <div className="relative">
            {(() => {
              const years = [
                ...new Set(
                  milestones.map((item) => item.year.match(/\d{4}/)?.[0]),
                ),
              ]

              return (
                <>
                  {/* DESKTOP CENTER LINE — z-0, solid color, thicker so it always renders */}
                  <div
                    className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, #3D9A63 6%, #3D9A63 94%, transparent)",
                    }}
                  />

                  {/* MOBILE LEFT LINE — same fix */}
                  <div
                    className="md:hidden absolute left-[11px] sm:left-[13px] top-2 bottom-2 w-[2px] z-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, #3D9A63 5%, #3D9A63 95%, transparent)",
                    }}
                  />

                  <div className="relative z-10 space-y-8 sm:space-y-10 md:space-y-0">
                    {milestones.map((m, i) => {
                      const year = m.year.match(/\d{4}/)?.[0]
                      const yearIndex = years.indexOf(year)
                      const isLeft = yearIndex % 2 === 0

                      return (
                        <motion.div
                          key={`${m.year}-${m.place}`}
                          {...fade}
                          transition={{
                            duration: 0.55,
                            delay: i * 0.07,
                          }}
                          className="relative z-10 md:grid md:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] md:items-center"
                        >
                          {/* LEFT CONTENT */}
                          <div
                            className={`hidden md:block ${
                              isLeft ? "text-right pr-8 lg:pr-12" : ""
                            }`}
                          >
                            {isLeft && (
                              <div className="py-8 lg:py-10">
                                <span
                                  className="block font-serif text-2xl lg:text-4xl leading-none"
                                  style={{ color: ACCENT }}
                                >
                                  {m.year}
                                </span>

                                <h3
                                  className="mt-2 lg:mt-3 text-lg lg:text-xl font-semibold"
                                  style={{ color: "#0F3D2E" }}
                                >
                                  {m.place}
                                </h3>

                                <p
                                  className="max-w-lg ml-auto mt-2 lg:mt-3 text-sm leading-6 lg:leading-7"
                                  style={{ color: "#4B6B5C" }}
                                >
                                  {m.note}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* CENTER MARKER */}
                          <div className="hidden md:flex relative items-center justify-center h-full min-h-[140px] z-10">
                            <div
                              className="absolute w-8 h-8 rounded-full"
                              style={{
                                background: "#F3FBF6",
                              }}
                            />

                            <div
                              className="absolute w-7 h-7 rounded-full"
                              style={{
                                background: "rgba(61,154,99,0.12)",
                              }}
                            />

                            <div
                              className="relative w-3 h-3 rounded-full border-2"
                              style={{
                                background: "#F3FBF6",
                                borderColor: ACCENT,
                              }}
                            />
                          </div>

                          {/* RIGHT CONTENT */}
                          <div
                            className={`hidden md:block ${
                              !isLeft ? "text-left pl-8 lg:pl-12" : ""
                            }`}
                          >
                            {!isLeft && (
                              <div className="py-8 lg:py-10">
                                <span
                                  className="block font-serif text-2xl lg:text-4xl leading-none"
                                  style={{ color: ACCENT }}
                                >
                                  {m.year}
                                </span>

                                <h3
                                  className="mt-2 lg:mt-3 text-lg lg:text-xl font-semibold"
                                  style={{ color: "#0F3D2E" }}
                                >
                                  {m.place}
                                </h3>

                                <p
                                  className="max-w-lg mt-2 lg:mt-3 text-sm leading-6 lg:leading-7"
                                  style={{ color: "#4B6B5C" }}
                                >
                                  {m.note}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* MOBILE CONTENT */}
                          <div className="md:hidden relative pl-8 sm:pl-10">
                            {/* MOBILE DOT */}
                            <div
                              className="absolute left-[5px] sm:left-[7px] top-2 w-[13px] h-[13px] rounded-full border-2 z-10"
                              style={{
                                background: "#F3FBF6",
                                borderColor: ACCENT,
                              }}
                            />

                            <div className="pb-2">
                              <span
                                className="block font-serif text-2xl sm:text-3xl leading-none"
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
                                className="mt-2 text-sm leading-6 sm:leading-7 max-w-xl"
                                style={{ color: "#4B6B5C" }}
                              >
                                {m.note}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </div>

          {/* CLOSING STATEMENT */}
          <motion.div
            {...fade}
            className="relative max-w-3xl mx-auto mt-14 sm:mt-16 md:mt-20 lg:mt-24 pt-8 sm:pt-10 text-center"
            style={{
              borderTop: "1px solid rgba(61,154,99,0.25)",
            }}
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
              style={{
                background: "rgba(61,154,99,0.12)",
                color: "#2F6B48",
              }}
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
