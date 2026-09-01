import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {
    try {
        const token = getAuthToken(request)

        const searchParams = request.nextUrl.searchParams

        const branchId = searchParams.get("branch_id")
        const type = searchParams.get("type")

        const params = new URLSearchParams()

        if (branchId) {
            params.set("branch_id", branchId)
        }

        if (type) {
            params.set("type", type)
        }

        const url = `${API_URL}/api/branch-images${params.toString() ? `?${params.toString()}` : ""
            }`

        const response = await fetch(url, {
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
        })

        const data = await response.json()

        return NextResponse.json(data, {
            status: response.status,
        })
    } catch (error) {
        console.error("Branch images GET error:", error)

        return NextResponse.json(
            {
                message: "Failed to fetch branch images.",
            },
            {
                status: 500,
            },
        )
    }
}
