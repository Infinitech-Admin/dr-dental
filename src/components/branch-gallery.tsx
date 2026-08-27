"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react"

interface BranchGalleryProps {
  branchId: string
}

export function BranchGallery({ branchId }: BranchGalleryProps) {
  const [images, setImages] = useState<string[] | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    setImages(null)
    setActiveIndex(null)

    fetch(`/api/branches/${branchId}/images/clinic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load clinic images")
        }

        return response.json()
      })
      .then((data) => {
        if (!cancelled) {
          setImages(Array.isArray(data.images) ? data.images : [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setImages([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [branchId])

  const close = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const showPrev = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || images === null || images.length === 0) {
        return index
      }

      return (index - 1 + images.length) % images.length
    })
  }, [images])

  const showNext = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || images === null || images.length === 0) {
        return index
      }

      return (index + 1) % images.length
    })
  }, [images])

  // Keyboard navigation + scroll lock
  useEffect(() => {
    if (activeIndex === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          close()
          break
        case "ArrowLeft":
          showPrev()
          break
        case "ArrowRight":
          showNext()
          break
      }
    }

    const previousOverflow = document.body.style.overflow

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [activeIndex, close, showPrev, showNext])

  // Loading state
  if (images === null) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-xl bg-[#0E4A2D]"
          />
        ))}
      </div>
    )
  }

  // No clinic images
  if (images.length === 0) {
    return null
  }

  return (
    <section className="mt-10 sm:mt-14">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2 sm:mb-6">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1F9552, #4FC97B)",
          }}
        />

        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#A7E86B]">
          Gallery
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View clinic photo ${index + 1}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-[#0E4A2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FC97B] focus-visible:ring-offset-2"
          >
            <Image
              src={src}
              alt={`Clinic photo ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
              <Expand
                size={20}
                aria-hidden="true"
                className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Clinic image gallery"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
          >
            <X size={26} />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showPrev()
              }}
              aria-label="Previous image"
              className="absolute left-2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white sm:left-6"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative aspect-[4/3] w-full max-w-4xl sm:aspect-video"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Clinic photo ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showNext()
              }}
              aria-label="Next image"
              className="absolute right-2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white sm:right-6"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70 sm:bottom-6 sm:text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  )
}