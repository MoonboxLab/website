import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";
import { handleApiResponse } from "@/lib/api-response-handler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthNumber = searchParams.get("monthNumber");

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

    // Build URL with optional query parameters
    const url = new URL(API_ENDPOINTS.MUSIC_VOTE_NFT);
    if (monthNumber) {
      url.searchParams.set("monthNumber", monthNumber);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch NFT vote count" },
        { status: response.status },
      );
    }

    // Check for login requirement (code 104)
    const loginResponse = handleApiResponse(
      data,
      "Failed to fetch NFT vote count",
    );
    if (loginResponse) {
      return loginResponse;
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "NFT vote count fetched successfully",
          data: data.result?.data || 0,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch NFT vote count" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("NFT vote count fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFT vote count" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creationId, count } = body;

    // 验证必需参数
    if (typeof creationId !== "number" || creationId <= 0) {
      return NextResponse.json(
        { error: "creationId is required and must be a positive integer" },
        { status: 400 },
      );
    }

    if (typeof count !== "number" || count <= 0) {
      return NextResponse.json(
        { error: "count is required and must be a positive integer" },
        { status: 400 },
      );
    }

    // Get authentication headers
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

    // Prepare headers for external API call
    const headers: HeadersInit = {
      "Content-Type": "application/x-www-form-urlencoded",
      lang: lang,
      token: token,
      uid: uid,
    };

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("creationId", creationId.toString());
    formData.append("count", count.toString());

    const response = await fetch(API_ENDPOINTS.MUSIC_VOTE_NFT, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    // Check for login requirement (code 104) - 优先检查，无论 HTTP 状态码如何
    const loginResponse = handleApiResponse(data, "Failed to vote with NFT");
    if (loginResponse) {
      return loginResponse;
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to vote with NFT" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          success: true,
          message: data.msg || "NFT vote successful",
          data: data.result || {},
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to vote with NFT" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("NFT vote error:", error);
    return NextResponse.json(
      { error: "Failed to vote with NFT" },
      { status: 500 },
    );
  }
}
