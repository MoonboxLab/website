import OSS from "ali-oss";
import { API_ENDPOINTS } from "@/constants/env";

// 测试接口继续返回原有字段名，这里只在接入 OSS SDK 时做字段映射。
interface OSSCredentials {
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
  bucket: string;
  front: string;
}

function toOSSSTSCredentials(credentials: OSSCredentials) {
  return {
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.secretAccessKey,
    stsToken: credentials.sessionToken,
  };
}

function validateOSSCredentials(credentials: OSSCredentials) {
  if (
    !credentials.accessKeyId ||
    !credentials.secretAccessKey ||
    !credentials.sessionToken ||
    !credentials.bucket ||
    (!credentials.endpoint && !credentials.region)
  ) {
    throw new Error("Invalid OSS STS credentials");
  }
}

async function getOSSCredentialsServer(
  request?: Request,
): Promise<OSSCredentials> {
  try {
    const headers: HeadersInit = {};

    if (request) {
      const authHeader = request.headers.get("Authorization");
      const uidHeader = request.headers.get("uid");

      if (authHeader) {
        headers.token = authHeader.replace("Bearer ", "");
      }
      if (uidHeader) {
        headers.uid = uidHeader;
      }
    }

    const response = await fetch(API_ENDPOINTS.STS_CREDENTIALS, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`OSS STS request failed with ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg || "Failed to get OSS STS credentials");
    }

    const credentials = data.result.data as OSSCredentials;
    validateOSSCredentials(credentials);
    return credentials;
  } catch (error) {
    console.error("Error getting OSS STS credentials:", error);
    throw new Error("Failed to get OSS STS credentials");
  }
}

function createOSSClient(
  credentials: OSSCredentials,
  bucketName?: string,
  refreshSTSToken?: OSS.Options["refreshSTSToken"],
): OSS {
  validateOSSCredentials(credentials);

  const options: OSS.Options = {
    ...toOSSSTSCredentials(credentials),
    bucket: bucketName || credentials.bucket,
    secure: !credentials.endpoint?.toLowerCase().startsWith("http://"),
    refreshSTSToken,
    refreshSTSTokenInterval: 5 * 60 * 1000,
  };

  if (credentials.endpoint) {
    options.endpoint = credentials.endpoint.replace(/\/+$/, "");
  } else {
    options.region = credentials.region;
  }

  return new OSS(options);
}

export async function uploadToOSSServer(
  file: Buffer,
  key: string,
  bucketName?: string,
  contentType?: string,
  request?: Request,
): Promise<string> {
  try {
    const credentials = await getOSSCredentialsServer(request);
    const client = createOSSClient(credentials, bucketName, async () =>
      toOSSSTSCredentials(await getOSSCredentialsServer(request)),
    );

    await client.multipartUpload(key, file, {
      parallel: 4,
      partSize: 5 * 1024 * 1024,
      mime: contentType || "application/octet-stream",
      headers: {
        "x-oss-object-acl": "public-read",
      },
    });

    return client.generateObjectUrl(key, credentials.front || undefined);
  } catch (error) {
    console.error("OSS upload error:", error);
    throw new Error("Failed to upload file to OSS");
  }
}

export async function uploadAvatarServer(
  file: Buffer,
  userId: string,
  contentType: string,
  originalFileName: string,
  request?: Request,
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExtension = originalFileName.split(".").pop() || "jpg";
    const key = `avatars/${userId}/${timestamp}.${fileExtension}`;

    return await uploadToOSSServer(file, key, undefined, contentType, request);
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw new Error("Failed to upload avatar");
  }
}

export async function uploadWorkFileServer(
  file: Buffer,
  userId: string,
  sampleSong: string,
  originalFileName: string,
  contentType: string,
  request?: Request,
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExtension = originalFileName.split(".").pop() || "mp3";
    const key = `works/${userId}/${sampleSong}/${timestamp}.${fileExtension}`;

    return await uploadToOSSServer(file, key, undefined, contentType, request);
  } catch (error) {
    console.error("Work file upload error:", error);
    throw new Error("Failed to upload work file");
  }
}

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
  const maxSize = 5 * 1024 * 1024;

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

export function validateAudioFileServer(
  file: Buffer,
  contentType: string,
  fileName?: string,
): boolean {
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
  const allowedExtensions = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];
  const maxSize = 50 * 1024 * 1024;

  const hasValidMimeType =
    contentType && allowedMimeTypes.includes(contentType);

  let hasValidExtension = false;
  if (fileName) {
    const lowerFileName = fileName.toLowerCase();
    hasValidExtension = allowedExtensions.some((extension) =>
      lowerFileName.endsWith(extension),
    );
  }

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
