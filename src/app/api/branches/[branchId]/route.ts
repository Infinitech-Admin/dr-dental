import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface RouteContext {
    params: Promise<{
        branchId: string
    }>
}

export async function GET(
    request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { branchId } = await params

        if (!branchId) {
            return NextResponse.json(
                {
                    message: "Branch ID is required.",
                },
                { status: 400 },
            )
        }

        const token = getAuthToken(request)

        const response = await fetch(
            `${API_URL}/api/branches/${encodeURIComponent(branchId)}`,
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
        console.error("Branch proxy error:", error)

        return NextResponse.json(
            {
                message: "Failed to fetch branch.",
            },
            { status: 500 },
        )
    }
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
        const { branchId } = await params

        if (!branchId) {
            return NextResponse.json(
                {
                    message: "Branch ID is required.",
                },
                { status: 400 },
            )
        }

        const body = await request.json()
        const response = await fetch(
            `${API_URL}/api/branches/${encodeURIComponent(branchId)}`,
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            },
        )

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("PUT /api/branches/[branchId] error:", error)

        return NextResponse.json(
            {
                message: "Failed to update branch.",
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
        const { branchId } = await params

        if (!branchId) {
            return NextResponse.json(
                {
                    message: "Branch ID is required.",
                },
                { status: 400 },
            )
        }

        const response = await fetch(
            `${API_URL}/api/branches/${encodeURIComponent(branchId)}`,
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
        console.error("DELETE /api/branches/[branchId] error:", error)

        return NextResponse.json(
            {
                message: "Failed to delete branch.",
            },
            { status: 500 },
        )
    }
}
