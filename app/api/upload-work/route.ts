import { NextRequest, NextResponse } from "next/server";
import {
  uploadWorkFileServer,
  validateAudioFileServer,
} from "@/lib/aws-s3-server";

export async function POST(request: NextRequest) {
  try {
    console.log("Work file upload API called");

    const formData = await request.formData();
    const file = formData.get("workFile") as File;
    const sampleSong = formData.get("sampleSong") as string;
    const userId = formData.get("userId") as string;

    console.log("File received:", file?.name, "Size:", file?.size);
    console.log("Sample song:", sampleSong);
    console.log("User ID:", userId);

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!sampleSong) {
      console.log("No sample song provided");
      return NextResponse.json(
        { error: "Sample song is required" },
        { status: 400 },
      );
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
      validateAudioFileServer(buffer, file.type, file.name);
      console.log("File validation passed");
    } catch (error: any) {
      console.log("File validation failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 上传到 S3
    console.log("Starting S3 upload...");
    const workFileUrl = await uploadWorkFileServer(
      buffer,
      userId,
      sampleSong,
      file.name,
      request,
    );
    console.log("S3 upload successful, URL:", workFileUrl);

    return NextResponse.json({
      success: true,
      workFileUrl,
      sampleSong,
      message: "Work file uploaded successfully",
    });
  } catch (error) {
    console.error("Work file upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload work file" },
      { status: 500 },
    );
  }
}
