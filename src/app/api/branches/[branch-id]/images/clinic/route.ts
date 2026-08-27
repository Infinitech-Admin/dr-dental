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

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ "branch-id": string }>
  }
) {
  const { "branch-id": branchId } = await params

  // Prevent path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(branchId)) {
    return NextResponse.json(
      { images: [] },
      { status: 400 }
    )
  }

  const clinicDirectory = path.join(
    process.cwd(),
    "public",
    "images",
    "branches",
    branchId,
    "clinic"
  )

  try {
    const files = fs.readdirSync(clinicDirectory)

    const images = files
      .filter((file) =>
        VALID_EXTENSIONS.has(
          path.extname(file).toLowerCase()
        )
      )
      .sort((a, b) =>
        a.localeCompare(b, undefined, {
          numeric: true,
        })
      )
      .map(
        (file) =>
          `/images/branches/${branchId}/clinic/${file}`
      )

    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ images: [] })
  }
}