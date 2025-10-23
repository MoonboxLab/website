import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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

// 获取STS凭证
async function getSTSCredentials(): Promise<STSCredentials> {
  try {
    const response = await fetch("/api/sts-credentials");
    if (!response.ok) {
      throw new Error("Failed to get STS credentials");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting STS credentials:", error);
    throw new Error("Failed to get STS credentials");
  }
}

// 创建S3客户端
async function createS3Client(): Promise<S3Client> {
  const credentials = await getSTSCredentials();

  return new S3Client({
    region: credentials.region,
    endpoint: credentials.endpoint,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });
}

// 上传文件到 S3
export async function uploadToS3(
  file: File | Buffer,
  key: string,
  bucketName?: string,
  contentType?: string,
): Promise<string> {
  try {
    const credentials = await getSTSCredentials();
    const s3Client = await createS3Client();
    const bucket = bucketName || credentials.bucket;

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType || "image/jpeg",
      ACL: "public-read" as const,
    };

    // 使用 Upload 类进行上传，支持大文件
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await upload.done();

    // 返回文件的公开URL
    return `${credentials.front}${key}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
}

// 上传头像文件
export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  try {
    // 生成唯一的文件名
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const key = `avatars/${userId}/${timestamp}.${fileExtension}`;

    // 上传到 S3
    const avatarUrl = await uploadToS3(file, key, undefined, file.type);

    return avatarUrl;
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw new Error("Failed to upload avatar");
  }
}

// 删除 S3 文件
export async function deleteFromS3(
  key: string,
  bucketName?: string,
): Promise<void> {
  try {
    const credentials = await getSTSCredentials();
    const s3Client = await createS3Client();
    const bucket = bucketName || credentials.bucket;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error("Failed to delete file from S3");
  }
}

// 验证文件类型
export function validateImageFile(file: File): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

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

// 压缩图片（可选）
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
      // 计算新的尺寸
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // 绘制压缩后的图片
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
