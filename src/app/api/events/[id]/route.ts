import { getAuthToken } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Params = {
    params: Promise<{ id: string }>
}

// GET ONE EVENT
export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params
        const token = getAuthToken(request)

        const res = await fetch(
            `${API_URL}/api/events/${encodeURIComponent(id)}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                cache: "no-store",
            }
        )

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        return NextResponse.json(
            {
                message: "Failed to get event",
                error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 }
        )
    }
}

// UPDATE EVENT
// Laravel route: POST /api/events/{eventId}
export async function POST(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params
        const token = getAuthToken(request)

        const formData = await request.formData()

        const res = await fetch(
            `${API_URL}/api/events/${encodeURIComponent(id)}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: formData,
            }
        )

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        return NextResponse.json(
            {
                message: "Failed to update event",
                error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 }
        )
    }
}

// DELETE EVENT
export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params
        const token = getAuthToken(request)

        const res = await fetch(
            `${API_URL}/api/events/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        )

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        return NextResponse.json(
            {
                message: "Failed to delete event",
                error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 }
        )
    }
}
