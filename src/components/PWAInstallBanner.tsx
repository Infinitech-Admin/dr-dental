"use client"

import Image from "next/image"
import { usePWAInstall } from "@/context/PWAInstallContext"

export default function PWAInstallBanner() {
  const { showBanner, handleInstall, handleDismiss } = usePWAInstall()

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a2b1e] border-t border-emerald-700 shadow-lg px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Image
          src="/icons/icon-192x192.png"
          alt="App icon"
          width={40}
          height={40}
          className="rounded-xl"
        />
        <div>
          <p className="text-white font-semibold text-sm">
            Dr. Dental Care Center
          </p>
          <p className="text-emerald-300 text-xs">
            Install our app for quick access
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="text-emerald-300 text-sm px-3 py-1.5 rounded-lg hover:bg-emerald-900 transition"
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition"
        >
          Install
        </button>
      </div>
    </div>
  )
}
