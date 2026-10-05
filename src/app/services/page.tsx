"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wrench,
  AlignCenter,
  Scissors,
  Shield,
  Activity,
  Stethoscope,
  Baby,
  Ear,
  CalendarCheck,
  FolderOpen,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ---------- TYPES ----------

type Service = {
  id: number | string;
  name: string;
  description: string;
  category: string;
  price: number | string | null;
  status?: string;
  image?: string | null;
};

type Category = {
  id?: number | string;
  name: string;
  description: string;
  icon: React.ElementType;
  image: string;
};

// Map category names or fallback keys to Lucide icons
const ICON_MAP: Record<string, React.ElementType> = {
  "General Dentistry": Stethoscope,
  "Cosmetic Dentistry": Sparkles,
  "Restorative Dentistry": Wrench,
  Orthodontics: AlignCenter,
  "Wisdom Tooth Removal": Scissors,
  "Dental Implants": Shield,
  "Root Canal Treatment": Activity,
  "Oral Surgery": Scissors,
  "Pediatric Dentistry": Baby,
  "TMJ Treatment": Ear,
};

// ---------- IMAGE HELPER ----------

const getImageUrl = (imagePath: unknown): string => {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    return "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${API_BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
};

// ---------- COMPONENT ----------

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- FETCH CATEGORIES & SERVICES ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Categories
        const catResponse = await fetch("/api/service-categories", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!catResponse.ok) {
          throw new Error(`Failed to fetch categories (${catResponse.status})`);
        }

        const catData = await catResponse.json();
        const rawCategories = Array.isArray(catData)
          ? catData
          : catData.data || [];

        const mappedCategories: Category[] = rawCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "",
          image: getImageUrl(cat.image),
          icon: ICON_MAP[cat.name] || FolderOpen,
        }));

        setCategories(mappedCategories);

        // 2. Fetch Services (with pagination handling)
        const allServices: Service[] = [];
        let page = 1;
        let lastPage = 1;

        do {
          const response = await fetch(`/api/services?page=${page}`, {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch services (${response.status})`);
          }

          const data = await response.json();

          if (!Array.isArray(data.data)) {
            throw new Error("Invalid services response");
          }

          const pageServices: Service[] = data.data.map((service: any) => ({
            id: Number(service.id),
            name: service.name,
            description: service.description,
            category: service.category,
            price:
              service.price === null || service.price === undefined
                ? null
                : Number(service.price),
            status: service.status,
            image: service.image ?? null,
          }));

          allServices.push(...pageServices);
          lastPage = Number(data.last_page) || 1;
          page++;
        } while (page <= lastPage);

        setServices(allServices);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------- GROUP SERVICES BY CATEGORY ----------

  const servicesByCategory = services.reduce<Record<string, Service[]>>(
    (groups, service) => {
      const category = String(service.category || "").trim();

      if (!category) return groups;

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(service);
      return groups;
    },
    {},
  );

  // Filter categories that actually have services available
  const activeCategories = categories.filter((cat) => {
    return (servicesByCategory[cat.name]?.length ?? 0) > 0;
  });

  // ---------- ACTIVE DETAILS ----------

  const activeCategoryObject = activeCategoryName
    ? categories.find((c) => c.name === activeCategoryName)
    : null;

  const activeServices = activeCategoryName
    ? servicesByCategory[activeCategoryName] || []
    : [];

  // ---------- PRICE FORMATTER ----------

  const formatPrice = (price: number | string | null) => {
    if (price === null || price === undefined || price === "") {
      return "Price upon consultation";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "Price upon consultation";
    }

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32 md:px-16"
      style={{
        background:
          "radial-gradient(110% 90% at 15% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(90% 80% at 85% 10%, #CFF3D6 0%, transparent 60%), linear-gradient(160deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-0 top-96 h-96 w-96 rounded-full bg-[#A7E86B]/20 blur-3xl" />
      </div>

      <div className="relative">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center sm:mb-20 pb-12"
          style={{
            background:
              "radial-gradient(110% 90% at 15% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(90% 80% at 85% 10%, #CFF3D6 0%, transparent 60%), linear-gradient(160deg, #F4FDF4 0%, #E4F7E6 45%, #CDEED2 100%)",
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1F9552]/25 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#145C36] shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#1F9552]" />
            Our Services
          </span>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[0.98] tracking-tight text-[#0B2E1C] sm:text-5xl lg:text-6xl">
            Comprehensive Dental{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, #145C36 0%, #1F9552 45%, #78D58C 100%)",
              }}
            >
              Care
            </span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl leading-8 text-[#2E4E38]/80">
            Explore our full range of treatments across every branch — tap a
            category to see what&apos;s included.
          </p>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
            <p className="mt-4 text-xs text-[#557761]">
              Loading dental services...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white/70 p-6 text-center shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-[#145C36]/20 bg-[#145C36] px-4 py-2 text-xs font-medium text-white hover:bg-[#1F9552]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && services.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-[#557761]">
              No dental services are currently available.
            </p>
          </div>
        )}

        {/* CATEGORY GRID */}
        {!loading && !error && activeCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mx-auto max-w-6xl">
            {activeCategories.map((cat, i) => {
              const Icon = cat.icon;
              const categoryServices = servicesByCategory[cat.name] || [];

              return (
                <motion.button
                  key={cat.name}
                  onClick={() => setActiveCategoryName(cat.name)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1F9552]/15 bg-white/75 text-left shadow-[0_12px_32px_rgba(20,92,54,0.08)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#1F9552]/40 hover:shadow-[0_20px_40px_rgba(20,92,54,0.14)]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#D9F2C4] sm:h-52">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      unoptimized={cat.image.startsWith("http")}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123D2C]/80 via-transparent to-transparent opacity-90" />

                    <div
                      className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-[#A7E86B]/50 shadow-md backdrop-blur-md"
                      style={{
                        background: "rgba(11,46,28,0.86)",
                      }}
                    >
                      <Icon className="h-5 w-5 text-[#A7E86B]" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-[#0B2E1C] transition-colors group-hover:text-[#1F9552]">
                        {cat.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#557761]">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center text-xs font-semibold text-[#1F9552]">
                      {categoryServices.length}{" "}
                      {categoryServices.length === 1 ? "service" : "services"}
                      <span className="ml-1 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog
        open={!!activeCategoryName}
        onOpenChange={(open) => {
          if (!open) {
            setActiveCategoryName(null);
          }
        }}
      >
        <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#1F9552]/25 bg-[#F4FDF4] p-0 shadow-2xl">
          <AnimatePresence>
            {activeCategoryObject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex h-full flex-col overflow-hidden"
              >
                <div className="relative shrink-0 overflow-hidden border-b border-[#1F9552]/20">
                  <div className="relative h-40 w-full sm:h-48">
                    <Image
                      src={activeCategoryObject.image}
                      alt={activeCategoryObject.name}
                      fill
                      unoptimized={activeCategoryObject.image.startsWith(
                        "http",
                      )}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E1C] via-[#0B2E1C]/60 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6 sm:p-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#A7E86B]/40 bg-[#145C36]/80 shadow-lg backdrop-blur-md">
                      {(() => {
                        const Icon = activeCategoryObject.icon;
                        return <Icon className="h-6 w-6 text-[#A7E86B]" />;
                      })()}
                    </div>

                    <div className="min-w-0 pr-2">
                      <h2 className="truncate text-xl font-bold text-white drop-shadow-sm sm:text-2xl">
                        {activeCategoryObject.name}
                      </h2>
                      <p className="mt-1 text-xs font-normal leading-relaxed text-white/70 sm:text-sm">
                        {activeCategoryObject.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-6 sm:grid-cols-2 sm:gap-6 sm:p-8">
                  {activeServices.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group relative flex flex-col justify-between rounded-xl border border-[#1F9552]/15 bg-white/75 p-5 shadow-sm transition-colors hover:border-[#1F9552]/40 hover:bg-white sm:p-6"
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F9552]" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-[#0B2E1C]">
                              {service.name}
                            </h4>
                            <p className="mt-2 text-xs leading-relaxed text-[#557761] sm:text-sm">
                              {service.description}
                            </p>
                            {/* <div className="mt-4">
                              <span className="text-sm font-semibold text-[#1F9552]">
                                {formatPrice(service.price)}
                              </span>
                            </div> */}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/book?service_id=${encodeURIComponent(
                          String(service.id),
                        )}&service=${encodeURIComponent(service.name)}`}
                        onClick={() => setActiveCategoryName(null)}
                        className="mt-5 inline-flex self-start items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#145C36]/25 bg-[#145C36]/5 px-3.5 py-2 text-xs font-semibold text-[#145C36] transition-colors hover:bg-[#145C36] hover:text-white"
                      >
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Book Now
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
}
