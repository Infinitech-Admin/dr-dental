import { getAuthToken } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Params = {
    params: Promise<{
        id: string
        imageIndex: string
    }>
}

// DELETE EVENT IMAGE
export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id, imageIndex } = await params
        const token = getAuthToken(request)

        const index = Number(imageIndex)

        if (!Number.isInteger(index) || index < 0) {
            return NextResponse.json(
                {
                    message: "Invalid image index",
                },
                { status: 400 }
            )
        }

        const res = await fetch(
            `${API_URL}/api/events/${encodeURIComponent(id)}/images/${index}`,
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
                message: "Failed to delete event image",
                error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 }
        )
    }
}
