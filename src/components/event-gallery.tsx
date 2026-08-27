"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react"

const EVENT_LABELS: Record<string, string> = {
  "pag-ibig-partnership": "PAG-IBIG Partnership",
  "davao-dental-mission": "Davao Dental Mission",
  "maco-dental-mission": "Maco Dental Mission",
  vloggers: "Vloggers",
}

type EventData = { id: string; images: string[] }

export default function EventsGallery() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        const fetched: EventData[] = data.events ?? []
        setEvents(fetched)
        if (fetched.length > 0) setActiveEvent(fetched[0].id)
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const images = useMemo(
    () => events.find((e) => e.id === activeEvent)?.images ?? [],
    [events, activeEvent],
  )

  const close = useCallback(() => setActiveIndex(null), [])
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  )
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeIndex, close, prev, next])

  const switchEvent = (id: string) => {
    setActiveEvent(id)
    setActiveIndex(null)
  }

  const openMobileGallery = (eventId: string) => {
    setActiveEvent(eventId)
    setActiveIndex(0)
  }

  return (
    <section
      className="relative py-12 sm:py-20 md:py-28 overflow-hidden"
      style={{ background: "#F1FAEE" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] rounded-full blur-[80px] sm:blur-[120px] opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(79,201,123,0.25), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#1F9552]/10 border border-[#1F9552]/20">
            <p className="text-[#145C36] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]">
              Events & Outreach
            </p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2E1C] mb-3 sm:mb-4 leading-tight">
            Moments Worth Sharing
          </h2>
          <p className="text-sm sm:text-base text-[#4C6B4C]">
            A look at our community missions, partnerships, and milestones.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-[#E4F7E6] animate-pulse"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-[#4C6B4C] py-12 sm:py-16">
            No events found.
          </p>
        ) : (
          <>
            {/* MOBILE LAYOUT: Cover Cards */}
            <div className="block sm:hidden space-y-4">
              {events.map((event) => {
                const frontImage = event.images[0]
                const label = EVENT_LABELS[event.id] ?? event.id
                if (!frontImage) return null

                return (
                  <button
                    key={event.id}
                    onClick={() => openMobileGallery(event.id)}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#C8E6C9] shadow-md text-left group active:scale-[0.98] transition-transform"
                  >
                    <Image
                      src={frontImage}
                      alt={label}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E1C]/90 via-[#0B2E1C]/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg drop-shadow-sm">
                          {label}
                        </h3>
                        <p className="text-white/80 text-xs">
                          Tap to view all photos
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-medium border border-white/20">
                        <Images size={14} />
                        <span>{event.images.length}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* DESKTOP LAYOUT: Tabs and Grid */}
            <div className="hidden sm:block">
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {events.map((event) => {
                  const isActive = event.id === activeEvent
                  const label = EVENT_LABELS[event.id] ?? event.id
                  return (
                    <button
                      key={event.id}
                      onClick={() => switchEvent(event.id)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                        isActive
                          ? "text-white border-transparent shadow-md"
                          : "text-[#145C36] border-[#1F9552]/25 bg-white hover:bg-[#1F9552]/5"
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundImage:
                                "linear-gradient(120deg, #1F9552 0%, #2FAE63 55%, #4FC97B 100%)",
                            }
                          : undefined
                      }
                    >
                      {label}
                    </button>
                  )
                })}
              </div>

              {images.length === 0 ? (
                <p className="text-center text-[#4C6B4C] py-16">
                  No photos yet for this event.
                </p>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeEvent}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {images.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-[#C8E6C9] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F9552]"
                      >
                        <Image
                          src={src}
                          alt={`${
                            EVENT_LABELS[activeEvent ?? ""] ?? activeEvent
                          } photo ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D26]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B2E1C]/95 backdrop-blur-md px-3 sm:px-6 py-12"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
            >
              <X size={20} className="sm:w-[22px] sm:h-[22px]" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft size={22} className="sm:w-[26px] sm:h-[26px]" />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[75vh] sm:max-h-[85vh] aspect-square sm:aspect-auto rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white/10 shadow-2xl flex items-center justify-center"
            >
              <Image
                src={images[activeIndex]}
                alt={`Photo ${activeIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
            >
              <ChevronRight size={22} className="sm:w-[26px] sm:h-[26px]" />
            </button>

            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm text-white/90 text-xs sm:text-sm font-medium tracking-wide">
              <span>{EVENT_LABELS[activeEvent ?? ""] ?? activeEvent}</span>
              <span className="text-white/40">•</span>
              <span>
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
