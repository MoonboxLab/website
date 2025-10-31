import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function GET(request: NextRequest) {
  try {
    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Get authentication headers
    const authHeader = request.headers.get("Authorization");
    const uidHeader = request.headers.get("uid");

    console.log("STS API - Received headers:", {
      hasAuth: !!authHeader,
      hasUid: !!uidHeader,
      lang: lang,
    });

    // Prepare headers for external API call
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      lang: lang,
    };

    // Add authentication headers if present
    if (authHeader) {
      // Extract token (remove "Bearer " prefix)
      const token = authHeader.replace("Bearer ", "");
      headers["token"] = token;
    }
    if (uidHeader) {
      headers["uid"] = uidHeader;
    }

    console.log("STS API - Calling external API with headers:", headers);

    const response = await fetch(API_ENDPOINTS.STS_CREDENTIALS, {
      method: "GET",
      headers,
    });

    console.log("STS API - External API response status:", response.status);

    const data = await response.json();
    console.log("STS API - External API response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to get STS credentials" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(data.result.data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to get STS credentials" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("STS credentials error:", error);
    return NextResponse.json(
      { error: "Failed to get STS credentials" },
      { status: 500 },
    );
  }
}
