"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const t = useTranslations("Profile");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 验证输入
    if (!oldPassword.trim()) {
      toast.error(t("oldPasswordRequired"));
      return;
    }

    if (!newPassword.trim()) {
      toast.error(t("newPasswordRequired"));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!token || !user?.id) {
        toast.error(t("notLoggedIn"));
        return;
      }

      const response = await fetch("/api/user/modify/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          uid: user.id,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.code === 0) {
        toast.success(t("passwordChangeSuccess"));
        // 清空表单
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // 关闭弹窗
        onOpenChange(false);
      } else {
        toast.error(result.msg || t("passwordChangeError"));
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(t("passwordChangeError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // 清空表单
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-black">
            {t("changePassword")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-[20px] py-[20px]">
          <div>
            <Label
              htmlFor="oldPassword"
              className="text-[16px] font-medium text-black"
            >
              {t("oldPassword")}
            </Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t("oldPasswordPlaceholder")}
              className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
            />
          </div>

          <div>
            <Label
              htmlFor="newPassword"
              className="text-[16px] font-medium text-black"
            >
              {t("newPassword")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("newPasswordPlaceholder")}
              className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
            />
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-[16px] font-medium text-black"
            >
              {t("confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmPasswordPlaceholder")}
              className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-[12px]">
          <Button
            onClick={handleClose}
            variant="outline"
            className="h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px] font-medium text-black hover:bg-gray-50"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-[48px] rounded-[8px] border-[2px] border-black bg-[rgba(255,214,0,1)] text-[16px] font-medium text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[rgba(255,214,0,0.8)]"
          >
            {isSubmitting ? t("changing") : t("changePassword")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
