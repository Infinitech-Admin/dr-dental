import Link from "next/link"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { BRANCHES } from "@/lib/branches-data"

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#1C2B21]">
      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E4F0DE] via-[#F6FAF4] to-[#F6FAF4]" />
        <div className="absolute top-10 left-1/2 w-[320px] sm:w-[560px] h-[320px] sm:h-[560px] bg-[#7FAE86]/25 blur-[110px] sm:blur-[150px] rounded-full -translate-x-1/2" />
        <div className="absolute top-40 right-[8%] w-[180px] h-[180px] bg-[#C7E3B8]/40 blur-[90px] rounded-full hidden sm:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#3F6B4A] text-sm uppercase tracking-[0.4em] mb-5 font-medium">
            Our Branches
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[0.95] tracking-tight text-[#1C2B21]">
            Find a Clinic{" "}
            <span className="bg-gradient-to-r from-[#3F6B4A] to-[#7FAE86] bg-clip-text text-transparent">
              Near You
            </span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl leading-8 text-[#4A5B4F]">
            Seven locations across Davao Region, each delivering the same
            standard of premium dental care. Choose a branch to view directions,
            schedules, and clinic information.
          </p>
        </div>
      </section>

      {/* CARD GRID */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {BRANCHES.map((branch) => (
              <Link
                key={branch.id}
                href={`/branches/${branch.id}`}
                className="group"
              >
                <Card className="h-full p-5 sm:p-6 bg-white border border-[#DCEBD6] rounded-2xl shadow-[0_2px_16px_rgba(63,107,74,0.06)] transition-all duration-300 hover:border-[#7FAE86] hover:shadow-[0_8px_28px_rgba(63,107,74,0.14)] hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-[#5D9169] font-semibold mb-3">
                        {branch.area}
                      </p>
                      <h2 className="font-serif text-3xl leading-tight font-semibold text-[#1C2B21]">
                        {branch.name}
                      </h2>
                    </div>
                    <div className="shrink-0 mt-1 w-8 h-8 rounded-full bg-[#EEF6EA] flex items-center justify-center transition-all group-hover:bg-[#3F6B4A]">
                      <ArrowRight
                        size={15}
                        className="text-[#3F6B4A] transition-all group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-base leading-8 text-[#5B6F60]">
                    {branch.blurb}
                  </p>

                  <div className="space-y-2.5 border-t border-[#E4F0DE] pt-4">
                    <div className="flex gap-2 text-xs sm:text-sm text-[#3A4A3E]">
                      <MapPin
                        size={15}
                        className="text-[#7FAE86] shrink-0 mt-0.5"
                      />
                      <span className="font-mono break-words">
                        {branch.address}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs sm:text-sm text-[#3A4A3E]">
                      <Clock
                        size={15}
                        className="text-[#7FAE86] shrink-0 mt-0.5"
                      />
                      <span className="font-mono">{branch.hours}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
