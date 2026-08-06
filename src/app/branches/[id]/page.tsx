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
    <div className="min-h-screen bg-[#F6FAF4] text-[#1C2B21]">
      {/* HERO */}
      <section className="relative pt-24 sm:pt-32 pb-10 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E4F0DE] via-[#F6FAF4] to-[#F6FAF4]" />
        <div className="absolute top-0 left-1/2 w-[280px] sm:w-[520px] h-[280px] sm:h-[520px] bg-[#7FAE86]/25 blur-[100px] sm:blur-[150px] rounded-full -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href="/branches"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#5B6F60] hover:text-[#3F6B4A] transition mb-5 sm:mb-6"
          >
            <ArrowLeft size={14} />
            All branches
          </Link>

          <p className="text-[#3F6B4A] text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-3 sm:mb-4 font-mono font-medium">
            {branch.area}
          </p>
          <h1 className="font-serif py-1 text-3xl sm:text-5xl md:text-6xl font-semibold text-[#1C2B21]">
            {branch.name}{" "}
            <span className="bg-gradient-to-r from-[#3F6B4A] to-[#7FAE86] bg-clip-text text-transparent">
              Branch
            </span>
          </h1>
          <p className="text-[#4A5B4F] mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
            {branch.blurb}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-14 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 sm:gap-8 lg:gap-10">
            {/* INFO */}
            <Card className="h-full p-5 sm:p-6 bg-white border border-[#DCEBD6] rounded-2xl shadow-[0_2px_16px_rgba(63,107,74,0.06)] relative overflow-hidden">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FAE86] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3F6B4A]" />
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B4A] font-mono font-semibold">
                  Clinic Details
                </p>
              </div>

              <dl className="divide-y divide-[#E4F0DE]">
                {info.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 py-3.5 sm:py-4 first:pt-0 last:pb-0"
                  >
                    <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#EEF6EA] flex items-center justify-center">
                      <item.icon size={15} className="text-[#3F6B4A]" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-[#7A8B7E] font-mono">
                        {item.label}
                      </dt>
                      <dd className="text-sm sm:text-[15px] text-[#2B3A2F] font-mono break-words mt-0.5">
                        {item.label === "Phone" ? (
                          <a
                            href={`tel:${item.value.replace(/\s+/g, "")}`}
                            className="hover:text-[#3F6B4A] transition"
                          >
                            {item.value}
                          </a>
                        ) : item.label === "Email" ? (
                          <a
                            href={`mailto:${item.value}`}
                            className="hover:text-[#3F6B4A] transition"
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
                  <div className="mt-6 pt-5 border-t border-[#E4F0DE]">
                    <p className="text-[11px] uppercase tracking-wider text-[#7A8B7E] font-mono mb-3">
                      Social Media
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {branch.facebook && (
                        <a
                          href={branch.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F6FAF4] border border-[#DCEBD6] text-sm text-[#2B3A2F] hover:border-[#7FAE86] hover:text-[#3F6B4A] transition"
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
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F6FAF4] border border-[#DCEBD6] text-sm text-[#2B3A2F] hover:border-[#7FAE86] hover:text-[#3F6B4A] transition"
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

            {/* MAP */}
            <Card className="relative overflow-hidden bg-white border border-[#DCEBD6] rounded-2xl shadow-[0_2px_16px_rgba(63,107,74,0.06)]">
              <div className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#7FAE86] rounded-tl-md z-10" />
              <div className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#7FAE86] rounded-tr-md z-10" />
              <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#7FAE86] rounded-bl-md z-10" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#7FAE86] rounded-br-md z-10" />

              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#E4F0DE]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7A8B7E] font-mono">
                  Find Us
                </p>
                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#3F6B4A] hover:text-[#2E5138] transition"
                >
                  <Navigation size={14} />
                  Get Directions
                </a>
              </div>

              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
                <iframe
                  src={mapEmbedSrc}
                  title={`${branch.name} branch location map`}
                  className="absolute inset-0 w-full h-full border-0"
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