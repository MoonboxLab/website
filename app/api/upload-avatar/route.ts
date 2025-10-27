import { NextRequest, NextResponse } from "next/server";
import {
  uploadAvatarServer,
  validateImageFileServer,
} from "@/lib/aws-s3-server";

export async function POST(request: NextRequest) {
  try {
    console.log("Avatar upload API called");

    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    const userId = formData.get("userId") as string;

    console.log("File received:", file?.name, "Size:", file?.size);
    console.log("User ID:", userId);

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userId) {
      console.log("No user ID provided");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // 将File转换为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("File converted to buffer, size:", buffer.length);

    // 验证文件类型和大小
    try {
      validateImageFileServer(buffer, file.type);
      console.log("File validation passed");
    } catch (error: any) {
      console.log("File validation failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 上传到 S3
    console.log("Starting S3 upload...");
    const avatarUrl = await uploadAvatarServer(buffer, userId, request);
    console.log("S3 upload successful, URL:", avatarUrl);

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 },
    );
  }
}
