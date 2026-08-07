import Link from "next/link"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import branchBg from "@/assets/branch-bg.jpg"
import Image from "next/image"
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
    <div className="min-h-screen bg-[#0B3D26]">
      {/* HERO */}
      <section className="relative pt-24 sm:pt-32 pb-10 sm:pb-14 overflow-hidden">
        {/* mesh gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 90% at 15% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(90% 80% at 85% 10%, #CFF3D6 0%, transparent 60%), linear-gradient(160deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
          }}
        />
        {/* blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[130px] opacity-80"
          style={{
            background:
              "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.15) 70%)",
          }}
        />
        <div
          className="absolute top-20 right-[8%] w-[220px] h-[220px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.4), transparent 70%)",
          }}
        />
        <div className="absolute inset-0">
          <Image
            src={branchBg}
            alt=""
            fill
            className="object-cover opacity-70 mix-blend-luminosity"
          />
        </div>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#0B3D26 1px, transparent 1px), linear-gradient(90deg, #0B3D26 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href="/branches"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#4C6B4C] hover:text-[#145C36] transition mb-5 sm:mb-6"
          >
            <ArrowLeft size={14} />
            All branches
          </Link>

          <p
            className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-3 sm:mb-4 font-mono font-semibold bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(100deg, #145C36, #4FC97B)",
            }}
          >
            {branch.area}
          </p>
          <h1 className="font-serif py-1 text-3xl sm:text-5xl md:text-6xl font-semibold">
            <span className="text-[#0B2E1C]">{branch.name} </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, #145C36 0%, #1F9552 40%, #4FC97B 70%, #A7E86B 100%)",
              }}
            >
              Branch
            </span>
          </h1>
          <p className="text-[#2E4E38]/80 mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
            {branch.blurb}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative pb-14 sm:pb-24 py-16 sm:py-20 overflow-hidden">
        {/* dark mesh, for light/dark rhythm against the hero */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(90% 70% at 100% 0%, rgba(79,201,123,0.22), transparent 55%), radial-gradient(70% 60% at 0% 100%, rgba(167,232,107,0.16), transparent 55%), linear-gradient(160deg, #0B3D26, #0E4A2D 55%, #0B3D26)",
          }}
        />
        <div
          className="absolute top-1/3 right-[6%] w-[340px] h-[340px] rounded-full blur-[120px] opacity-70 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.35), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-[4%] w-[300px] h-[300px] rounded-full blur-[110px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(167,232,107,0.3), transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 sm:gap-8 lg:gap-10">
            {/* INFO */}
            <Card className="h-full p-5 sm:p-6 bg-white border-0 rounded-2xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                }}
              />
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FC97B] opacity-75" />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #1F9552, #4FC97B)",
                    }}
                  />
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-[#145C36] font-mono font-semibold">
                  Clinic Details
                </p>
              </div>

              <dl className="divide-y divide-[#DCEFD6]">
                {info.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 py-3.5 sm:py-4 first:pt-0 last:pb-0"
                  >
                    <div
                      className="shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #1F9552, #4FC97B)",
                      }}
                    >
                      <item.icon size={15} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-[#7A9B7E] font-mono">
                        {item.label}
                      </dt>
                      <dd className="text-sm sm:text-[15px] text-[#0B2E1C] font-mono break-words mt-0.5">
                        {item.label === "Phone" ? (
                          <a
                            href={`tel:${item.value.replace(/\s+/g, "")}`}
                            className="hover:text-[#1F9552] transition"
                          >
                            {item.value}
                          </a>
                        ) : item.label === "Email" ? (
                          <a
                            href={`mailto:${item.value}`}
                            className="hover:text-[#1F9552] transition"
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
                  <div className="mt-6 pt-5 border-t border-[#DCEFD6]">
                    <p className="text-[11px] uppercase tracking-wider text-[#7A9B7E] font-mono mb-3">
                      Social Media
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {branch.facebook && (
                        <a
                          href={branch.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F1FAEE] border border-[#DCEFD6] text-sm text-[#0B2E1C] hover:border-[#1F9552] hover:text-[#145C36] transition"
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
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F1FAEE] border border-[#DCEFD6] text-sm text-[#0B2E1C] hover:border-[#1F9552] hover:text-[#145C36] transition"
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
            <Card className="relative overflow-hidden bg-white border-0 rounded-2xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)]">
              <div
                className="absolute top-0 left-0 right-0 h-1 z-10"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                }}
              />
              <div className="pointer-events-none absolute top-6 left-3 w-6 h-6 border-t-2 border-l-2 border-[#4FC97B] rounded-tl-md z-10" />
              <div className="pointer-events-none absolute top-6 right-3 w-6 h-6 border-t-2 border-r-2 border-[#4FC97B] rounded-tr-md z-10" />
              <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#4FC97B] rounded-bl-md z-10" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#4FC97B] rounded-br-md z-10" />

              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#DCEFD6]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7A9B7E] font-mono">
                  Find Us
                </p>
                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, #145C36, #1F9552)",
                  }}
                >
                  <Navigation size={14} className="text-[#1F9552]" />
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
