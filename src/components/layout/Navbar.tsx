"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  LogOut,
  Download,
  Calendar,
  User,
  ChevronDown,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { usePWAInstall } from "@/hooks/use-pwa-install"

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/branches", label: "Branches" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const { isLoggedIn, user, logout, initializeAuth } = useAuthStore()
  const { canInstall, handleInstall } = usePWAInstall()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeAuth()
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-[#C8E6C9]"
          : "bg-[#DCEFD6]"
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 sm:h-18 lg:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-green-900 font-serif text-base sm:text-lg lg:text-2xl tracking-wide shrink-0 leading-tight"
        >
          Dr. Dental Care <span className="text-[#2F5C2F]">Center</span>
        </Link>

        {/* Desktop nav links — 1024px and up only */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === l.href
                  ? "text-[#2F5C2F]"
                  : "text-[#4C6B4C] hover:text-[#1F3A1F]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Full desktop right panel — 1024px and up only */}
        <div className="hidden lg:flex items-center gap-3">
          {canInstall && mounted && (
            <Button
              onClick={handleInstall}
              variant="outline"
              className="border-[#7BC67B] text-[#2F5C2F] hover:bg-[#7BC67B]/10 text-sm px-4 flex items-center gap-2"
            >
              <Download size={16} />
              Download App
            </Button>
          )}

          {mounted &&
            (isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Link href="/book">
                  <Button className="bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] font-medium text-sm px-5 hover:shadow-[0_0_20px_rgba(123,198,123,0.4)] transition-all flex items-center gap-2">
                    <Calendar size={14} />
                    Book Now
                  </Button>
                </Link>

                <div
                  className="relative flex items-center gap-2 pl-3 border-l border-[#C8E6C9]"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#7BC67B]/25 border border-[#7BC67B]/50 flex items-center justify-center text-[#2F5C2F] text-xs font-bold select-none">
                      {initials}
                    </div>
                    <span className="text-[#1F3A1F] text-sm font-medium max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`text-[#4C6B4C] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-[#C8E6C9] rounded-xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#C8E6C9]">
                        <p className="text-[#1F3A1F] text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-[#4C6B4C] text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false)
                            router.push("/profile")
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#2F5C2F] hover:bg-[#DCEFD6]/60 hover:text-[#1F3A1F] text-sm transition-colors"
                        >
                          <User size={14} className="text-[#2F5C2F]" />
                          Profile & Bookings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#4C6B4C] hover:bg-[#DCEFD6]/60 hover:text-red-600 text-sm transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/book">
                  <Button className="bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] font-medium text-sm px-6 hover:shadow-[0_0_20px_rgba(123,198,123,0.4)] transition-all">
                    Book Now
                  </Button>
                </Link>

                <Link href="/login">
                  <Button className="bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] font-medium text-sm px-6 hover:shadow-[0_0_20px_rgba(123,198,123,0.4)] transition-all">
                    Login
                  </Button>
                </Link>
              </>
            ))}
        </div>

        {/* Mobile + tablet toggle — anything under 1024px */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3">
          <Link href="/book" className="hidden sm:block">
            <Button className="bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] text-sm px-4">
              Book
            </Button>
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="p-2 -mr-2 text-[#1F3A1F]"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile/tablet dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#C8E6C9] px-5 pb-6 pt-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block py-3 text-sm border-b border-[#DCEFD6] ${
                pathname === l.href ? "text-[#2F5C2F]" : "text-[#4C6B4C]"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {canInstall && mounted && (
            <Button
              onClick={() => {
                handleInstall()
                setMobileOpen(false)
              }}
              className="w-full mt-4 bg-[#7BC67B]/20 text-[#2F5C2F] hover:bg-[#7BC67B]/30 border border-[#7BC67B] flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download App
            </Button>
          )}

          {mounted &&
            (isLoggedIn && user ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 px-1 py-2 bg-[#DCEFD6]/60 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#7BC67B]/25 border border-[#7BC67B]/50 flex items-center justify-center text-[#2F5C2F] text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <span className="text-[#1F3A1F] text-sm font-medium truncate">
                    {user.name}
                  </span>
                </div>
                <Link href="/book" className="block">
                  <Button className="w-full bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B] flex items-center justify-center gap-2">
                    <Calendar size={15} />
                    Book Now
                  </Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-[#C8E6C9] text-[#2F5C2F] hover:bg-[#DCEFD6]/60 hover:text-[#1F3A1F] flex items-center justify-center gap-2"
                  >
                    <User size={15} className="text-[#2F5C2F]" />
                    Profile & Bookings
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut size={15} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/book" className="block">
                  <Button className="w-full mt-4 bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B]">
                    Book Now
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full bg-[#7BC67B] text-[#1F3A1F] hover:bg-[#6BB86B]">
                    Login
                  </Button>
                </Link>
              </div>
            ))}
        </div>
      )}
    </nav>
  )
}
