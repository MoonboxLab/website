import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Creation ID is required" },
        { status: 400 },
      );
    }

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

    // Call music vote record API with creation ID
    const response = await fetch(
      `${API_ENDPOINTS.MUSIC_VOTE_RECORD}?id=${id}`,
      {
        method: "GET",
        headers,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch vote records" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Vote records fetched successfully",
          data: data.result.data,
          creation: data.result.creation,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch vote records" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Vote record fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vote records" },
      { status: 500 },
    );
  }
}
