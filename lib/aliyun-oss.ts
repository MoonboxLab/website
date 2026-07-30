import OSS from "ali-oss";

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

type RefreshSTSToken = NonNullable<OSS.Options["refreshSTSToken"]>;

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

async function getOSSCredentials(): Promise<OSSCredentials> {
  try {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    const headers: HeadersInit = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    if (user?.id) {
      headers.uid = user.id;
    }

    const response = await fetch("/api/sts-credentials", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to get OSS STS credentials");
    }

    const credentials = (await response.json()) as OSSCredentials;
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
  refreshSTSToken?: RefreshSTSToken,
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

// 浏览器直传到阿里云 OSS，避免大文件经过 Next.js 服务端。
export async function uploadToOSS(
  file: File | Blob,
  key: string,
  bucketName?: string,
  contentType?: string,
): Promise<string> {
  try {
    const credentials = await getOSSCredentials();
    const client = createOSSClient(credentials, bucketName, async () =>
      toOSSSTSCredentials(await getOSSCredentials()),
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

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const key = `avatars/${userId}/${timestamp}.${fileExtension}`;

    return await uploadToOSS(file, key, undefined, file.type);
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw new Error("Failed to upload avatar");
  }
}

export async function uploadWorkFile(
  file: File,
  userId: string,
  sampleSong: string,
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "mp3";
    const key = `works/${userId}/${sampleSong}/${timestamp}.${fileExtension}`;

    return await uploadToOSS(file, key, undefined, file.type);
  } catch (error) {
    console.error("Work file upload error:", error);
    throw new Error("Failed to upload work file");
  }
}

export function validateImageFile(file: File): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }

  return true;
}

export function compressImage(
  file: File,
  maxWidth: number = 300,
  quality: number = 0.8,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        file.type,
        quality,
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
