import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    // Call third-party API to get user profile
    const response = await fetch(
      `${process.env.THIRD_PARTY_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`,
          "User-Token": token,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch profile" },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    const profileData = await request.json();

    // Call third-party API to update user profile
    const response = await fetch(
      `${process.env.THIRD_PARTY_API_URL}/user/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`,
          "User-Token": token,
        },
        body: JSON.stringify(profileData),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to update profile" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: data.user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
