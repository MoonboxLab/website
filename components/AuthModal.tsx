"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const t = useTranslations("Music");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referrer, setReferrer] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!registerEmail) return;

    try {
      const response = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmail }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to send verification code:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Close modal and show success
        onOpenChange(false);
        toast.success("登录成功！");

        // Reset form
        setLoginEmail("");
        setLoginPassword("");
      } else {
        toast.error(data.error || "登录失败");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("登录失败，请重试");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error("密码不匹配");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          verificationCode,
          referrer: referrer || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Close modal and show success
        onOpenChange(false);
        toast.success("注册成功！请登录");

        // Switch to login tab and reset form
        setActiveTab("login");
        setRegisterEmail("");
        setRegisterPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setReferrer("");
        setIsCodeSent(false);
        setCountdown(0);
      } else {
        toast.error(data.error || "注册失败");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("注册失败，请重试");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">
            {t("authModal.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {t("authModal.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Tab buttons */}
        <div className="mb-6 flex rounded-lg border border-gray-300 bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === "login"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600"
            }`}
          >
            {t("authModal.login")}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === "register"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600"
            }`}
          >
            {t("authModal.register")}
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.emailPlaceholder")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.passwordPlaceholder")}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg border-2 border-black bg-[#FFD600] py-2 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              {t("authModal.loginButton")}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.emailPlaceholder")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.verificationCode")}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                    placeholder={t("authModal.codePlaceholder")}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={!registerEmail || countdown > 0}
                  className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {countdown > 0 ? `${countdown}s` : t("authModal.sendCode")}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.passwordPlaceholder")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.confirmPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.confirmPasswordPlaceholder")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.referrer")}{" "}
                <span className="text-gray-500">
                  {t("authModal.referrerOptional")}
                </span>
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.referrerPlaceholder")}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg border-2 border-black bg-[#FFD600] py-2 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              {t("authModal.registerButton")}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
