"use client"

import { useRouter } from "next/navigation"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { useMemo } from "react"
import { BRANCHES, type Branch } from "@/lib/branches-data" // adjust import path to match where BRANCHES actually lives

// ---------------------------------------------------------------------------
// Leaflet needs real lat/lng, and the Branch type only stores a mapQuery
// string. Rather than touch the shared data file, coordinates are kept here
// as a lookup keyed by branch id. These are city/building-level approximations
// — swap in exact coordinates any time by editing this object.
// ---------------------------------------------------------------------------
const BRANCH_COORDS: Record<string, [number, number]> = {
    ponciano: [7.0722, 125.6131],
    bajada: [7.1027, 125.6142],
    "sm-gensan": [6.1149, 125.1691],
    tagum: [7.4478, 125.8078],
    panabo: [7.3072, 125.6844],
    digos: [6.7495, 125.3572],
}

// Custom pin so markers read as "dental" rather than default Leaflet teardrops.
function createBranchIcon(isActive: boolean) {
    return L.divIcon({
        className: "",
        html: `
      <div style="
        width: 34px; height: 34px;
        display: flex; align-items: center; justify-content: center;
        background: ${isActive ? "#0F6E63" : "#12897A"};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
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

// Recenters the map when the person picks a branch from the list beside it.
function FlyTo({ position }: { position: [number, number] | null }) {
    const map = useMap()
    if (position) {
        map.flyTo(position, 15, { duration: 0.6 })
    }
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
        []
    )

    const activePosition = activeBranchId
        ? BRANCH_COORDS[activeBranchId] ?? null
        : null

    function goToBranch(branch: Branch) {
        router.push(`/branches/${branch.id}`)
    }

    return (
        <div className="w-full overflow-hidden z-0 rounded-2xl border border-neutral-200 shadow-sm">
            <MapContainer
                center={[7.1, 125.4]}
                zoom={8}
                scrollWheelZoom={false}
                style={{ height: "480px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FlyTo position={activePosition} />

                {markers.map(({ branch, position }) => (
                    <Marker
                        key={branch.id}
                        position={position}
                        icon={createBranchIcon(branch.id === activeBranchId)}
                    >
                        <Popup>
                            <div style={{ minWidth: 180 }}>
                                <p style={{ fontWeight: 600, marginBottom: 2 }}>
                                    {branch.name} · {branch.area}
                                </p>
                                <p style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
                                    {branch.address}
                                </p>
                                <button
                                    onClick={() => goToBranch(branch)}
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#0F6E63",
                                        textDecoration: "underline",
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                    }}
                                >
                                    View branch details →
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}