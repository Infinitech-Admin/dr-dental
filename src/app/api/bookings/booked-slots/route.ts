import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const month = searchParams.get("month");

        if (!month) {
            return NextResponse.json(
                {
                    message: "month is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const response = await fetch(
            `${API_URL}/api/bookings/booked-slots?month=${month}`,
            {
                cache: "no-store",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 },
        );
    }
}