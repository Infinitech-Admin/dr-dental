import { getAuthToken } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// GET ALL CASES
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString()
    const targetUrl = `${API_URL}/api/cases${searchParams ? `?${searchParams}` : ""}`

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { message: "Backend error", details: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Route Proxy Error:", err)
    return NextResponse.json(
      { message: "Failed to fetch cases from proxy", error: err.message },
      { status: 500 }
    )
  }
}

// CREATE CASE
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    const formData = await request.formData()

    const res = await fetch(`${API_URL}/api/cases`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to create case", err },
      { status: 500 }
    )
  }
}