import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface RouteContext {
    params: Promise<{
        id: string
    }>
}

export async function GET(
    request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json(
                {
                    message: "Team member ID is required.",
                },
                { status: 400 },
            )
        }

        const token = getAuthToken(request)

        const response = await fetch(
            `${API_URL}/api/teams/${encodeURIComponent(id)}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    ...(token
                        ? {
                            Authorization: `Bearer ${token}`,
                        }
                        : {}),
                },
                cache: "no-store",
            },
        )

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("GET /api/teams/[id] error:", error)

        return NextResponse.json(
            {
                message: "Failed to fetch team member.",
            },
            { status: 500 },
        )
    }
}

/**
 * Handles updates.
 *
 * The frontend sends POST with a `_method: "PUT"` field in the
 * FormData (Laravel method spoofing) because native fetch can't
 * send a real PUT with multipart file data reliably.
 */
export async function POST(
    request: NextRequest,
    { params }: RouteContext,
) {
    const token = getAuthToken(request)

    if (!token) {
        return NextResponse.json(
            {
                message: "Unauthenticated.",
            },
            { status: 401 },
        )
    }

    try {
        const { id } = await params
        const formData = await request.formData()

        const response = await fetch(
            `${API_URL}/api/teams/${encodeURIComponent(id)}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            },
        )

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("POST /api/teams/[id] error:", error)

        return NextResponse.json(
            {
                message: "Failed to update team member.",
            },
            { status: 500 },
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext,
) {
    const token = getAuthToken(request)

    if (!token) {
        return NextResponse.json(
            {
                message: "Unauthenticated.",
            },
            { status: 401 },
        )
    }

    try {
        const { id } = await params

        const response = await fetch(
            `${API_URL}/api/teams/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("DELETE /api/teams/[id] error:", error)

        return NextResponse.json(
            {
                message: "Failed to delete team member.",
            },
            { status: 500 },
        )
    }
}