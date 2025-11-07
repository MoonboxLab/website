import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function GET(request: Request) {
  try {
    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // Call third-party API
    const response = await fetch(API_ENDPOINTS.USER_REFERRER_LIST, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        lang: lang,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch referrer list" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          code: data.code,
          msg: data.msg,
          result: data.result,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch referrer list" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Referrer list fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrer list" },
      { status: 500 },
    );
  }
}

