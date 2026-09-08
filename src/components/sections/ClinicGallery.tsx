"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, MapPin } from "lucide-react"

const clinicGalleryImages = [
  {
    url: "/images/branches/sm-gensan/clinic/2.png",
    alt: "Reception Area",
    branchName: "SM GenSan",
  },
  {
    url: "/images/branches/tagum/clinic/5.jpg",
    alt: "Dental Chair",
    branchName: "Tagum",
  },

  {
    url: "/images/branches/ponciano/clinic/2.png",
    alt: "Exterior",
    branchName: "Ponciano",
  },
  {
    url: "/images/branches/tagum/clinic/11.jpg",
    alt: "Equipment",
    branchName: "Tagum",
  },
]

export default function ClinicGalleryHome() {
  return (
    <section className="relative py-8 bg-[#03110a] overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        {/* faint scanline texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(180deg,transparent_0%,transparent_50%,#10b981_50%,#10b981_51%,transparent_51%)] bg-[length:100%_4px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Clinic Atmosphere
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Designed for Your <span className="text-emerald-400">Comfort</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
            Take a visual tour inside our modern, fully equipped dental clinics
            built to provide a relaxing and safe environment.
          </p>
        </motion.div>

        {/* HUD-style gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px]">
          {clinicGalleryImages.map((img, index) => {
            let spanClass = "md:col-span-1 md:row-span-1"
            if (index === 0) spanClass = "md:col-span-2 md:row-span-2"
            if (index === 3) spanClass = "md:col-span-2 md:row-span-1"

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#071f14] shadow-xl transition-colors hover:border-emerald-400/60 ${spanClass}`}
              >
                {/* corner brackets */}
                <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-emerald-400/0 group-hover:border-emerald-400/80 transition-all z-10" />
                <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-emerald-400/0 group-hover:border-emerald-400/80 transition-all z-10" />
                <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-emerald-400/0 group-hover:border-emerald-400/80 transition-all z-10" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-emerald-400/0 group-hover:border-emerald-400/80 transition-all z-10" />

                {/* scan-line sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10" />

                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03110a] via-[#03110a]/30 to-transparent opacity-90" />

                <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
                  <span className="inline-flex items-center gap-1.5 w-fit text-[10px] uppercase tracking-wider font-semibold text-emerald-400 mb-1.5 rounded-full border border-emerald-500/30 bg-black/40 backdrop-blur-sm px-2.5 py-1">
                    <MapPin className="h-3 w-3" />
                    {img.branchName} Branch
                  </span>
                  <p className="text-sm font-medium text-white drop-shadow">
                    {img.alt}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA to See All Branches */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center px-4 sm:px-0"
        >
          <Link
            href="/branches"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm sm:text-base shadow-lg shadow-emerald-950/40 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 group hover:scale-105 text-center"
          >
            <span className="whitespace-normal sm:whitespace-nowrap">
              Explore All Branches & Locations
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
