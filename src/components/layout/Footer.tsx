"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface Service {
  id: number
  name: string
}

export default function Footer() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services")
        if (!res.ok) throw new Error("Failed to fetch")
        const raw = await res.json()
        const list = Array.isArray(raw) ? raw : (raw.data ?? raw.services ?? [])
        setServices(list)
      } catch {
        setServices([])
      }
    }
    fetchServices()
  }, [])

  return (
    <footer className="relative bg-emerald-950 border-t border-emerald-900 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
        <span className="font-serif text-[20vw] text-white whitespace-nowrap">
          Dr. Dental
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="font-serif text-lg text-white mb-4">
            Dr. Dental Care <span className="text-emerald-300">Center</span>
          </h3>
          <p className="text-emerald-100/70 text-sm leading-relaxed">
            Every smile carries a story, a memory, and a reason to be shared.
            We&apos;re here to provide thoughtful, advanced dental care so you
            can smile with confidence through every stage of life.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-emerald-300 mb-4">
            Navigation
          </h4>
          <div className="space-y-2">
            {["/", "/about", "/services", "/book", "/contact"].map((p, i) => (
              <Link
                key={p}
                href={p}
                className="block text-sm text-emerald-100/70 hover:text-emerald-300 transition-colors"
              >
                {["Home", "About", "Services", "Book", "Contact"][i]}
              </Link>
            ))}
          </div>
        </div>

        {/* Services — dynamic, capped at 5 */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-emerald-300 mb-4">
            Services
          </h4>
          <div className="space-y-2 text-sm text-emerald-100/70">
            {services.length > 0 ? (
              <>
                {services.slice(0, 5).map((s) => (
                  <Link
                    key={s.id}
                    href="/services"
                    className="block hover:text-emerald-300 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
                {services.length > 5 && (
                  <Link
                    href="/services"
                    className="block text-emerald-300 hover:text-emerald-200 transition-colors mt-1"
                  >
                    + {services.length - 5} more →
                  </Link>
                )}
              </>
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-white/10 rounded animate-pulse w-3/4"
                />
              ))
            )}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-emerald-300 mb-4">
            Contact
          </h4>
          <div className="space-y-3 text-sm text-emerald-100/70">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-emerald-300 shrink-0" />
              +639679646888
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-emerald-300 shrink-0" />
              info@drdentalcare.com
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-emerald-300 shrink-0" />
              Unit I-3 K.H Building cor. Ponciano And Bonifacio Street, Davao
              City
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-300 shrink-0" />
              Mon-Fri: 8AM-5PM
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900 py-6 text-center text-xs text-emerald-200/60">
        <div>&copy; 2026 Dr. Dental Care Center. All rights reserved.</div>

        <div className="mt-2">
          Powered by{" "}
          <a
            href="https://www.infinitechphil.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-200 hover:text-white transition-colors"
          >
            Infinitech Advertising Corporation
          </a>
        </div>
      </div>
    </footer>
  )
}
