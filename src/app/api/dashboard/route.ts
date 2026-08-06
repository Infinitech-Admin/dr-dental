import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(req: NextRequest): string | null {
  return req.headers.get("authorization")?.replace("Bearer ", "") ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { message: "Unauthenticated." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const query = new URLSearchParams();

    if (month) {
      query.append("month", month);
    }

    if (year) {
      query.append("year", year);
    }

    const response = await fetch(
      `${API_URL}/api/dashboard?${query.toString()}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to retrieve dashboard data." },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      {
        message: "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}