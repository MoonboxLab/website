import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

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

    // Call third-party login API
    const response = await fetch(
      `${process.env.THIRD_PARTY_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Login failed" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token: data.token,
        user: data.user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
