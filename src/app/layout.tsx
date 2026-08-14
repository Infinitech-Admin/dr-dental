import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider"
import { Analytics } from "@vercel/analytics/next"
import "leaflet/dist/leaflet.css"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://drdentalcarecenter.com"),

  title: {
    default: "Dr. Dental Care Center - Premium Dental Care in Davao",
    template: "%s | Dr. Dental Care Center",
  },

  description:
    "Dr. Dental Care Center provides advanced dental care in Davao, Philippines. We specialize in general dentistry and orthodontics delivered with modern technology and patient-centered care.",

  keywords: [
    "dental clinic Davao",
    "best dental clinic Davao Philippines",
    "dentist Davao",
    "dental care Davao City",
    "teeth whitening Davao",
    "orthodontist Davao",
    "general dentistry",
    "cosmetic dentistry Philippines",
    "dental implants Philippines",
    "braces Davao",
    "Invisalign Philippines",
    "teeth cleaning Davao",
    "tooth extraction Davao",
    "dental veneers Philippines",
    "root canal Davao",
    "pediatric dentist Davao",
    "premium dental clinic Philippines",
    "modern dental clinic",
    "painless dentistry",
    "affordable dental care Davao",
    "trusted dentist Philippines",
    "dental check-up",
    "smile makeover Philippines",
    "dental consultation Davao",
    "dental emergency Davao",
    "Dr. Dental Care Center",
    "Dental Clinic Davao",
  ],

  authors: [{ name: "Dr. Dental Care Center" }],
  creator: "Dr. Dental Care Center",
  publisher: "Dr. Dental Care Center",
  applicationName: "Dr. Dental Care Center",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "en_PH",
    alternateLocale: ["en_US"],
    url: "https://drdentalcarecenter.com",
    siteName: "Dr. Dental Care Center",
    title: "Dr. Dental Care Center - Premium Dental Care in Davao",
    description:
      "World-class dental services in Davao, Philippines. Trusted by thousands for general dentistry treatments.",
    images: [
      {
        url: "https://drdentalcarecenter.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Dental Care Center - Davao Philippines",
        type: "image/jpeg",
      },
      {
        url: "https://drdentalcarecenter.com/clinic-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Dental Care Center Exterior",
        type: "image/jpeg",
      },
      {
        url: "https://drdentalcarecenter.com/clinic-interior.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Dental Care Center Interior",
        type: "image/jpeg",
      },
      {
        url: "https://drdentalcarecenter.com/dental-services.jpg",
        width: 1200,
        height: 630,
        alt: "Dental Services at Dr. Dental Care Center",
        type: "image/jpeg",
      },
    ],
    countryName: "Philippines",
  },

  twitter: {
    card: "summary_large_image",
    title: "Dr. Dental Care Center - Davao, Philippines",
    description:
      "Premium dental care in Davao, Philippines. General dentistry, cosmetic dentistry, and orthodontics",
    images: ["https://drdentalcarecenter.com/og-image.jpg"],
    creator: "@drdentalcarecenter",
    site: "@drdentalcarecenter",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dr. Dental Care Center",
    startupImage: [
      {
        url: "/icons/icon-180x180.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },

  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-180x180", sizes: "180x180", type: "image/png" },
    ],
  },

  category: "health",
  classification: "Dental Clinic",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    nosnippet: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://drdentalcarecenter.com",
    languages: {
      "en-PH": "https://drdentalcarecenter.com",
      "en-US": "https://drdentalcarecenter.com/en",
    },
  },

  verification: {
    google: "your-google-search-console-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-domain-verification",
    },
  },

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Dr. Dental Care Center",
    "application-name": "Dr. Dental Care Center",
    "msapplication-TileColor": "#1a6fa8",
    "msapplication-config": "/browserconfig.xml",
  },
}

export const viewport = {
  themeColor: "#0a2540",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": "https://drdentalcarecenter.com/#clinic",
    name: "Dr. Dental Care Center",
    image: [
      "https://drdentalcarecenter.com/clinic-exterior.jpg",
      "https://drdentalcarecenter.com/clinic-interior.jpg",
      "https://drdentalcarecenter.com/dental-services.jpg",
    ],
    description:
      "Premium dental clinic in Davao, Philippines. Offering general dentistry, cosmetic dentistry, orthodontics, and dental implants",
    medicalSpecialty: ["Dentistry", "Orthodontics"],
    priceRange: "₱₱-₱₱₱",
    currenciesAccepted: "PHP",
    paymentAccepted: "Cash, Credit Card, Debit Card, GCash, Maya, PhilHealth",
    telephone: "+639679646888",
    email: "appointments@drdentalcarecenter.com",
    url: "https://drdentalcarecenter.com",
    hasMap: "https://maps.app.goo.gl/BDzb3mLhe9TaGq3U7",
    acceptsReservations: true,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address",
      addressLocality: "Davao City",
      addressRegion: "Davao",
      postalCode: "4200",
      addressCountry: "PH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "",
      longitude: "",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "3.5",
      reviewCount: "37",
      bestRating: "5",
      worstRating: "1",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Air Conditioned",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Wheelchair Accessible",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking Available",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Child-Friendly",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Online Booking",
        value: true,
      },
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://drdentalcarecenter.com/appointments",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Dental Appointment",
      },
    },
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": "https://drdentalcarecenter.com/#organization",
    name: "Dr. Dental Care Center",
    url: "https://drdentalcarecenter.com",
    logo: "https://drdentalcarecenter.com/logo.png",
    image: "https://drdentalcarecenter.com/og-image.jpg",
    description:
      "Premium dental clinic serving Davao, Philippines with expert dental care.",
    email: "info@drdentalcarecenter.com",
    telephone: "tel:+639679646888",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit I-3 K.H Building cor. Ponciano And Bonifacio Street",
      addressLocality: "Davao City",
      addressRegion: "Davao",
      postalCode: "8000",
      addressCountry: "PH",
    },
    sameAs: [
      "https://www.facebook.com/DrDentalCareCenter/",
      "https://www.instagram.com/dr.dentalcarecenter/",
    ],
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "10-25",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://drdentalcarecenter.com/#website",
    url: "https://drdentalcarecenter.com",
    name: "Dr. Dental Care Center - Davao, Philippines",
    description:
      "Premium dental clinic in Davao offering comprehensive dental care.",
    publisher: {
      "@id": "https://drdentalcarecenter.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://drdentalcarecenter.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-PH",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://drdentalcarecenter.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dental Services",
        item: "https://drdentalcarecenter.com/dental-services",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Book an Appointment",
        item: "https://drdentalcarecenter.com/book",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What services does Dr. Dental Care Center offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dr. Dental Care Center offers a comprehensive range of services including general dentistry, cosmetic dentistry, orthodontics (braces and Invisalign), dental implants, and teeth whitening.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Dr. Dental Care Center located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dr. Dental Care Center is located in Unit I-3 K.H Building cor. Ponciano And Bonifacio Street, Davao City, Philippines. Visit our website or contact us directly for the exact address and directions.",
        },
      },
      {
        "@type": "Question",
        name: "How do I book an appointment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can book an appointment online through our website, call us directly, or send us a message via our social media pages. Walk-ins are also welcome subject to availability.",
        },
      },
      {
        "@type": "Question",
        name: "What are your clinic hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We are open Monday to Friday from 8:00 AM to 5:00 PM.",
        },
      },
      {
        "@type": "Question",
        name: "Is Dr. Dental Care Center child-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We have a welcoming, child-friendly environment and offer pediatric dental services to ensure your little ones receive the best dental care in a comfortable setting.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer dental payment plans or installment options?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer flexible payment arrangements for certain procedures. Please speak with our front desk staff or contact us directly to learn about available installment plans.",
        },
      },
    ],
  }

  const medicalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://drdentalcarecenter.com/#services",
    name: "Dr. Dental Care Center Services",
    description: "Comprehensive dental services in Davao, Philippines",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dental Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "General Dentistry",
          description:
            "Routine check-ups, teeth cleaning, fillings, extractions, and preventive dental care",
        },
        {
          "@type": "OfferCatalog",
          name: "Cosmetic Dentistry",
          description:
            "Teeth whitening, veneers, smile makeovers, and dental bonding",
        },
        {
          "@type": "OfferCatalog",
          name: "Orthodontics",
          description:
            "Metal braces, ceramic braces, Invisalign, and retainers",
        },
        {
          "@type": "OfferCatalog",
          name: "Restorative Dentistry",
          description:
            "Dental implants, crowns, bridges, dentures, and root canal treatment",
        },
        {
          "@type": "OfferCatalog",
          name: "Pediatric Dentistry",
          description:
            "Gentle and comprehensive dental care for children of all ages",
        },
      ],
    },
    inLanguage: "en-PH",
  }

  return (
    <html lang="en-PH">
      <head>
        {/*
         * ─── PWA INSTALL PROMPT — MUST BE FIRST IN <head> ───────────────────────
         * Captures `beforeinstallprompt` synchronously before any JS bundle loads.
         * React hydration is too slow; this script runs immediately so the event
         * is never missed. The PWAInstallContext reads window.__pwaInstallPrompt
         * on mount and triggers the banner automatically.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.matchMedia('(display-mode: standalone)').matches) return;
                if (window.navigator.standalone === true) return;
                window.addEventListener('beforeinstallprompt', function(e) {
                  e.preventDefault();
                  window.__pwaInstallPrompt = e;
                  window.dispatchEvent(new Event('pwaInstallReady'));
                });
              })();
            `,
          }}
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalServiceSchema),
          }}
        />

        {/* Open Graph Image Tags */}
        <meta
          property="og:image"
          content="https://drdentalcarecenter.com/og-image.jpg"
        />
        <meta
          property="og:image:secure_url"
          content="https://drdentalcarecenter.com/og-image.jpg"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Dr. Dental Care Center - Davao Philippines"
        />

        {/* Twitter Card Image */}
        <meta
          name="twitter:image"
          content="https://drdentalcarecenter.com/og-image.jpg"
        />
        <meta name="twitter:image:alt" content="Dr. Dental Care Center" />

        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preload" as="image" href="/logo.png" />

        {/* Geographic */}
        <meta name="geo.region" content="PH-BAN" />
        <meta name="geo.placename" content="Davao City, Davao, Philippines" />
        <meta name="geo.position" content="13.7565;121.0583" />
        <meta name="ICBM" content="13.7565, 121.0583" />

        {/* Misc */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />

        {/* SEO */}
        <link rel="canonical" href="https://drdentalcarecenter.com" />
        <link
          rel="sitemap"
          type="application/xml"
          href="https://drdentalcarecenter.com/sitemap.xml"
        />
        <link
          rel="alternate"
          hrefLang="en-ph"
          href="https://drdentalcarecenter.com"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://drdentalcarecenter.com/en"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://drdentalcarecenter.com"
        />
      </head>

      <body className="text-white font-sans antialiased">
        <ServiceWorkerProvider />
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
