"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ImageOff, Expand } from "lucide-react"

export function BranchGallery({ branchId }: { branchId: string }) {
  const [images, setImages] = useState<string[] | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/branch-images/${branchId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setImages(data.images ?? [])
      })
      .catch(() => {
        if (!cancelled) setImages([])
      })
    return () => {
      cancelled = true
    }
  }, [branchId])

  const close = useCallback(() => setActiveIndex(null), [])
  const showPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null || !images ? i : (i - 1 + images.length) % images.length,
    )
  }, [images])
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null || !images ? i : (i + 1) % images.length))
  }, [images])

  // keyboard nav + scroll lock while lightbox is open
  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") showPrev()
      if (e.key === "ArrowRight") showNext()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [activeIndex, close, showPrev, showNext])

  // loading skeleton
  if (images === null) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-[#0E4A2D] animate-pulse"
          />
        ))}
      </div>
    )
  }

  // empty state
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#7A9B7E]">
        <ImageOff size={28} />
        <p className="text-sm font-mono">
          No photos available for this branch yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-[#0E4A2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FC97B]"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <Expand
                size={20}
                className="text-white opacity-0 group-hover:opacity-100 transition"
              />
            </div>
          </button>
        ))}
      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/10"
          >
            <X size={26} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              showPrev()
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt=""
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              showNext()
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/10"
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm font-mono">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
