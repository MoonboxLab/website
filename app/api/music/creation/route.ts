import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function POST(request: NextRequest) {
  try {
    console.log("Music creation API called");

    const body = await request.json();
    const { templateId, url, title } = body;

    console.log("Creation data:", { templateId, url, title });

    // 验证必需参数
    if (!templateId) {
      return NextResponse.json(
        { code: 1, msg: "templateId is required" },
        { status: 400 },
      );
    }

    if (!url) {
      return NextResponse.json(
        { code: 1, msg: "url is required" },
        { status: 400 },
      );
    }

    if (!title) {
      return NextResponse.json(
        { code: 1, msg: "title is required" },
        { status: 400 },
      );
    }

    // 获取认证信息
    const authHeader = request.headers.get("Authorization");
    const uidHeader = request.headers.get("uid");

    if (!authHeader || !uidHeader) {
      return NextResponse.json(
        { code: 1, msg: "Authentication required" },
        { status: 401 },
      );
    }

    // 获取语言设置
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    // 调用第三方API创建作品
    console.log("Calling external music creation API:", {
      url: API_ENDPOINTS.MUSIC_CREATION,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        uid: uidHeader,
        lang: lang,
      },
      body: { templateId, url, title },
    });

    const response = await fetch(API_ENDPOINTS.MUSIC_CREATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        uid: uidHeader,
        lang: lang,
      },
      body: JSON.stringify({ templateId, url, title }),
    });

    console.log("External API response:", {
      status: response.status,
      statusText: response.statusText,
    });

    const data = await response.json();
    console.log("External API response data:", data);

    if (!response.ok) {
      console.log("External API error:", data);
      return NextResponse.json(
        { code: 1, msg: data.msg || "Failed to create music" },
        { status: response.status },
      );
    }

    // 处理成功响应
    if (data.code === 0) {
      console.log("Music creation successful");
      return NextResponse.json({
        code: 0,
        msg: "success",
        result: data.result || {},
      });
    } else {
      console.log("External API returned error:", data.msg);
      return NextResponse.json(
        { code: 1, msg: data.msg || "Failed to create music" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Music creation error:", error);
    return NextResponse.json(
      { code: 1, msg: "Failed to create music" },
      { status: 500 },
    );
  }
}
