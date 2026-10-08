"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface GalleryImage {
  branchId: string;
  url: string;
  alt: string;
  Location: string;
  branch?: {
    address: string;
    hours: string;
  };
}

const clinicGalleryImages: GalleryImage[] = [
  {
    branchId: "bajada",
    // TODO: palitan ng totoong filename sa public/images/branches/bajada/clinic/
    url: "/images/branches/bajada/clinic/6.png",
    alt: "Bajada",
    Location: "Davao City",
    branch: {
      address: "SK Complex, J.P. Laurel Ave, Bajada, Davao City, Philippines, 8000",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  {
    branchId: "digos",
    // TODO: palitan ng totoong filename sa public/images/branches/digos/clinic/
    url: "/images/branches/digos/1.png",
    alt: "Digos",
    Location: "Digos City",
    branch: {
      address: "3rd Floor, Gmall Digos, Tres De Mayo, Upper Digos, Digos City, Philippines, 8002",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  {
    branchId: "panabo",
    // TODO: palitan ng totoong filename sa public/images/branches/panabo/clinic/
    url: "/images/branches/panabo/clinic/7.png",
    alt: "Panabo",
    Location: "Panabo City",
    branch: {
      address: "Ground Floor, Panabo Market Complex, Panabo City, Philippines, 8105",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  {
    branchId: "ponciano",
    url: "/images/branches/ponciano/clinic/6.png",
    alt: "Ponciano",
    Location: "Davao City",
    branch: {
      address: "Unit I-3 K.H Building cor. Ponciano and Bonifacio Street, Davao City, Philippines, 8000",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  {
    branchId: "sm-gensan",
    url: "/images/branches/bajada/clinic/2.png",
    alt: "SM Gensan",
    Location: "General Santos City",
    branch: {
      address: "SK Complex, J.P. Laurel Ave, Bajada, Davao City, Philippines, 8000",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  {
    branchId: "tagum",
    url: "/images/branches/tagum/clinic/13.png",
    alt: "Tagum",
    Location: "Tagum City",
    branch: {
      address: "Cris Inn Hotel Building, Unit Door 22-28, Magugpo East, Lower Apokon, Tagum City, Philippines, 8100",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  {
    branchId: "toril",
    url: "/images/branches/toril/1.png",
    alt: "Toril",
    Location: "Davao City",
    branch: {
      address: "Toril Branch, Davao City, Davao del Sur 8000",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    }
  },
  // {
  //   url: "/images/branches/toril/1.png",
  //   alt: "Dental Treatment Room",
  //   Location: "Toril",
  // },
];

const BRANCHES_HREF = "/branches";

export default function ClinicGalleryHome() {
  const visible = clinicGalleryImages;

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

        {/* Gallery grid — matches the branch cards styling for a consistent look */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((img) => (
            <motion.div
              key={img.url}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/branches/${encodeURIComponent(img.branchId)}`}
                aria-label={`View ${img.alt} branch`}
                className="group block h-full w-full text-left"
              >
              <Card className="gap-0 p-0 relative h-full bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(79,201,123,0.4)] flex flex-col">
                <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#0A291A]">
                  <Image
                    src={img.url}
                    alt={`${img.alt} — ${img.Location} Branch`}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div
                    className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                    }}
                  />
                </div>

                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
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
                          {img.Location}
                        </p>

                        <h2 className="font-serif text-3xl leading-tight font-semibold text-[#0B2E1C]">
                          {img.alt}
                        </h2>
                      </div>

                      <div
                        className="shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #1F9552, #4FC97B)",
                          boxShadow:
                            "0 6px 16px -4px rgba(31,149,82,0.5)",
                        }}
                      >
                        <ArrowRight
                          size={15}
                          className="text-white transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>

                    <p className="relative mt-5 text-base leading-8 text-[#4C6B4C]">
                      Explore this clinic space and see how our team brings care to
                      every visit.
                    </p>
                  </div>

                  <div className="relative space-y-2.5 border-t border-[#DCEFD6] pt-4 mt-5">
                    <div className="flex gap-2 text-xs sm:text-sm text-[#2E4E38]">
                      <MapPin
                        size={15}
                        className="text-[#1F9552] shrink-0 mt-0.5"
                      />

                      <span className="font-mono break-words">
                        {img.branch?.address}
                      </span>
                    </div>

                    <div className="flex gap-2 text-xs sm:text-sm text-[#2E4E38]">
                      <Clock
                        size={15}
                        className="text-[#1F9552] shrink-0 mt-0.5"
                      />

                      <span className="font-mono">{img.branch?.hours}</span>
                    </div>
                  </div>
                </div>
              </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
