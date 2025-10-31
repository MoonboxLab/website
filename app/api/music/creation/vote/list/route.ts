import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";
import { handleApiResponse } from "@/lib/api-response-handler";

export async function GET(request: Request) {
  try {
    console.log("=== Music Creation Vote List API Called ===");

    // Get authentication headers
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = request.headers.get("uid");

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Get monthNumber from query parameters (optional)
    const { searchParams } = new URL(request.url);
    const monthNumber = searchParams.get("monthNumber");

    console.log("Request details:", {
      token: token ? "***" + token.slice(-4) : "none",
      uid: uid || "none",
      lang,
      monthNumber: monthNumber || "none",
      url: request.url,
    });

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

    // Build URL with optional query parameters
    const url = new URL(API_ENDPOINTS.MUSIC_CREATION_VOTE_LIST);
    if (monthNumber) {
      url.searchParams.set("monthNumber", monthNumber);
    }

    console.log("External API call:", {
      url: url.toString(),
      headers: Object.keys(headers),
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    console.log("External API response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    const data = await response.json();
    console.log("External API data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.log("External API error:", data);
      return NextResponse.json(
        { error: data.msg || "Failed to fetch music creation vote list" },
        { status: response.status },
      );
    }

    // Check for login requirement (code 104)
    const loginResponse = handleApiResponse(data, "Failed to fetch music creation vote list");
    if (loginResponse) {
      return loginResponse;
    }

    // Handle successful response
    if (data.code === 0) {
      console.log("Success response:", {
        dataLength: data.result?.data?.length || 0,
        firstItem: data.result?.data?.[0] || null,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Music creation vote list fetched successfully",
          data: data.result.data,
        },
        { status: 200 },
      );
    } else {
      console.log("API returned non-zero code:", data);
      return NextResponse.json(
        { error: data.msg || "Failed to fetch music creation vote list" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Music creation vote list fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch music creation vote list" },
      { status: 500 },
    );
  }
}
