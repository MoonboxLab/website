import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Call third-party verification code API
    const response = await fetch(
      `${process.env.THIRD_PARTY_API_URL}/auth/send-verification-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`,
        },
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to send verification code" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent successfully",
        // In development, return the code for testing
        ...(process.env.NODE_ENV === "development" && {
          code: data.code,
        }),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 },
    );
  }
}
