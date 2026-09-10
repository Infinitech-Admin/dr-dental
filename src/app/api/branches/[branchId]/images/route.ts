import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface RouteContext {
    params: Promise<{
        branchId: string
    }>
}

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
        const { branchId } = await params

        if (!branchId) {
            return NextResponse.json(
                {
                    message: "Branch ID is required.",
                },
                { status: 400 },
            )
        }

        const incomingContentType = request.headers.get("content-type")
        const body = await request.arrayBuffer()

        if (!incomingContentType) {
            return NextResponse.json(
                {
                    message: "Multipart upload content type is missing.",
                },
                { status: 400 },
            )
        }

        const response = await fetch(
            `${API_URL}/api/branches/${encodeURIComponent(branchId)}/images`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": incomingContentType,
                    Authorization: `Bearer ${token}`,
                },
                body,
            },
        )

        const contentType = response.headers.get("content-type") || ""

        if (contentType.includes("application/json")) {
            const data = await response.json()

            if (!response.ok) {
                console.error("Branch image upload rejected by backend:", {
                    status: response.status,
                    data,
                })
            }

            return NextResponse.json(data, {
                status: response.status,
            })
        }

        const text = await response.text()

        console.error("Branch image API returned non-JSON response:", {
            status: response.status,
            body: text,
        })

        return NextResponse.json(
            {
                message: text || "Branch image upload failed.",
            },
            {
                status: response.status,
            },
        )
    } catch (error) {
        console.error(
            "POST /api/branches/[branchId]/images error:",
            error,
        )

        return NextResponse.json(
            {
                message: "Failed to upload branch images.",
            },
            { status: 500 },
        )
    }
}
