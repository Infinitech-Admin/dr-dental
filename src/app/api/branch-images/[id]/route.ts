import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"])

export const dynamic = "force-dynamic" // always read the folder fresh

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    // prevent path traversal (../../etc)
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        return NextResponse.json({ images: [] }, { status: 400 })
    }

    const dir = path.join(process.cwd(), "public", "images", "branch", id)

    try {
        const files = fs.readdirSync(dir)
        const images = files
            .filter((f) => VALID_EXT.has(path.extname(f).toLowerCase()))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .map((f) => `/images/branch/${id}/${f}`)

        return NextResponse.json({ images })
    } catch {
        // folder doesn't exist yet — return empty, not an error
        return NextResponse.json({ images: [] })
    }
} 