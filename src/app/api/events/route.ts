import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const VALID_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".gif",
])

export const dynamic = "force-dynamic"

export async function GET() {
    const eventsDirectory = path.join(
        process.cwd(),
        "public",
        "images",
        "events"
    )

    try {
        const eventIds = fs
            .readdirSync(eventsDirectory, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)

        const events = eventIds.map((eventId) => {
            // Images are directly inside:
            // public/images/events/{eventId}/
            const eventDirectory = path.join(
                eventsDirectory,
                eventId
            )

            let images: string[] = []

            try {
                images = fs
                    .readdirSync(eventDirectory, { withFileTypes: true })
                    .filter(
                        (entry) =>
                            entry.isFile() &&
                            VALID_EXTENSIONS.has(
                                path.extname(entry.name).toLowerCase()
                            )
                    )
                    .map((entry) => entry.name)
                    .sort((a, b) =>
                        a.localeCompare(b, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        })
                    )
                    .map(
                        (file) =>
                            `/images/events/${encodeURIComponent(eventId)}/${encodeURIComponent(file)}`
                    )
            } catch {
                images = []
            }

            return {
                id: eventId,
                images,
            }
        })

        return NextResponse.json({ events })
    } catch (error) {
        console.error("Failed to read events:", error)

        return NextResponse.json(
            { events: [] },
            { status: 500 }
        )
    }
}
