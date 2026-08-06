import Link from "next/link"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { BRANCHES } from "@/lib/branches-data"

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-[#050816] to-emerald-900/10" />
        <div className="absolute top-20 left-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-600/10 blur-[100px] sm:blur-[140px] rounded-full -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-emerald-400 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 font-mono">
            Our Branches
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent">
            Find a Clinic Near You
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm sm:text-base px-2">
            Seven locations across Davao Region, each staffed with the same
            standard of premium dental care. Tap a branch to see its details.
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
                <Card className="h-full p-5 sm:p-6 bg-white/5 border border-emerald-500/20 backdrop-blur-xl rounded-2xl transition-all hover:border-emerald-400/50 hover:bg-white/[0.07]">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-mono mb-1">
                        {branch.area}
                      </p>
                      <h2 className="text-xl font-semibold text-white">
                        {branch.name}
                      </h2>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-emerald-400 shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                    />
                  </div>

                  <p className="text-sm text-slate-400 mb-5">{branch.blurb}</p>

                  <div className="space-y-2 border-t border-emerald-500/15 pt-4">
                    <div className="flex gap-2 text-xs sm:text-sm text-slate-300">
                      <MapPin
                        size={15}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                      <span className="font-mono break-words">
                        {branch.address}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs sm:text-sm text-slate-300">
                      <Clock
                        size={15}
                        className="text-emerald-400 shrink-0 mt-0.5"
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
