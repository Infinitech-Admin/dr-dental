"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BranchImage {
  id: number
  branch_id: string
  type: "clinic" | "team"
  url: string
  alt: string | null
  sort_order: number
}

interface BranchTeamProps {
  branchId: number
}

export function BranchTeam({ branchId }: BranchTeamProps) {
  const [images, setImages] = useState<BranchImage[] | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    const loadImages = async () => {
      try {
        setImages(null)
        setActiveIndex(0)

        const params = new URLSearchParams({
          branch_id: String(branchId),
          type: "team",
        })

        const response = await fetch(
          `/api/branch-images?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        )

        if (!response.ok) {
          throw new Error("Failed to load team images")
        }

        const data = await response.json()

        if (!cancelled) {
          setImages(Array.isArray(data?.images) ? data.images : [])
        }
      } catch (error) {
        console.error("Failed to load team images:", error)

        if (!cancelled) {
          setImages([])
        }
      }
    }

    loadImages()

    return () => {
      cancelled = true
    }
  }, [branchId])

  const showPrev = () => {
    if (!images || images.length <= 1) {
      return
    }

    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1))
  }

  const showNext = () => {
    if (!images || images.length <= 1) {
      return
    }

    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1))
  }

  useEffect(() => {
    if (!images || images.length <= 1) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPrev()
      }

      if (event.key === "ArrowRight") {
        showNext()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [images])

  if (images === null) {
    return (
      <section className="mt-10 sm:mt-14">
        <div className="mb-5 flex items-center gap-2 sm:mb-6">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[#4FC97B]"
          />

          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#A7E86B]">
            Meet the Team
          </p>
        </div>

        <div className="flex min-h-[400px] w-full animate-pulse items-center justify-center rounded-xl bg-[#0E4A2D] sm:min-h-[550px]" />
      </section>
    )
  }

  if (images.length === 0) {
    return null
  }

  const activeImage = images[activeIndex]

  return (
    <section className="mt-10 sm:mt-14">
      <div className="mb-5 sm:mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundImage: "linear-gradient(135deg, #1F9552, #4FC97B)",
            }}
          />

          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#A7E86B]">
            Meet the Team
          </p>
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-white">
          The people behind your smile
        </h2>
      </div>

      <div className="relative flex min-h-[350px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#0E4A2D] sm:min-h-[550px]">
        <Image
          src={activeImage.url}
          alt={activeImage.alt ?? `Team photo ${activeIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous team photo"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-5"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {images.length > 1 && (
          <button
            type="button"
            onClick={showNext}
            aria-label="Next team photo"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 sm:right-5"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View team photo ${index + 1}`}
              aria-current={activeIndex === index}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-6 bg-[#4FC97B]"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
