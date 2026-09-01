import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/api/branches`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        })

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("GET /api/branches error:", error)

        return NextResponse.json(
            {
                message: "Failed to fetch branches.",
            },
            {
                status: 500,
            }
        )
    }
}

export async function POST(request: NextRequest) {
    const token = getAuthToken(request)

    if (!token) {
        return NextResponse.json(
            {
                message: "Unauthenticated.",
            },
            {
                status: 401,
            }
        )
    }

    try {
        const body = await request.json()

        const response = await fetch(`${API_URL}/api/branches`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("POST /api/branches error:", error)

        return NextResponse.json(
            {
                message: "Failed to create branch.",
            },
            {
                status: 500,
            }
        )
    }
}
