import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { API_ENDPOINTS } from "@/constants/env";

// STS 凭证接口
interface STSCredentials {
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
  bucket: string;
  front: string;
}

// 获取STS凭证（服务端）
async function getSTSCredentialsServer(
  request?: Request,
): Promise<STSCredentials> {
  try {
    console.log("Getting STS credentials from:", API_ENDPOINTS.STS_CREDENTIALS);

    // 准备请求头
    const headers: HeadersInit = {};

    // 如果有request参数，传递认证信息
    if (request) {
      const authHeader = request.headers.get("Authorization");
      const uidHeader = request.headers.get("uid");

      if (authHeader) {
        // 提取 token（去掉 "Bearer " 前缀）
        const token = authHeader.replace("Bearer ", "");
        headers["token"] = token;
      }
      if (uidHeader) {
        headers["uid"] = uidHeader;
      }

      console.log("Passing auth headers:", {
        hasAuth: !!authHeader,
        hasUid: !!uidHeader,
      });
    }

    console.log("STS API - Calling external API with headers:", headers);

    const response = await fetch(API_ENDPOINTS.STS_CREDENTIALS, {
      method: "GET",
      headers,
    });

    console.log("STS API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("STS API error response:", errorText);
      throw new Error("Failed to get STS credentials");
    }

    const data = await response.json();
    console.log("STS API response data:", data);

    if (data.code === 0) {
      console.log("STS credentials obtained successfully");
      return data.result.data;
    } else {
      console.error("STS API returned error:", data.msg);
      throw new Error(data.msg || "Failed to get STS credentials");
    }
  } catch (error) {
    console.error("Error getting STS credentials:", error);
    throw new Error("Failed to get STS credentials");
  }
}

// 创建S3客户端（服务端）
async function createS3ClientServer(request?: Request): Promise<S3Client> {
  const credentials = await getSTSCredentialsServer(request);

  return new S3Client({
    region: credentials.region,
    endpoint: credentials.endpoint,
    forcePathStyle: true, // 使用路径样式URL
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });
}

// 上传文件到 S3（服务端）
export async function uploadToS3Server(
  file: Buffer,
  key: string,
  bucketName?: string,
  contentType?: string,
  request?: Request,
): Promise<string> {
  try {
    console.log("Starting S3 upload, key:", key, "contentType:", contentType);

    const credentials = await getSTSCredentialsServer(request);
    const s3Client = await createS3ClientServer(request);
    const bucket = bucketName || credentials.bucket;

    console.log("Using bucket:", bucket, "endpoint:", credentials.endpoint);

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType || "image/jpeg",
      ACL: "public-read" as const,
    };

    console.log("Upload params:", uploadParams);

    // 使用 Upload 类进行上传，支持大文件
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    console.log("Starting upload...");
    const result = await upload.done();
    console.log("Upload completed, result:", result);

    // 返回文件的公开URL
    const avatarUrl = `${credentials.endpoint}${bucket}/${key}`;
    console.log("Generated avatar URL:", avatarUrl);

    return avatarUrl;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
}

// 上传头像文件（服务端）
export async function uploadAvatarServer(
  file: Buffer,
  userId: string,
  request?: Request,
): Promise<string> {
  try {
    // 生成唯一的文件名
    const timestamp = Date.now();
    const key = `avatars/${userId}/${timestamp}.jpg`;

    // 上传到 S3
    const avatarUrl = await uploadToS3Server(
      file,
      key,
      undefined,
      "image/jpeg",
      request,
    );

    return avatarUrl;
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw new Error("Failed to upload avatar");
  }
}

// 上传作品文件（服务端）
export async function uploadWorkFileServer(
  file: Buffer,
  userId: string,
  sampleSong: string,
  originalFileName: string,
  request?: Request,
): Promise<string> {
  try {
    // 生成唯一的文件名
    const timestamp = Date.now();
    const fileExtension = originalFileName.split(".").pop() || "mp3";
    const key = `works/${userId}/${sampleSong}/${timestamp}.${fileExtension}`;

    // 上传到 S3
    const workFileUrl = await uploadToS3Server(
      file,
      key,
      undefined,
      "audio/mpeg",
      request,
    );

    return workFileUrl;
  } catch (error) {
    console.error("Work file upload error:", error);
    throw new Error("Failed to upload work file");
  }
}

// 验证文件类型（服务端）
export function validateImageFileServer(
  file: Buffer,
  contentType: string,
): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(contentType)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
    );
  }

  if (file.length > maxSize) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }

  return true;
}

// 验证音频文件类型（服务端）
export function validateAudioFileServer(
  file: Buffer,
  contentType: string,
  fileName?: string,
): boolean {
  // 允许的 MIME 类型（包含各种变体）
  const allowedMimeTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/ogg",
    "audio/oga",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "audio/mp4a-latm",
    "audio/aac",
    "audio/flac",
    "audio/x-flac",
  ];

  // 允许的文件扩展名
  const allowedExtensions = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];

  const maxSize = 50 * 1024 * 1024; // 50MB for audio files

  // 检查 MIME 类型
  const hasValidMimeType =
    contentType && allowedMimeTypes.includes(contentType);

  // 如果 MIME 类型不匹配，检查文件扩展名
  let hasValidExtension = false;
  if (fileName) {
    const lowerFileName = fileName.toLowerCase();
    hasValidExtension = allowedExtensions.some((ext) =>
      lowerFileName.endsWith(ext),
    );
  }

  // 如果两者都不匹配，抛出错误
  if (!hasValidMimeType && !hasValidExtension) {
    throw new Error(
      "Invalid file type. Only MP3, WAV, OGG, M4A, AAC, and FLAC are allowed.",
    );
  }

  if (file.length > maxSize) {
    throw new Error("File size too large. Maximum size is 50MB.");
  }

  return true;
}
