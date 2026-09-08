import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const branchId = searchParams.get("branch_id")

        const query = branchId
            ? `?branch_id=${encodeURIComponent(branchId)}`
            : ""

        const response = await fetch(`${API_URL}/api/teams${query}`, {
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
        console.error("GET /api/teams error:", error)

        return NextResponse.json(
            {
                message: "Failed to fetch team members.",
            },
            {
                status: 500,
            },
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
            },
        )
    }

    try {
        const formData = await request.formData()

        const response = await fetch(`${API_URL}/api/teams`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                // Do NOT set Content-Type manually — fetch sets the
                // correct multipart/form-data boundary automatically
                // when body is a FormData instance.
            },
            body: formData,
        })

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("POST /api/teams error:", error)

        return NextResponse.json(
            {
                message: "Failed to create team member.",
            },
            {
                status: 500,
            },
        )
    }
}