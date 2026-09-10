import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface RouteContext {
    params: Promise<{
        id: string
    }>
}

export async function PUT(
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

        if (!id) {
            return NextResponse.json(
                {
                    message: "Image ID is required.",
                },
                { status: 400 },
            )
        }

        const response = await fetch(
            `${API_URL}/api/branch-images/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(await request.json()),
            },
        )

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("PUT /api/branch-images/[id] error:", error)

        return NextResponse.json(
            {
                message: "Failed to update branch image.",
            },
            { status: 500 },
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json(
                {
                    message: "Image ID is required.",
                },
                { status: 400 },
            )
        }

        const token = getAuthToken(request)

        const response = await fetch(
            `${API_URL}/api/branch-images/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
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
        console.error("Branch image proxy error:", error)

        return NextResponse.json(
            {
                message: "Failed to delete branch image.",
            },
            { status: 500 },
        )
    }
}