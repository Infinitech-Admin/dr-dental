import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

function getAuthToken(request: NextRequest): string | null {
    const authHeader = request.headers.get("authorization")
    const cookieToken = request.cookies.get("auth_token")?.value

    return authHeader?.replace("Bearer ", "") || cookieToken || null
}

// GET ALL
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams.toString()

        const url = `${API_URL}/api/service-categories${searchParams ? `?${searchParams}` : ""
            }`

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        })

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        console.error("GET service categories failed:", err)

        return NextResponse.json(
            {
                message: "GET service categories failed",
                error: err instanceof Error ? err.message : err,
            },
            { status: 500 }
        )
    }
}

// CREATE
export async function POST(req: NextRequest) {
    try {
        const token = getAuthToken(req)

        const formData = await req.formData()

        const res = await fetch(
            `${API_URL}/api/service-categories`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    ...(token && {
                        Authorization: `Bearer ${token}`,
                    }),
                },
                body: formData,
            }
        )

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        console.error("CREATE service category failed:", err)

        return NextResponse.json(
            {
                message: "CREATE service category failed",
                error: err instanceof Error ? err.message : err,
            },
            { status: 500 }
        )
    }
}