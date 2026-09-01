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
import { BranchGallery } from "@/components/branch-gallery"
import { BranchTeam } from "@/components/branch-team"

interface Branch {
  id: number
  branch_id: string
  name: string
  area: string
  phone: string | null
  email: string | null
  address: string
  hours: string | null
  mapQuery: string | null
  directionsUrl: string | null
  blurb: string | null
  facebook: string | null
  instagram: string | null
}

interface BranchImage {
  id: number
  branch_id: number
  type: "clinic" | "team"
  url: string
  alt: string | null
  sort_order: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getBranch(slug: string): Promise<Branch | null> {
  try {
    if (!slug) {
      return null
    }

    const response = await fetch(
      `${API_URL}/api/branches/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }

      throw new Error("Failed to fetch branch")
    }

    const data = await response.json()

    return data?.branch ?? null
  } catch (error) {
    console.error("Failed to fetch branch:", error)
    return null
  }
}

async function getBranchImages(
  branchId: number,
  type: "clinic" | "team",
): Promise<BranchImage[]> {
  try {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      type,
    })

    const response = await fetch(
      `${API_URL}/api/branch-images?${params.toString()}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} branch images`)
    }

    const data = await response.json()

    return Array.isArray(data?.images) ? data.images : []
  } catch (error) {
    console.error(`Failed to fetch ${type} branch images:`, error)

    return []
  }
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: slug } = await params

  const branch = await getBranch(slug)

  if (!branch) {
    notFound()
  }

  const [clinicImages, teamImages] = await Promise.all([
    getBranchImages(branch.id, "clinic"),
    getBranchImages(branch.id, "team"),
  ])

  const info = [
    ...(branch.phone
      ? [
          {
            icon: Phone,
            label: "Phone",
            value: branch.phone,
          },
        ]
      : []),

    ...(branch.email
      ? [
          {
            icon: Mail,
            label: "Email",
            value: branch.email,
          },
        ]
      : []),

    ...(branch.address
      ? [
          {
            icon: MapPin,
            label: "Address",
            value: branch.address,
          },
        ]
      : []),

    ...(branch.hours
      ? [
          {
            icon: Clock,
            label: "Hours",
            value: branch.hours,
          },
        ]
      : []),
  ]

  const mapEmbedSrc = branch.mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        branch.mapQuery,
      )}&z=16&output=embed`
    : null

  return (
    <div className="min-h-screen bg-[#0B3D26]">
      {/* HERO */}
      <section className="relative overflow-hidden pb-10 pt-24 sm:pb-14 sm:pt-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 90% at 15% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(90% 80% at 85% 10%, #CFF3D6 0%, transparent 60%), linear-gradient(160deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
          }}
        />

        <div
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[130px] opacity-80"
          style={{
            background:
              "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.15) 70%)",
          }}
        />

        <div
          className="absolute right-[8%] top-20 h-[220px] w-[220px] rounded-full blur-[100px]"
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/branches"
            className="mb-5 inline-flex items-center gap-1.5 text-xs text-[#4C6B4C] transition hover:text-[#145C36] sm:mb-6 sm:text-sm"
          >
            <ArrowLeft size={14} />
            All branches
          </Link>

          <p
            className="mb-3 bg-clip-text text-xs font-mono font-semibold uppercase tracking-[0.25em] text-transparent sm:mb-4 sm:text-sm sm:tracking-[0.35em]"
            style={{
              backgroundImage: "linear-gradient(100deg, #145C36, #4FC97B)",
            }}
          >
            {branch.area}
          </p>

          <h1 className="py-1 font-serif text-3xl font-semibold sm:text-5xl md:text-6xl">
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

          {branch.blurb && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#2E4E38]/80 sm:text-base">
              {branch.blurb}
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative overflow-hidden py-16 pb-14 sm:py-20 sm:pb-24">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(90% 70% at 100% 0%, rgba(79,201,123,0.22), transparent 55%), radial-gradient(70% 60% at 0% 100%, rgba(167,232,107,0.16), transparent 55%), linear-gradient(160deg, #0B3D26, #0E4A2D 55%, #0B3D26)",
          }}
        />

        <div
          className="pointer-events-none absolute right-[6%] top-1/3 h-[340px] w-[340px] rounded-full blur-[120px] opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.35), transparent 70%)",
          }}
        />

        <div
          className="pointer-events-none absolute bottom-0 left-[4%] h-[300px] w-[300px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(167,232,107,0.3), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
            {/* INFO */}
            <Card className="relative h-full overflow-hidden rounded-2xl border-0 bg-white p-5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] sm:p-6">
              <div
                className="absolute left-0 right-0 top-0 h-1"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                }}
              />

              <div className="mb-5 flex items-center gap-2 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4FC97B] opacity-75" />

                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #1F9552, #4FC97B)",
                    }}
                  />
                </span>

                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#145C36]">
                  Clinic Details
                </p>
              </div>

              <dl className="divide-y divide-[#DCEFD6]">
                {info.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 py-3.5 first:pt-0 last:pb-0 sm:py-4"
                  >
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #1F9552, #4FC97B)",
                      }}
                    >
                      <item.icon size={15} className="text-white" />
                    </div>

                    <div className="min-w-0">
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-[#7A9B7E]">
                        {item.label}
                      </dt>

                      <dd className="mt-0.5 break-words font-mono text-sm text-[#0B2E1C] sm:text-[15px]">
                        {item.label === "Phone" ? (
                          <a
                            href={`tel:${item.value.replace(/\s+/g, "")}`}
                            className="transition hover:text-[#1F9552]"
                          >
                            {item.value}
                          </a>
                        ) : item.label === "Email" ? (
                          <a
                            href={`mailto:${item.value}`}
                            className="transition hover:text-[#1F9552]"
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
                  <div className="mt-6 border-t border-[#DCEFD6] pt-5">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[#7A9B7E]">
                      Social Media
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {branch.facebook && (
                        <a
                          href={branch.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-[#DCEFD6] bg-[#F1FAEE] px-3 py-2 text-sm text-[#0B2E1C] transition hover:border-[#1F9552] hover:text-[#145C36]"
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
                          className="inline-flex items-center gap-2 rounded-lg border border-[#DCEFD6] bg-[#F1FAEE] px-3 py-2 text-sm text-[#0B2E1C] transition hover:border-[#1F9552] hover:text-[#145C36]"
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
            <Card className="relative overflow-hidden rounded-2xl border-0 bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)]">
              <div
                className="absolute left-0 right-0 top-0 z-10 h-1"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                }}
              />

              <div className="pointer-events-none absolute left-3 top-6 z-10 h-6 w-6 rounded-tl-md border-l-2 border-t-2 border-[#4FC97B]" />

              <div className="pointer-events-none absolute right-3 top-6 z-10 h-6 w-6 rounded-tr-md border-r-2 border-t-2 border-[#4FC97B]" />

              <div className="pointer-events-none absolute bottom-3 left-3 z-10 h-6 w-6 rounded-bl-md border-b-2 border-l-2 border-[#4FC97B]" />

              <div className="pointer-events-none absolute bottom-3 right-3 z-10 h-6 w-6 rounded-br-md border-b-2 border-r-2 border-[#4FC97B]" />

              <div className="flex items-center justify-between border-b border-[#DCEFD6] px-5 py-3.5 sm:px-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#7A9B7E]">
                  Find Us
                </p>

                {branch.directionsUrl && (
                  <a
                    href={branch.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-clip-text text-xs font-semibold text-transparent sm:text-sm"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #145C36, #1F9552)",
                    }}
                  >
                    <Navigation size={14} className="text-[#1F9552]" />
                    Get Directions
                  </a>
                )}
              </div>

              <div className="relative aspect-[16/9] w-full sm:aspect-[4/3]">
                {mapEmbedSrc ? (
                  <iframe
                    src={mapEmbedSrc}
                    title={`${branch.name} branch location map`}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Map location unavailable.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* TEAM */}
          <BranchTeam branchId={branch.id} />

          {/* GALLERY */}
          <BranchGallery branchId={branch.id} />
        </div>
      </section>
    </div>
  )
}
