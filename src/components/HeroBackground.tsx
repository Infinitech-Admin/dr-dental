"use client"

import { useState, useEffect, useRef } from "react"
import Image, { StaticImageData } from "next/image"

interface HeroBackgroundProps {
  videoSrc: string
  fallbackImage: StaticImageData | string
}

export function HeroBackground({ videoSrc, fallbackImage }: HeroBackgroundProps) {
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Autoplay was prevented:", error)
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!failed ? (
        <video
          ref={videoRef}
          key={videoSrc}
          className="absolute inset-0 w-full h-full object-cover transform-gpu"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={fallbackImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
      )}

      {/* subtle green tint overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[#0B3D26]/30" 
      />
    </div>
  )
}