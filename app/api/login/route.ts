import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("Login attempt:", { email, passwordLength: password?.length });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Mock login for testing
    if (email === "test@example.com" && password === "123456") {
      const mockUser = {
        id: "mock-user-123",
        fullName: "張三",
        alias: "張三豐",
        email: "test@example.com",
        hasNobodyNFT: true,
        whatsapp: "+886912345678",
        wechat: "zhangsan_wx",
        telegram: "@zhangsan_tg",
        avatar: "/uploads/avatars/mock-avatar.jpg",
      };

      const mockToken = "mock-jwt-token-12345";

      return NextResponse.json(
        {
          success: true,
          message: "Mock login successful",
          token: mockToken,
          user: mockUser,
        },
        { status: 200 },
      );
    }

    // Call new login API
    const formData = new URLSearchParams();
    formData.append("username", email); // Using email as username
    formData.append("password", password);

    const response = await fetch(API_ENDPOINTS.USER_LOGIN, {
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
        { error: data.msg || "Login failed" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Login successful",
          token: data.result.data.token,
          user: data.result.data,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Login failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
