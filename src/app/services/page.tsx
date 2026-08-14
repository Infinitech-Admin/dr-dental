"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Tag,
  X,
  SlidersHorizontal,
  Check,
  CalendarCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import servicesBg from "@/assets/services-bg.png";

interface Service {
  id: number;
  title: string;
  desc: string;
  duration: string;
  image: string;
  status: string;
  category: string;
  price: number;
}

interface RawService {
  id: number;
  name: string;
  description?: string;
  duration?: string;
  image?: string;
  status: string;
  category: string;
  price: number | string;
}

const bgWash =
  "radial-gradient(100% 70% at 10% 0%, #E9FBE8 0%, transparent 55%), radial-gradient(80% 60% at 90% 100%, #CFF3D6 0%, transparent 55%), #F1FAEE";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selected, setSelected] = useState<Service | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await fetch("/api/services?per_page=100", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();

        const raw: RawService[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.data)
              ? data.data.data
              : [];

        const formatted: Service[] = raw
          .filter((s) => s.status === "Active")
          .map((s) => ({
            id: s.id,
            title: s.name,
            desc: s.description || "",
            duration: s.duration || "Varies",
            image: s.image
              ? s.image.startsWith("http")
                ? s.image
                : `${process.env.NEXT_PUBLIC_API_URL}${s.image}`
              : "/placeholder-service.jpg",
            status: s.status,
            category: s.category || "Other",
            price: Number(s.price) || 0,
          }));

        setServices(formatted);
        if (formatted.length > 0) setSelected(formatted[0]);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    services.forEach((s) =>
      map.set(s.category, (map.get(s.category) || 0) + 1),
    );
    return [
      { name: "All", count: services.length },
      ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
    ];
  }, [services]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? services
        : services.filter((s) => s.category === activeCategory),
    [services, activeCategory],
  );

  const handleSelect = (s: Service) => {
    setSelected(s);
    setMobileDetailOpen(true);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: bgWash }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: "#4FC97B", borderTopColor: "transparent" }}
          />
          <span className="text-sm font-medium tracking-wide text-[#145C36]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        className="font-sans min-h-screen flex items-center justify-center"
        style={{ background: bgWash }}
      >
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: "#4C6B4C" }}>
            Couldn&apos;t load services. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg"
            style={{
              backgroundImage: "linear-gradient(135deg, #1F9552, #4FC97B)",
              color: "#fff",
              boxShadow: "0 6px 18px -4px rgba(31,149,82,0.4)",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-14 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0B3D26 0%, #0E4A2D 45%, #0B3D26 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(31,149,82,0.4), rgba(167,232,107,0.12) 70%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-4 px-3 py-1 rounded-full border"
              style={{
                color: "#D6F5E6",
                borderColor: "rgba(167,232,107,0.25)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#1F9552] to-[#A7E86B]" />
              Our Services
            </span>

            <h1
              className="font-serif text-4xl md:text-5xl leading-tight"
              style={{ color: "#F8FFFB" }}
            >
              Dental Care, Done Right
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Body: sidebar + grid + detail ── */}
      <section
        className="relative py-10 overflow-hidden"
        style={{ background: bgWash }}
      >
        <div className="absolute inset-0">
          <Image
            src={servicesBg}
            alt=""
            fill
            className="object-cover opacity-40"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg mb-5"
            style={{
              background: "#fff",
              border: "1px solid #DCEFD6",
              color: "#145C36",
            }}
          >
            <SlidersHorizontal size={14} />
            Filter by category
          </button>

          <div className="grid lg:grid-cols-[220px_1fr_380px] gap-6 items-start">
            {/* ── Sidebar filter (desktop) ── */}
            <aside className="hidden lg:block sticky top-24">
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#4C6B4C" }}
              >
                Categories
              </h2>
              <nav className="flex flex-col gap-1">
                {categories.map((c) => {
                  const active = c.name === activeCategory;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setActiveCategory(c.name)}
                      className="flex items-center justify-between text-left text-sm px-3 py-2.5 rounded-lg transition-colors"
                      style={{
                        background: active
                          ? "rgba(31,149,82,0.1)"
                          : "transparent",
                        color: active ? "#145C36" : "#4C6B4C",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {active && (
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ background: "#1F9552" }}
                          />
                        )}
                        {c.name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          background: active
                            ? "#1F9552"
                            : "rgba(31,149,82,0.08)",
                          color: active ? "#fff" : "#4C6B4C",
                        }}
                      >
                        {c.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* ── Card grid ── */}
            <div>
              {filtered.length === 0 ? (
                <p
                  className="text-sm text-center py-16"
                  style={{ color: "#4C6B4C" }}
                >
                  No services in this category yet.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((s, i) => {
                    const active = selected?.id === s.id;
                    return (
                      <motion.button
                        key={s.id}
                        onClick={() => handleSelect(s)}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        className="group text-left rounded-2xl overflow-hidden flex flex-col h-full relative transition-all duration-200"
                        style={{
                          background: "#fff",
                          border: active
                            ? "1px solid #4FC97B"
                            : "1px solid #DCEFD6",
                          boxShadow: active
                            ? "0 12px 30px -8px rgba(31,149,82,0.3), 0 0 0 1px #4FC97B"
                            : "0 4px 16px -6px rgba(31,149,82,0.1)",
                        }}
                      >
                        <div
                          className="absolute top-0 left-0 right-0 h-1 z-10"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
                          }}
                        />
                        {active && (
                          <span
                            className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "#1F9552" }}
                          >
                            <Check size={13} color="#fff" />
                          </span>
                        )}
                        <div className="h-36 overflow-hidden relative">
                          <Image
                            src={s.image}
                            alt={s.title}
                            width={360}
                            height={144}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-service.jpg";
                            }}
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <span
                            className="text-[10px] uppercase tracking-wide font-semibold mb-1"
                            style={{ color: "#4FC97B" }}
                          >
                            {s.category}
                          </span>
                          <h3
                            className="font-serif text-base mb-2 leading-snug"
                            style={{ color: "#0B2E1C" }}
                          >
                            {s.title}
                          </h3>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span
                              className="inline-flex items-center gap-1 text-xs"
                              style={{ color: "#4C6B4C" }}
                            >
                              <Clock size={11} />
                              {s.duration}
                            </span>
                            {s.price > 0 && (
                              <span
                                className="text-xs font-semibold"
                                style={{ color: "#145C36" }}
                              >
                                ₱{s.price.toLocaleString()}+
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Detail panel (desktop, right) ── */}
            <aside className="hidden lg:block sticky top-24">
              <DetailPanel service={selected} />
            </aside>
          </div>
        </div>
      </section>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute left-0 top-0 bottom-0 w-72 p-6 overflow-y-auto"
              style={{ background: "#F1FAEE" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-lg" style={{ color: "#0B2E1C" }}>
                  Categories
                </h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={18} color="#4C6B4C" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {categories.map((c) => {
                  const active = c.name === activeCategory;
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        setActiveCategory(c.name);
                        setMobileFiltersOpen(false);
                      }}
                      className="flex items-center justify-between text-left text-sm px-3 py-2.5 rounded-lg"
                      style={{
                        background: active
                          ? "rgba(31,149,82,0.1)"
                          : "transparent",
                        color: active ? "#145C36" : "#4C6B4C",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {c.name}
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          background: active
                            ? "#1F9552"
                            : "rgba(31,149,82,0.08)",
                          color: active ? "#fff" : "#4C6B4C",
                        }}
                      >
                        {c.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile detail drawer ── */}
      <AnimatePresence>
        {mobileDetailOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileDetailOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute left-0 right-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl p-5"
              style={{ background: "#F1FAEE" }}
            >
              <div className="flex justify-end mb-2">
                <button onClick={() => setMobileDetailOpen(false)}>
                  <X size={18} color="#4C6B4C" />
                </button>
              </div>
              <DetailPanel service={selected} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailPanel({ service }: { service: Service | null }) {
  if (!service) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#fff", border: "1px solid #DCEFD6" }}
      >
        <p className="text-sm" style={{ color: "#4C6B4C" }}>
          Select a service to see details.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: "1px solid #DCEFD6",
        boxShadow: "0 8px 24px -8px rgba(31,149,82,0.15)",
      }}
    >
      <div className="h-44 relative">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-service.jpg";
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #1F9552, #4FC97B, #A7E86B)",
          }}
        />
      </div>

      <div className="p-5">
        <span
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium mb-3"
          style={{ background: "rgba(31,149,82,0.1)", color: "#145C36" }}
        >
          <Tag size={11} />
          {service.category}
        </span>

        <h3
          className="font-serif text-xl mb-3 leading-snug"
          style={{ color: "#0B2E1C" }}
        >
          {service.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: "#4C6B4C" }}
        >
          {service.desc || "No description available for this treatment."}
        </p>

        <div className="flex items-center gap-4 mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "rgba(31,149,82,0.1)", color: "#145C36" }}
          >
            <Clock size={12} />
            {service.duration}
          </span>
          {service.price > 0 && (
            <span className="text-lg font-serif" style={{ color: "#145C36" }}>
              ₱{service.price.toLocaleString()}+
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/book?service_id=${service.id}&service=${encodeURIComponent(service.title)}`}
          >
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #1F9552 0%, #2FAE63 55%, #4FC97B 100%)",
                color: "#fff",
                boxShadow: "0 10px 24px -6px rgba(31,149,82,0.5)",
              }}
            >
              <CalendarCheck size={15} />
              Book Now
            </button>
          </Link>
          <Link href={`/services/${service.id}`}>
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: "#1F9552", border: "1px solid #DCEFD6" }}
            >
              View full details <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
