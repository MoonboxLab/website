"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { uploadAvatar } from "@/lib/aws-s3";

interface AvatarUploadProps {
  onAvatarChange: (avatarUrl: string) => void;
  userId?: string;
  disabled?: boolean;
  isUploading?: boolean;
}

export default function AvatarUpload({
  onAvatarChange,
  userId,
  disabled = false,
  isUploading: externalIsUploading = false,
}: AvatarUploadProps) {
  const t = useTranslations("Profile");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidFileType"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("fileTooLarge"));
      return;
    }

    try {
      setIsUploading(true);

      // 获取用户ID
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.id) {
        toast.error(t("avatarUploadError"));
        setIsUploading(false);
        return;
      }

      // 直接上传到 S3（客户端上传，绕过 Vercel 4.5MB 限制）
      const avatarUrl = await uploadAvatar(file, user.id);

      // 上传成功后，调用回调函数
      onAvatarChange(avatarUrl);
      toast.success(t("avatarUploadSuccess") || "头像上传成功");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(t("avatarUploadError"));
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (disabled || isUploading || externalIsUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div
        onClick={handleClick}
        className={`absolute inset-0 flex items-center justify-center rounded-[12px] bg-black/50 transition-opacity duration-200 ${
          disabled || isUploading || externalIsUploading
            ? "cursor-not-allowed opacity-100"
            : "cursor-pointer opacity-20 hover:opacity-100"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-white">
          {isUploading || externalIsUploading ? (
            <>
              <div className="mb-[4px] h-[24px] w-[24px] animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="text-[12px] font-medium">{t("uploading")}</span>
            </>
          ) : (
            <>
              <svg
                className="mb-[4px] h-[24px] w-[24px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-[12px] font-medium">
                {t("changeAvatar")}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
