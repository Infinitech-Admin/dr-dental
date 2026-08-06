import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function parseBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const body: Record<string, string> = {}

    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        body[key] = String(value)
      }
    }

    return body
  }

  return (await request.json()) as Record<string, unknown>
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || ""

  if (!authHeader) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      { status: 401 }
    )
  }

  if (!API_URL) {
    return NextResponse.json(
      {
        success: false,
        message: "NEXT_PUBLIC_API_URL is not configured.",
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${API_URL}/api/my-bookings`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
      },
    })

    const data = (await response.json()) as Record<string, unknown>

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            typeof data.message === "string"
              ? data.message
              : "Failed to fetch bookings.",
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        ...data,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch bookings."

    console.error("Bookings fetch error:", error)

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await parseBody(request)

    if (
      !bookingData?.name ||
      !bookingData?.email ||
      !bookingData?.date ||
      !bookingData?.time
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide name, email, date, and time.",
        },
        { status: 400 }
      )
    }

    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "NEXT_PUBLIC_API_URL is not configured.",
        },
        { status: 500 }
      )
    }

    const authHeader = request.headers.get("authorization") || ""

    const response = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(bookingData),
    })

    const data = (await response.json()) as Record<string, unknown>

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            typeof data.message === "string"
              ? data.message
              : "Failed to create booking.",
          details: data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        ...data,
      },
      { status: response.status }
    )
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create booking."

    console.error("Booking proxy error:", error)

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}