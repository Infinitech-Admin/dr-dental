"use client"
import { useRouter } from "next/navigation"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import { useMemo, useEffect, useRef } from "react"
import { BRANCHES, type Branch } from "@/lib/branches-data"

// ---------------------------------------------------------------------------
// Green theme tokens (matches the rest of the site)
// ---------------------------------------------------------------------------
const GREEN_DEEP = "#0E7A3F"
const GREEN_MID = "#189A4D"
const GREEN_BRIGHT = "#2FBD63"
const GREEN_LIME = "#5CD97A"
const ACCENT_GRADIENT = `linear-gradient(135deg, ${GREEN_MID} 0%, ${GREEN_BRIGHT} 55%, ${GREEN_LIME} 100%)`
const ACCENT_GRADIENT_ACTIVE = `linear-gradient(135deg, ${GREEN_DEEP} 0%, ${GREEN_MID} 55%, ${GREEN_BRIGHT} 100%)`

// ---------------------------------------------------------------------------
// Branch coordinates
// NOTE: Ponciano and Bajada are nudged further apart than their real
// addresses so both pins stay visually distinguishable at the map's
// default region-wide zoom. Not precise geolocation — display only.
// ---------------------------------------------------------------------------
const BRANCH_COORDS: Record<string, [number, number]> = {
  ponciano: [6.99, 125.545],
  bajada: [7.12, 125.673],
  "sm-gensan": [6.115977, 125.1784822],
  tagum: [7.4458314, 125.8113755],
  panabo: [7.28, 125.635],
  digos: [6.7599794, 125.3443487],
}

// ---------------------------------------------------------------------------
// Decide which side a branch's label should sit on, so nearby branches
// (e.g. Ponciano/Bajada) don't have overlapping tooltips.
// ---------------------------------------------------------------------------
const LABEL_DIRECTION: Record<string, "left" | "right"> = {
  ponciano: "left",
  bajada: "right",
  "sm-gensan": "right",
  tagum: "right",
  panabo: "left",
  digos: "right",
}

function getLabelOffset(direction: "left" | "right"): [number, number] {
  // Push the label out to the side of the pin instead of stacking above it
  return direction === "left" ? [-24, -17] : [24, -17]
}

// ---------------------------------------------------------------------------
// Custom branch pin (green gradient)
// ---------------------------------------------------------------------------
function createBranchIcon(isActive: boolean) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${isActive ? ACCENT_GRADIENT_ACTIVE : ACCENT_GRADIENT};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(14,122,63,0.45);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          line-height: 1;
        ">+</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  })
}

// ---------------------------------------------------------------------------
// Recenter / fly-to map (only used when activeBranchId is passed in)
// ---------------------------------------------------------------------------
function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position?.[0], position?.[1]])
  return null
}

// ---------------------------------------------------------------------------
// Fit all markers into view on first render
// ---------------------------------------------------------------------------
function FitAllMarkers({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 0) return
    const bounds = L.latLngBounds(positions)
    // Cap how far out it zooms so branches don't shrink to near-overlap
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 })
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function BranchesMap({
  activeBranchId,
}: {
  activeBranchId?: string
}) {
  const router = useRouter()

  const markers = useMemo(
    () =>
      BRANCHES.filter((b) => BRANCH_COORDS[b.id]).map((b) => ({
        branch: b,
        position: BRANCH_COORDS[b.id],
      })),
    [],
  )

  const allPositions = useMemo(() => markers.map((m) => m.position), [markers])

  // Keep a handle to each Leaflet marker instance so the tooltip label
  // can trigger that marker's popup on click.
  const markerRefs = useRef<Record<string, L.Marker | null>>({})

  // Position we've explicitly been told to focus on (from the parent/route) —
  // no zoom change, just recenters on the same zoom level.
  const activePosition = activeBranchId
    ? (BRANCH_COORDS[activeBranchId] ?? null)
    : null

  function goToBranch(branch: Branch) {
    router.push(`/branches/${branch.id}`)
  }

  function openPopupFor(branchId: string) {
    markerRefs.current[branchId]?.openPopup()
  }

  return (
    <>
      {/* Green-themed tooltip & popup chrome for react-leaflet */}
      <style jsx global>{`
        .branch-tooltip {
          background: #ffffff !important;
          border: 1.5px solid ${GREEN_BRIGHT} !important;
          border-radius: 8px !important;
          padding: 5px 12px !important;
          box-shadow: 0 2px 10px rgba(14, 122, 63, 0.3) !important;
          cursor: pointer !important;
        }
        .branch-tooltip::before {
          display: none !important;
        }
        .branch-tooltip .leaflet-tooltip-content,
        .branch-tooltip span {
          color: ${GREEN_DEEP} !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.01em;
        }
        .branch-tooltip:hover {
          background: ${GREEN_DEEP} !important;
          border-color: ${GREEN_DEEP} !important;
        }
        .branch-tooltip:hover span {
          color: #ffffff !important;
        }

        .branch-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 14px !important;
          overflow: hidden !important;
          box-shadow: 0 8px 24px rgba(14, 122, 63, 0.25) !important;
        }
        .branch-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 220px !important;
        }
        .branch-popup .leaflet-popup-tip {
          background: ${GREEN_BRIGHT} !important;
        }
      `}</style>

      <MapContainer
        center={[7.1, 125.4]}
        zoom={8}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        zoomControl={false}
        style={{ height: "480px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit all branches into view on initial load (only if nothing is pre-selected) */}
        {!activeBranchId && <FitAllMarkers positions={allPositions} />}

        {/* Recenter (no zoom change) on a pre-selected branch, if passed in via props */}
        <FlyTo position={activePosition} />

        {markers.map(({ branch, position }) => {
          const direction = LABEL_DIRECTION[branch.id] ?? "right"
          return (
            <Marker
              key={branch.id}
              position={position}
              icon={createBranchIcon(branch.id === activeBranchId)}
              ref={(ref) => {
                markerRefs.current[branch.id] = ref
              }}
            >
              <Tooltip
                permanent
                interactive
                direction={direction}
                offset={getLabelOffset(direction)}
                opacity={1}
                className="branch-tooltip"
              >
                <span
                  className="font-semibold whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation()
                    openPopupFor(branch.id)
                  }}
                >
                  {branch.name}
                </span>
              </Tooltip>

              <Popup className="branch-popup">
                <div>
                  <div
                    style={{
                      background: ACCENT_GRADIENT,
                      padding: "12px 14px",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#ffffff",
                        marginBottom: 2,
                        fontSize: 14,
                      }}
                    >
                      {branch.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {branch.area}
                    </p>
                  </div>

                  <div style={{ padding: "12px 14px", background: "#fff" }}>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#555",
                        marginBottom: 10,
                      }}
                    >
                      {branch.address}
                    </p>

                    <button
                      onClick={() => goToBranch(branch)}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        background: ACCENT_GRADIENT,
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    >
                      View branch details →
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </>
  )
}
