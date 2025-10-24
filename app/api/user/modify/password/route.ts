import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = request.headers.get("uid");

    console.log("Password Modify POST - Received headers:", {
      hasAuth: !!request.headers.get("Authorization"),
      hasUid: !!uid,
      tokenLength: token?.length || 0,
      uid: uid,
    });

    if (!token || !uid) {
      console.log("Password Modify POST - Missing auth:", {
        token: !!token,
        uid: !!uid,
      });
      return NextResponse.json(
        { error: "Authorization token and uid are required" },
        { status: 401 },
      );
    }

    // Get language from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const localeMatch = cookieHeader.match(/NEXT_LOCALE=([^;]+)/);
    const lang = localeMatch ? localeMatch[1] : "en";

    const passwordData = await request.json();
    console.log("Password Modify POST - Received password data:", passwordData);

    // Validate required fields
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      return NextResponse.json(
        { error: "Old password and new password are required" },
        { status: 400 },
      );
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("oldPassword", passwordData.oldPassword);
    formData.append("newPassword", passwordData.newPassword);

    console.log("Password Modify POST - Calling external API:", {
      url: API_ENDPOINTS.USER_MODIFY_PASSWORD,
      method: "POST",
      headers: {
        uid: uid,
        token: token,
        lang: lang,
      },
      body: "FormData with oldPassword and newPassword",
    });

    const response = await fetch(API_ENDPOINTS.USER_MODIFY_PASSWORD, {
      method: "POST",
      headers: {
        uid: uid,
        token: token,
        lang: lang,
      },
      body: formData,
    });

    console.log("Password Modify POST - External API response:", {
      status: response.status,
      statusText: response.statusText,
    });

    const data = await response.json();
    console.log("Password Modify POST - External API data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to modify password" },
        { status: response.status },
      );
    }

    // Handle successful response
    if (data.code === 0) {
      return NextResponse.json(
        {
          code: 0,
          msg: "success",
          result: {},
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: data.msg || "Failed to modify password" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Password modify error:", error);
    return NextResponse.json(
      { error: "Failed to modify password" },
      { status: 500 },
    );
  }
}
