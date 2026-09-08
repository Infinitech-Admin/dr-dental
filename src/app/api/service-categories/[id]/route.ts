import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

function getAuthToken(request: NextRequest): string | null {
    const authHeader = request.headers.get("authorization")
    const cookieToken = request.cookies.get("auth_token")?.value

    return authHeader?.replace("Bearer ", "") || cookieToken || null
}

// GET ONE
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getAuthToken(req)

        const { id } = await params

        const res = await fetch(
            `${API_URL}/api/service-categories/${id}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    ...(token && {
                        Authorization: `Bearer ${token}`,
                    }),
                },
                cache: "no-store",
            }
        )

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        console.error("GET service category failed:", err)

        return NextResponse.json(
            {
                message: "GET service category failed",
                error: err instanceof Error ? err.message : err,
            },
            { status: 500 }
        )
    }
}

// UPDATE
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getAuthToken(req)

        const { id } = await params

        const formData = await req.formData()


        const res = await fetch(
            `${API_URL}/api/service-categories/${id}`,
            {
                method: "PUT",
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
        console.error("UPDATE service category failed:", err)

        return NextResponse.json(
            {
                message: "UPDATE service category failed",
                error: err instanceof Error ? err.message : err,
            },
            { status: 500 }
        )
    }
}

// DELETE
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getAuthToken(req)

        const { id } = await params

        const res = await fetch(
            `${API_URL}/api/service-categories/${id}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    ...(token && {
                        Authorization: `Bearer ${token}`,
                    }),
                },
            }
        )

        const data = await res.json()

        return NextResponse.json(data, {
            status: res.status,
        })
    } catch (err) {
        console.error("DELETE service category failed:", err)

        return NextResponse.json(
            {
                message: "DELETE service category failed",
                error: err instanceof Error ? err.message : err,
            },
            { status: 500 }
        )
    }
}