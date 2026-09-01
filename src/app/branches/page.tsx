"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, ArrowRight, Loader2 } from "lucide-react"
import branchBg from "@/assets/branch-bg.jpg"

type Branch = {
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

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/branches", {
          cache: "no-store",
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch branches")
        }

        setBranches(data?.branches ?? [])
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch branches",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  return (
    <div className="min-h-screen bg-[#0B3D26]">
      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 90% at 15% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(90% 80% at 85% 10%, #CFF3D6 0%, transparent 60%), linear-gradient(160deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
          }}
        />

        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[130px] opacity-80"
          style={{
            background:
              "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.15) 70%)",
          }}
        />

        <div
          className="absolute top-32 right-[6%] w-[260px] h-[260px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.4), transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-0 left-[4%] w-[300px] h-[300px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(167,232,107,0.35), transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#1F9552]/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F9552] to-[#A7E86B] animate-pulse" />

            <span className="text-[#145C36] text-xs font-semibold uppercase tracking-[0.35em]">
              Our Branches
            </span>
          </span>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[0.95] tracking-tight">
            <span className="text-[#0B2E1C]">Find a Clinic</span>{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, #145C36 0%, #1F9552 40%, #4FC97B 70%, #A7E86B 100%)",
              }}
            >
              Near You
            </span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl leading-8 text-[#2E4E38]/80">
            Our locations across the Davao Region deliver the same standard of
            premium dental care. Choose a branch to view directions, schedules,
            and clinic information.
          </p>
        </div>
      </section>

      {/* CARD GRID */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(90% 70% at 100% 0%, rgba(79,201,123,0.22), transparent 55%), radial-gradient(70% 60% at 0% 100%, rgba(167,232,107,0.16), transparent 55%), linear-gradient(160deg, #0B3D26, #0E4A2D 55%, #0B3D26)",
          }}
        />

        <div className="absolute inset-0">
          <Image
            src={branchBg}
            alt=""
            fill
            className="object-cover opacity-90 mix-blend-luminosity"
          />
        </div>

        <div
          className="absolute top-1/4 right-[8%] w-[380px] h-[380px] rounded-full blur-[130px] opacity-70 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(79,201,123,0.35), transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-0 left-[6%] w-[320px] h-[320px] rounded-full blur-[110px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(167,232,107,0.3), transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="max-w-lg mx-auto rounded-2xl bg-white p-8 text-center shadow-xl">
              <p className="text-red-600 font-medium">
                Unable to load branches.
              </p>

              <p className="mt-2 text-sm text-slate-500">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && branches.length === 0 && (
            <div className="max-w-lg mx-auto rounded-2xl bg-white p-8 text-center shadow-xl">
              <p className="text-slate-700 font-medium">
                No branches available.
              </p>
            </div>
          )}

          {/* Branches */}
          {!loading && !error && branches.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {branches.map((branch) => (
                <Link
                  key={branch.id}
                  href={`/branches/${branch.branch_id}`}
                  className="group"
                >
                  <Card className="relative h-full p-5 sm:p-6 bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(79,201,123,0.4)]">
                    {/* Top gradient stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                      }}
                    />

                    {/* Hover glow */}
                    <div
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(79,201,123,0.5), transparent 70%)",
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p
                          className="text-xs uppercase tracking-[0.35em] font-semibold mb-3 bg-clip-text text-transparent"
                          style={{
                            backgroundImage:
                              "linear-gradient(100deg, #145C36, #4FC97B)",
                          }}
                        >
                          {branch.area}
                        </p>

                        <h2 className="font-serif text-3xl leading-tight font-semibold text-[#0B2E1C]">
                          {branch.name}
                        </h2>
                      </div>

                      <div
                        className="shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #1F9552, #4FC97B)",
                          boxShadow: "0 6px 16px -4px rgba(31,149,82,0.5)",
                        }}
                      >
                        <ArrowRight
                          size={15}
                          className="text-white transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>

                    <p className="relative mt-5 text-base leading-8 text-[#4C6B4C]">
                      {branch.blurb}
                    </p>

                    <div className="relative space-y-2.5 border-t border-[#DCEFD6] pt-4 mt-5">
                      <div className="flex gap-2 text-xs sm:text-sm text-[#2E4E38]">
                        <MapPin
                          size={15}
                          className="text-[#1F9552] shrink-0 mt-0.5"
                        />

                        <span className="font-mono break-words">
                          {branch.address}
                        </span>
                      </div>

                      <div className="flex gap-2 text-xs sm:text-sm text-[#2E4E38]">
                        <Clock
                          size={15}
                          className="text-[#1F9552] shrink-0 mt-0.5"
                        />

                        <span className="font-mono">{branch.hours}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
