"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
  branchName: string;
}

const clinicGalleryImages: GalleryImage[] = [
  {
    url: "/images/branches/sm-gensan/clinic/6.png",
    alt: "Clinic Entrance",
    branchName: "SM GenSan",
  },
  {
    url: "/images/branches/ponciano/clinic/6.png",
    alt: "Clinic Entrance",
    branchName: "Ponciano",
  },
  {
    url: "/images/branches/tagum/clinic/13.png",
    alt: "Clinic Entrance",
    branchName: "Tagum",
  },
  {
    // TODO: palitan ng totoong filename sa public/images/branches/bajada/clinic/
    url: "/images/branches/bajada/clinic/6.png",
    alt: "Clinic Entrance",
    branchName: "Bajada",
  },
  {
    // TODO: palitan ng totoong filename sa public/images/branches/panabo/clinic/
    url: "/images/branches/panabo/clinic/7.png",
    alt: "Clinic Entrance",
    branchName: "Panabo",
  },
  {
    url: "/images/branches/toril/1.png",
    alt: "Clinic Entrance",
    branchName: "Toril",
  },
];

const BRANCHES_HREF = "/branches";

export default function ClinicGalleryHome() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = clinicGalleryImages;

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + visible.length) % visible.length,
      ),
    [visible.length],
  );
  const next = useCallback(
    () =>
      setLightboxIndex((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length],
  );

  // Keyboard controls + lock page scroll while lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, close, prev, next]);

  const current = lightboxIndex !== null ? visible[lightboxIndex] : null;

  return (
    <section
      className="relative py-16 overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #0F3D2E 0%, #14532D 55%, #1B6B45 100%)",
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          {/* Explore all branches CTA (replaces the old heading) */}
          <div className="flex justify-center">
            <Link
              href={BRANCHES_HREF}
              className="group inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#06281a] shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3D2E]"
            >
              Explore All Branches
            </Link>
          </div>
        </motion.div>

        {/* Gallery grid — uniform 4:3 cards, caption sits below the image */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((img, index) => (
            <motion.button
              key={img.url}
              type="button"
              onClick={() => setLightboxIndex(index)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="group overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#071f14] text-left shadow-xl transition-colors hover:border-emerald-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={img.url}
                  alt={`${img.alt} — ${img.branchName} Branch`}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="text-sm font-medium text-white">{img.alt}</p>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  <MapPin className="h-3 w-3" />
                  {img.branchName}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox — full image, no cropping */}
      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${current.alt} — ${current.branchName} Branch`}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {visible.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[70vh] w-full">
                <Image
                  src={current.url}
                  alt={`${current.alt} — ${current.branchName} Branch`}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  <MapPin className="h-3 w-3" />
                  {current.branchName} Branch
                </span>
                <span className="text-sm font-medium">{current.alt}</span>
                <span className="text-xs text-white/50">
                  {(lightboxIndex ?? 0) + 1} / {visible.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
