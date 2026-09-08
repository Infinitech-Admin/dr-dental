"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface Team {
  id: number
  branchId: string | null
  branchName: string | null
  name: string
  position: string | null
  image: string | null
  sortOrder: number
}

interface BranchTeamProps {
  team: Team[]
}

export function BranchTeam({ team }: BranchTeamProps) {
  const [selectedMember, setSelectedMember] = useState<Team | null>(null)

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedMember])

  if (!team.length) {
    return null
  }

  return (
    <section className="mt-16 sm:mt-20 lg:mt-24">
      {/* HEADER */}
      <div className="mb-8 border-b border-[#A7E86B]/20 pb-5 sm:mb-10 sm:pb-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#A7E86B] drop-shadow-[0_0_10px_rgba(167,232,107,0.4)] sm:text-xs">
          Our People
        </p>

        <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Meet Our Team
        </h2>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {team.map((member) => (
          <Card
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#1F9552]/40 bg-gradient-to-b from-[#0B2E1C]/90 to-[#0B2E1C]/50 p-2.5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#A7E86B]/80 hover:shadow-[0_0_35px_rgba(167,232,107,0.2)] sm:p-3"
          >
            {/* Tech Frame */}
            <div className="absolute right-0 top-0 z-10 h-3 w-3 border-r-2 border-t-2 border-[#A7E86B] opacity-60" />

            <div className="absolute bottom-0 left-0 z-10 h-3 w-3 border-b-2 border-l-2 border-[#A7E86B] opacity-60" />

            {/* IMAGE */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#06180F]">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    (max-width: 1280px) 33vw,
                    25vw
                  "
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center font-mono text-[10px] tracking-widest text-[#7A9B7E]">
                  SIGNAL LOST
                </div>
              )}

              {/* Gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06180F] via-transparent to-transparent opacity-90" />
            </div>

            {/* INFO */}
            <div className="px-2 pb-2 pt-3 sm:pt-4">
              <h3 className="truncate font-serif text-base font-bold tracking-wide text-white transition-colors group-hover:text-[#A7E86B] sm:text-lg">
                {member.name}
              </h3>

              {member.position && (
                <p className="mt-1 line-clamp-2 font-mono text-[10px] font-medium uppercase tracking-wider text-[#A7E86B]/90 sm:text-xs">
                  {member.position}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#A7E86B]/40 bg-[#06180F]/95 shadow-[0_0_60px_rgba(167,232,107,0.2)] backdrop-blur-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Frame */}
            <div className="absolute right-0 top-0 z-20 h-5 w-5 border-r-2 border-t-2 border-[#A7E86B] sm:h-6 sm:w-6" />

            <div className="absolute bottom-0 left-0 z-20 h-5 w-5 border-b-2 border-l-2 border-[#A7E86B] sm:h-6 sm:w-6" />

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              aria-label="Close team member"
              className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#A7E86B]/40 bg-[#0B2E1C]/90 text-[#A7E86B] transition hover:border-[#A7E86B] hover:bg-[#1F9552]/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            >
              <X size={17} />
            </button>

            {/* MODAL CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,0.85fr)_1fr]">
              {/* IMAGE */}
              <div className="relative mx-auto w-full max-w-[280px] p-4 sm:max-w-[340px] sm:p-6 md:max-w-none md:p-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#1F9552]/50 bg-[#0B2E1C] sm:rounded-2xl">
                  {selectedMember.image ? (
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      sizes="(max-width: 768px) 280px, 40vw"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center font-mono text-xs text-[#7A9B7E]">
                      SIGNAL LOST
                    </div>
                  )}

                  {/* Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06180F]/50 to-transparent" />
                </div>
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-center px-5 pb-6 sm:px-7 sm:pb-8 md:px-8 md:py-10">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#A7E86B]">
                  Team Member
                </p>

                <h3 className="mt-2 break-words font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  {selectedMember.name}
                </h3>

                {selectedMember.position && (
                  <p className="mt-2 break-words font-mono text-xs font-medium uppercase tracking-wider text-[#A7E86B] sm:text-sm">
                    {selectedMember.position}
                  </p>
                )}

                {selectedMember.branchName && (
                  <div className="mt-6 border-t border-[#1F9552]/30 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#7A9B7E]">
                      Assigned Branch
                    </p>

                    <p className="mt-1 break-words text-sm text-white">
                      {selectedMember.branchName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
