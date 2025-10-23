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
      setFormData((prev) => ({
        ...prev,
        workFile: file,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.sampleSong || !formData.workFile) {
      toast.error("请选择样品歌曲并上传作品文件");
      return;
    }

    setIsUploading(true);
    try {
      // 这里应该调用上传作品的API
      // const formDataToSend = new FormData();
      // formDataToSend.append('sampleSong', formData.sampleSong);
      // formDataToSend.append('workFile', formData.workFile);

      // 模拟上传过程
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("作品上传成功！");
      onOpenChange(false);

      // 重置表单
      setFormData({
        sampleSong: "",
        workFile: null,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            上传作品
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="sampleSong" className="text-sm font-medium">
              选择样品歌曲 *
            </Label>
            <select
              id="sampleSong"
              value={formData.sampleSong}
              onChange={handleSampleSongChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            >
              <option value="">请选择样品歌曲</option>
              {musics.map((music) => (
                <option key={music.id} value={music.id}>
                  {music.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="workFile" className="text-sm font-medium">
              上传作品文件 *
            </Label>
            <Input
              id="workFile"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {formData.workFile && (
              <p className="mt-1 text-sm text-gray-600">
                已选择文件: {formData.workFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isUploading || !formData.sampleSong || !formData.workFile
              }
              className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {isUploading ? "上传中..." : "上传作品"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
