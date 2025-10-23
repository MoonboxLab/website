"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AvatarUploadProps {
  onAvatarChange: (avatarUrl: string) => void;
}

export default function AvatarUpload({ onAvatarChange }: AvatarUploadProps) {
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

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onAvatarChange(data.avatarUrl);
        toast.success(t("avatarUploadSuccess"));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t("avatarUploadError"));
      }
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
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-[12px]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={handleClick}
        disabled={isUploading}
        className="hover-btn-shadow h-[40px] w-full rounded-[8px] border-[2px] border-black bg-[rgba(255,214,0,1)] text-[14px] font-medium text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
      >
        {isUploading ? t("uploading") : t("changeAvatar")}
      </Button>
    </div>
  );
}
