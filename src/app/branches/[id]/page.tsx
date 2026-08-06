import Link from "next/link"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Navigation,
  ArrowLeft,
  Facebook,
  Instagram,
} from "lucide-react"
import { BRANCHES, getBranchById } from "@/lib/branches-data"

export function generateStaticParams() {
  return BRANCHES.map((b) => ({ id: b.id }))
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const branch = getBranchById(id)
  if (!branch) notFound()

  const info = [
    { icon: Phone, label: "Phone", value: branch.phone },
    ...(branch.email
      ? [{ icon: Mail, label: "Email", value: branch.email }]
      : []),
    { icon: MapPin, label: "Address", value: branch.address },
    { icon: Clock, label: "Hours", value: branch.hours },
  ]

  const mapEmbedSrc = `https://www.google.com/maps?q=${branch.mapQuery}&z=16&output=embed`

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-[#050816] to-emerald-900/10" />
        <div className="absolute top-20 left-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-600/10 blur-[100px] sm:blur-[140px] rounded-full -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href="/branches"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-emerald-400 transition mb-6"
          >
            <ArrowLeft size={14} />
            All branches
          </Link>

          <p className="text-emerald-400 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 font-mono">
            {branch.area}
          </p>
          <h1 className="font-serif py-2 text-4xl sm:text-5xl md:text-6xl font-semibold bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent">
            {branch.name} Branch
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl text-sm sm:text-base">
            {branch.blurb}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-10">
            {/* INFO — "patient chart" readout, the signature element */}
            <Card className="h-full p-5 sm:p-6 bg-white/5 border border-emerald-500/20 backdrop-blur-xl rounded-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-mono">
                  Clinic Details
                </p>
              </div>

              <dl className="divide-y divide-emerald-500/15">
                {info.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 py-3.5 sm:py-4 first:pt-0 last:pb-0"
                  >
                    <item.icon
                      size={18}
                      className="text-emerald-400 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                        {item.label}
                      </dt>
                      <dd className="text-sm sm:text-[15px] text-slate-200 font-mono break-words mt-0.5">
                        {item.label === "Phone" ? (
                          <a
                            href={`tel:${item.value.replace(/\s+/g, "")}`}
                            className="hover:text-emerald-400 transition"
                          >
                            {item.value}
                          </a>
                        ) : item.label === "Email" ? (
                          <a
                            href={`mailto:${item.value}`}
                            className="hover:text-emerald-400 transition"
                          >
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
                {(branch.facebook || branch.instagram) && (
                  <div className="mt-6 pt-5 border-t border-emerald-500/15">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-mono mb-3">
                      Social Media
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {branch.facebook && (
                        <a
                          href={branch.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-emerald-500/20 text-sm text-slate-200 hover:text-emerald-400 transition"
                        >
                          <Facebook size={16} />
                          Facebook
                        </a>
                      )}

                      {branch.instagram && (
                        <a
                          href={branch.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-emerald-500/20 text-sm text-slate-200 hover:text-emerald-400 transition"
                        >
                          <Instagram size={16} />
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </dl>
            </Card>

            {/* MAP — scanner-framed like a chairside x-ray viewer */}
            <Card className="relative overflow-hidden bg-white/5 border border-emerald-500/20 backdrop-blur-xl rounded-2xl">
              <div className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-md z-10" />
              <div className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-md z-10" />
              <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-md z-10" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400/60 rounded-br-md z-10" />

              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-emerald-500/15">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-mono">
                  Find Us
                </p>
                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-400 hover:text-emerald-300 transition"
                >
                  <Navigation size={14} />
                  Get Directions
                </a>
              </div>

              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
                <iframe
                  src={mapEmbedSrc}
                  title={`${branch.name} branch location map`}
                  className="absolute inset-0 w-full h-full border-0 grayscale-[15%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
