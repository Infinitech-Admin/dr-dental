"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

interface TeamMember {
  id: number
  branchId: string
  branchName: string
  name: string
  position: string | null
  image: string | null
  sortOrder: number
}

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch("/api/teams")

        if (!response.ok) {
          throw new Error("Failed to fetch team data")
        }

        const data = await response.json()
        const teamArray = Array.isArray(data)
          ? data
          : data.teams || data.data || []

        setTeam(teamArray)
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  const safeTeam = Array.isArray(team) ? team : []

  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
      style={{
        background:
          "linear-gradient(160deg, #0F3D2E 0%, #123D2C 55%, #0F3D2E 100%)",
      }}
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: ["0%", "100%"] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-0 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(126,217,160,0.5) 30%, rgba(126,217,160,0.7) 50%, rgba(126,217,160,0.5) 70%, transparent)",
            boxShadow: "0 0 12px 1px rgba(126,217,160,0.5)",
          }}
        />

        <div className="absolute right-4 top-6 hidden h-10 w-10 rounded-tr-md border-r-2 border-t-2 border-[#7ED9A0]/25 sm:right-8 sm:top-8 sm:block sm:h-14 sm:w-14" />

        <div className="absolute bottom-6 left-4 hidden h-10 w-10 rounded-bl-md border-b-2 border-l-2 border-[#7ED9A0]/20 sm:bottom-8 sm:left-8 sm:block sm:h-14 sm:w-14" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          {...fade}
          className="mb-3 flex items-center justify-center gap-2 sm:gap-3"
        >
          <span
            className="h-px w-5 shrink-0 sm:w-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, #7ED9A0)",
              boxShadow: "0 0 8px 1px rgba(126,217,160,0.5)",
            }}
          />

          <span className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#7ED9A0] sm:text-xs md:text-sm sm:tracking-[0.35em]">
            Meet The Team
          </span>

          <span
            className="h-px w-5 shrink-0 sm:w-8"
            style={{
              background:
                "linear-gradient(90deg, #7ED9A0, transparent)",
              boxShadow: "0 0 8px 1px rgba(126,217,160,0.5)",
            }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          {...fade}
          className="mx-auto mb-8 max-w-3xl text-center font-serif text-3xl leading-tight text-white sm:mb-12 sm:text-4xl md:mb-14 md:text-5xl"
        >
          The Specialists Behind{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #D9F2C4, #7ED9A0, #3D9A63)",
            }}
          >
            Every Smile
          </span>
        </motion.h2>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <p className="text-center font-mono text-xs tracking-[0.15em] text-[#7ED9A0] animate-pulse sm:text-sm sm:tracking-widest">
              LOADING TEAM DATA...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <p className="max-w-md text-center font-mono text-xs text-red-400 sm:text-sm">
              Error: {error}
            </p>
          </div>
        ) : safeTeam.length === 0 ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <p className="text-center text-sm text-[#B9D6C2]">
              No team members found.
            </p>
          </div>
        ) : (
          /*
           * Responsive grid:
           * < 480px  : 1 column
           * sm        : 2 columns
           * lg        : 4 columns
           */
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7 xl:gap-8">
            {safeTeam.map((member, i) => (
              <motion.div
                key={member.id ?? i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                }}
                className="group relative flex min-w-0 flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center backdrop-blur-sm sm:p-4"
              >
                {/* Portrait */}
                <div className="relative mx-auto mb-3 aspect-[4/5] w-full max-w-[260px] sm:mb-4 sm:aspect-[3/4]">
                  <div
                    className="relative h-full w-full overflow-hidden rounded-xl transition-transform duration-500 ease-out group-hover:-translate-y-1"
                    style={{
                      border:
                        "1px solid rgba(126,217,160,0.4)",
                      boxShadow:
                        "0 0 0 1px rgba(126,217,160,0.08), 0 0 30px 2px rgba(126,217,160,0.18), 0 20px 40px -12px rgba(0,0,0,0.5)",
                      background:
                        "linear-gradient(135deg, #123D2C, #0F3D2E)",
                    }}
                  >
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="
                          (max-width: 479px) 85vw,
                          (max-width: 1023px) 40vw,
                          260px
                        "
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl font-serif text-white sm:text-6xl">
                        {member.name
                          ?.replace("Dr. ", "")
                          .charAt(0) || "D"}
                      </div>
                    )}

                    {/* Bottom gradient */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent, rgba(15,61,46,0.65))",
                      }}
                    />

                    {/* Corner accents */}
                    <div className="absolute right-2 top-2 h-3.5 w-3.5 rounded-tr-sm border-r-2 border-t-2 border-[#7ED9A0]/60 sm:right-2.5 sm:top-2.5 sm:h-4 sm:w-4" />

                    <div className="absolute bottom-2 left-2 h-3.5 w-3.5 rounded-bl-sm border-b-2 border-l-2 border-[#7ED9A0]/40 sm:bottom-2.5 sm:left-2.5 sm:h-4 sm:w-4" />

                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        boxShadow:
                          "inset 0 0 0 1px rgba(126,217,160,0.6), 0 0 40px 4px rgba(126,217,160,0.25)",
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 space-y-1">
                  <h3 className="break-words text-sm font-medium leading-snug text-white sm:text-base md:text-lg">
                    {member.name}
                  </h3>

                  <p className="break-words text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#7ED9A0] sm:text-[10px] sm:tracking-[0.15em] md:text-xs">
                    {member.position || "Specialist"}
                  </p>

                  <p className="px-1 text-[10px] leading-relaxed text-[#B9D6C2] sm:text-xs">
                    {member.branchName} Branch
                  </p>
                </div>

                {/* Accent */}
                <span
                  className="mx-auto mt-2.5 block h-[2px] w-5 transition-all duration-300 group-hover:w-8 sm:mt-3"
                  style={{
                    background: "#7ED9A0",
                    boxShadow:
                      "0 0 8px 1px rgba(126,217,160,0.6)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
