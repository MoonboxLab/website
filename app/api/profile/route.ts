import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = request.headers.get("uid");

    if (!token || !uid) {
      return NextResponse.json(
        { error: "Authorization token and uid are required" },
        { status: 401 },
      );
    }

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Call new user info API
    const response = await fetch(API_ENDPOINTS.USER_INFO, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        uid: uid,
        token: token,
        lang: lang,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch user info" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(data.result.data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch user info" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("User info fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = request.headers.get("uid");

    if (!token || !uid) {
      return NextResponse.json(
        { error: "Authorization token and uid are required" },
        { status: 401 },
      );
    }

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    const profileData = await request.json();

    // Transform frontend data to match API format
    const apiData = {
      nickname: profileData.alias || null,
      email: profileData.email,
      fullName: profileData.fullName || null,
      avator: profileData.avatar || null,
      whatapp: profileData.whatsapp || null,
      telegram: profileData.telegram || null,
      weixin: profileData.wechat || null,
      holdNft: profileData.hasNobodyNFT || false,
    };

    // Call new user info update API
    const response = await fetch(API_ENDPOINTS.USER_INFO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        uid: uid,
        token: token,
        lang: lang,
      },
      body: JSON.stringify(apiData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to update profile" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Profile updated successfully",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to update profile" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
