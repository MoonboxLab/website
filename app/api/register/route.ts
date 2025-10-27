import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

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

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Call new registration API
    const formData = new URLSearchParams();
    formData.append("email", email); // Using email as username
    formData.append("password", password);
    formData.append("code", verificationCode);
    formData.append("referrer", referrer || "");

    console.log("Calling registration API:", {
      url: API_ENDPOINTS.USER_REGISTER,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        lang: lang,
      },
      body: formData.toString(),
    });

    const response = await fetch(API_ENDPOINTS.USER_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        lang: lang,
      },
      body: formData,
    });

    console.log("Registration API response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    const data = await response.json();
    console.log("Registration API response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Registration failed" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "User registered and logged in successfully",
          user: data.result.data,
          token: data.result.data.token,
        },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Registration failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
