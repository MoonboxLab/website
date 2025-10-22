import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, verificationCode, referrer } =
      await request.json();

    if (!email || !password || !verificationCode) {
      return NextResponse.json(
        { error: "Email, password, and verification code are required" },
        { status: 400 },
      );
    }

    // Call third-party registration API
    const response = await fetch(
      `${process.env.THIRD_PARTY_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          password,
          verificationCode,
          referrer: referrer || null,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: data.user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
