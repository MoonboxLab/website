"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  musics: any[];
}

export default function UploadWorkModal({
  open,
  onOpenChange,
  musics,
}: UploadWorkModalProps) {
  const t = useTranslations("Music");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState({
    sampleSong: "",
    workFile: null as File | null,
  });

  const handleSampleSongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      sampleSong: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
        "audio/aac",
        "audio/flac",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(t("invalidFileType"));
        // 重置input
        e.target.value = "";
        return;
      }

      // 验证文件大小 (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(t("fileTooLarge"));
        // 重置input
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        workFile: file,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, workFile: null }));
    // 重置input元素
    const fileInput = document.getElementById("workFile") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // 验证文件类型
      const allowedTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
        "audio/aac",
        "audio/flac",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(t("invalidFileType"));
        return;
      }

      // 验证文件大小 (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(t("fileTooLarge"));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        workFile: file,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.sampleSong || !formData.workFile) {
      toast.error(t("fillCompleteInfo"));
      return;
    }

    setIsUploading(true);
    try {
      // 创建FormData用于文件上传
      const uploadFormData = new FormData();
      uploadFormData.append("workFile", formData.workFile);
      uploadFormData.append("sampleSong", formData.sampleSong);

      // 获取用户ID
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      if (user?.id) {
        uploadFormData.append("userId", user.id);
      }

      const response = await fetch("/api/upload-work", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          uid: user?.id || "",
        },
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();

        // 上传成功后，调用提交作品接口
        try {
          const creationResponse = await fetch("/api/music/creation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              uid: user?.id || "",
            },
            body: JSON.stringify({
              templateId: parseInt(formData.sampleSong),
              url: data.workFileUrl,
              title:
                musics.find((music) => music.id === formData.sampleSong)
                  ?.name || "未命名作品",
            }),
          });

          if (creationResponse.ok) {
            const creationData = await creationResponse.json();
            if (creationData.code === 0) {
              toast.success(t("uploadSuccess"));
              onOpenChange(false);

              // 重置表单
              setFormData({
                sampleSong: "",
                workFile: null,
              });
            } else {
              toast.error(creationData.msg || t("submitFailed"));
            }
          } else {
            const errorData = await creationResponse.json();
            toast.error(errorData.msg || t("submitFailed"));
          }
        } catch (creationError) {
          console.error("Creation error:", creationError);
          toast.error(t("submitFailedButUploaded"));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t("uploadFailed"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(t("uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t("uploadWork")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="sampleSong" className="text-sm font-medium">
              {t("selectSampleSong")} *
            </Label>
            <select
              id="sampleSong"
              value={formData.sampleSong}
              onChange={handleSampleSongChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            >
              <option value="">{t("selectSampleSongPlaceholder")}</option>
              {musics.map((music) => (
                <option key={music.id} value={music.id}>
                  {music.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="workFile" className="text-sm font-medium">
              {t("uploadWorkFile")} *
            </Label>

            {/* 自定义文件上传区域 */}
            <div className="mt-2">
              <input
                id="workFile"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="workFile"
                className={`group flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500 transition-colors duration-200 group-hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 transition-colors duration-200 group-hover:text-gray-600">
                    <span className="font-semibold">
                      {t("clickToSelectFile")}
                    </span>{" "}
                    {t("orDragFileHere")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("supportedFormats")}
                  </p>
                </div>
              </label>
            </div>

            {/* 已选择文件显示 */}
            {formData.workFile && (
              <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-green-800">
                      {formData.workFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(formData.workFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 p-1 text-green-600 transition-colors duration-200 hover:text-green-800"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="h-12 flex-1 border-gray-300 text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isUploading || !formData.sampleSong || !formData.workFile
              }
              className="h-12 flex-1 bg-yellow-400 font-medium text-black shadow-md transition-all duration-200 hover:bg-yellow-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                  {t("uploading")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {t("uploadWorkButton")}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
