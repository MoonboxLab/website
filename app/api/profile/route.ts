import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/env";
import { handleApiResponse } from "@/lib/api-response-handler";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = request.headers.get("uid");

    console.log("Profile GET - Received headers:", {
      hasAuth: !!request.headers.get("Authorization"),
      hasUid: !!uid,
      tokenLength: token?.length || 0,
      uid: uid,
    });

    if (!token || !uid) {
      console.log("Profile GET - Missing auth:", {
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

    // Call new user info API
    console.log("Profile GET - Calling external API:", {
      url: API_ENDPOINTS.USER_INFO,
      headers: {
        "Content-Type": "application/json",
        uid: uid,
        token: token,
        lang: lang,
      },
    });

    const response = await fetch(API_ENDPOINTS.USER_INFO, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        uid: uid,
        token: token,
        lang: lang,
      },
    });

    console.log("Profile GET - External API response:", {
      status: response.status,
      statusText: response.statusText,
    });

    const data = await response.json();
    console.log("Profile GET - External API data:", data);

    if (!response.ok) {
      console.log("Profile GET - External API error:", data);
      return NextResponse.json(
        { error: data.msg || "Failed to fetch user info" },
        { status: response.status },
      );
    }

    // Check for login requirement (code 104)
    const loginResponse = handleApiResponse(data, "Failed to fetch user info");
    if (loginResponse) {
      return loginResponse;
    }

    // Handle successful response
    if (data.code === 0) {
      const apiData = data.result.data;
      console.log("Profile GET - Raw API data:", apiData);
      console.log(
        "Profile GET - Address in raw API data:",
        apiData.address || apiData.walletAddress,
      );

      // Transform API data to match frontend format
      const transformedData = {
        id: apiData.id || apiData.uid || "",
        fullName: apiData.fullName || "",
        alias: apiData.nickname || "", // Convert nickname to alias
        email: apiData.email || "",
        hasNobodyNFT: apiData.holdNft || false,
        whatsapp: apiData.whatapp || "",
        wechat: apiData.weixin || "",
        telegram: apiData.telegram || "",
        avatar: apiData.avator || "",
        address: apiData.address || apiData.walletAddress || "",
      };

      console.log("Profile GET - Transformed data:", transformedData);
      console.log(
        "Profile GET - Address in transformed data:",
        transformedData.address,
      );
      return NextResponse.json(transformedData, { status: 200 });
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

    console.log("Profile PUT - Received headers:", {
      hasAuth: !!request.headers.get("Authorization"),
      hasUid: !!uid,
      tokenLength: token?.length || 0,
      uid: uid,
    });

    if (!token || !uid) {
      console.log("Profile PUT - Missing auth:", {
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

    const profileData = await request.json();
    console.log("Profile PUT - Received profile data:", profileData);
    console.log(
      "Profile PUT - Address in received profile data:",
      profileData.address,
    );

    // Transform frontend data to match API format
    const apiData = {
      nickname: profileData.alias || null,
      fullName: profileData.fullName || null,
      avator: profileData.avatar || null,
      whatapp: profileData.whatsapp || null,
      telegram: profileData.telegram || null,
      weixin: profileData.wechat || null,
      holdNft: profileData.hasNobodyNFT || false,
      address: profileData.address || null,
    };

    console.log("Profile PUT - Transformed API data:", apiData);
    console.log(
      "Profile PUT - Address in transformed API data:",
      apiData.address,
    );

    // Call new user info update API
    console.log("Profile PUT - Calling external API:", {
      url: API_ENDPOINTS.USER_INFO,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        uid: uid,
        token: token,
        lang: lang,
      },
      body: apiData,
    });

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

    console.log("Profile PUT - External API response:", {
      status: response.status,
      statusText: response.statusText,
    });

    const data = await response.json();
    console.log("Profile PUT - External API data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.msg || "Failed to update profile" },
        { status: response.status },
      );
    }

    // Check for login requirement (code 104)
    const loginResponse = handleApiResponse(data, "Failed to update profile");
    if (loginResponse) {
      return loginResponse;
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
