import { getAuthToken } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Params = {
  params: Promise<{ id: string }>
}

async function updateCase(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const token = getAuthToken(request)
    const formData = await request.formData()

    formData.set("_method", "PUT")

    const res = await fetch(`${API_URL}/api/cases/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    const responseText = await res.text()
    let data: unknown

    try {
      data = JSON.parse(responseText)
    } catch {
      data = { message: responseText || "Backend returned an invalid response." }
    }

    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error("Failed to update dental case:", err)
    return NextResponse.json(
      { message: "Failed to update case" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, context: Params) {
  return updateCase(request, context)
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const token = getAuthToken(request)

    const res = await fetch(`${API_URL}/api/cases/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to get case", err },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const token = getAuthToken(request)
    const formData = await request.formData()

    formData.set("_method", "PUT")

    const res = await fetch(`${API_URL}/api/cases/${id}`, {
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
      { message: "Failed to update case", err },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const token = getAuthToken(request)

    const res = await fetch(`${API_URL}/api/cases/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete case", err },
      { status: 500 }
    )
  }
}