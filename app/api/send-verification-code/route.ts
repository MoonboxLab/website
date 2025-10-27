import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Call new email verification code API
    const formData = new URLSearchParams();
    formData.append("email", email);

    const response = await fetch(API_ENDPOINTS.SEND_EMAIL_CODE, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        lang: lang,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to send verification code" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Verification code sent successfully",
          // In development, return the code for testing
          ...(process.env.NODE_ENV === "development" && {
            code: data.result?.code,
          }),
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to send verification code" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 },
    );
  }
}
