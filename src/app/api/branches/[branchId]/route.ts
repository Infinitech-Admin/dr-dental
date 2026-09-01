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
