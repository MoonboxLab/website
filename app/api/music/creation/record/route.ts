import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function GET(request: Request) {
  try {
    // Get authentication headers
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = request.headers.get("uid");

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Prepare headers for external API call
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      lang: lang,
    };

    // Add authentication headers if present
    if (token) {
      headers["token"] = token;
    }
    if (uid) {
      headers["uid"] = uid;
    }

    // Call music creation record API
    const response = await fetch(API_ENDPOINTS.MUSIC_CREATION_RECORD, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch music creation records" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Music creation records fetched successfully",
          data: data.result.data,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch music creation records" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Music creation record fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch music creation records" },
      { status: 500 },
    );
  }
}
