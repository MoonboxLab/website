import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function POST(request: Request) {
  try {
    const { email, password, code } = await request.json();

    if (!email || !password || !code) {
      return NextResponse.json(
        { error: "Email, password, and verification code are required" },
        { status: 400 },
      );
    }

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Call reset password API
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("code", code);

    const response = await fetch(API_ENDPOINTS.USER_RESET_PASSWORD, {
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
        { error: data.msg || "Failed to reset password" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Password reset successfully",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to reset password" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
