"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Lock, UserPlus, Loader2, ChevronLeft } from "lucide-react";
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
  title?: string;
  subtitle?: string;
}

export default function AuthModal({
  open,
  onOpenChange,
  title,
  subtitle,
}: AuthModalProps) {
  const t = useTranslations("Music");
  const [currentPage, setCurrentPage] = useState<
    "login" | "register" | "forgot"
  >("login");

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
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotVerificationCode, setForgotVerificationCode] = useState("");
  const [isForgotCodeSent, setIsForgotCodeSent] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [isSendingForgotCode, setIsSendingForgotCode] = useState(false);

  // Loading states for submit buttons
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSendCode = async () => {
    if (!registerEmail || isSendingCode) return;

    setIsSendingCode(true);
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
        toast.success(t("authModal.toast.codeSent"));
      } else {
        const data = await response.json();
        toast.error(data.error || t("authModal.toast.codeSendFailed"));
      }
    } catch (error) {
      console.error("Failed to send verification code:", error);
      toast.error(t("authModal.toast.codeSendRetry"));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSendForgotCode = async () => {
    if (!forgotEmail || isSendingForgotCode) return;

    setIsSendingForgotCode(true);
    try {
      const response = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (response.ok) {
        setIsForgotCodeSent(true);
        setForgotCountdown(60);
        const timer = setInterval(() => {
          setForgotCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        toast.success(t("authModal.toast.codeSent"));
      } else {
        const data = await response.json();
        toast.error(data.error || t("authModal.toast.codeSendFailed"));
      }
    } catch (error) {
      console.error("Failed to send verification code:", error);
      toast.error(t("authModal.toast.codeSendRetry"));
    } finally {
      setIsSendingForgotCode(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPassword !== forgotConfirmPassword) {
      toast.error(t("authModal.toast.passwordMismatch"));
      return;
    }

    if (isResettingPassword) return;

    setIsResettingPassword(true);
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          password: forgotPassword,
          code: forgotVerificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Close modal and show success
        onOpenChange(false);
        toast.success(t("authModal.toast.resetSuccess"));

        // Switch to login page and reset form
        setCurrentPage("login");
        setForgotEmail("");
        setForgotPassword("");
        setForgotConfirmPassword("");
        setForgotVerificationCode("");
        setIsForgotCodeSent(false);
        setForgotCountdown(0);
      } else {
        toast.error(data.error || t("authModal.toast.resetFailed"));
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(t("authModal.toast.resetRetry"));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoggingIn) return;

    setIsLoggingIn(true);
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
        toast.success(t("authModal.toast.loginSuccess"));

        // Reset form
        setLoginEmail("");
        setLoginPassword("");
      } else {
        toast.error(data.error || t("authModal.toast.loginFailed"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("authModal.toast.loginRetry"));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error(t("authModal.toast.passwordMismatch"));
      return;
    }

    if (isRegistering) return;

    setIsRegistering(true);
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
        // Store token and user data in localStorage (auto-login)
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Close modal and show success
        onOpenChange(false);
        toast.success(t("authModal.toast.registerSuccess"));

        // Reset form
        setRegisterEmail("");
        setRegisterPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setReferrer("");
        setIsCodeSent(false);
        setCountdown(0);
      } else {
        toast.error(data.error || t("authModal.toast.registerFailed"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("authModal.toast.registerRetry"));
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">
            {currentPage === "login" && (title || t("authModal.loginTitle"))}
            {currentPage === "register" &&
              (title || t("authModal.registerTitle"))}
            {currentPage === "forgot" && (title || t("authModal.forgotTitle"))}
          </DialogTitle>
          {currentPage === "login" &&
            (subtitle || t("authModal.loginSubtitle")) && (
              <DialogDescription className="text-sm text-gray-600">
                {subtitle || t("authModal.loginSubtitle")}
              </DialogDescription>
            )}
          {currentPage === "register" &&
            (subtitle || t("authModal.registerSubtitle")) && (
              <DialogDescription className="text-sm text-gray-600">
                {subtitle || t("authModal.registerSubtitle")}
              </DialogDescription>
            )}
          {currentPage === "forgot" &&
            (subtitle || t("authModal.forgotSubtitle")) && (
              <DialogDescription className="text-sm text-gray-600">
                {subtitle || t("authModal.forgotSubtitle")}
              </DialogDescription>
            )}
        </DialogHeader>

        {/* Page navigation */}
        {currentPage !== "login" && (
          <div className="mb-4">
            <button
              onClick={() => setCurrentPage("login")}
              className="flex items-center gap-2 text-sm text-blue-600 underline hover:text-blue-800"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("authModal.backToLogin")}
            </button>
          </div>
        )}

        {/* Login Form */}
        {currentPage === "login" && (
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

            <div className="text-right">
              <button
                type="button"
                onClick={() => setCurrentPage("forgot")}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                {t("authModal.forgotPassword")}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-lg border-2 border-black bg-[#FFD600] py-2 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("authModal.loggingIn")}
                </span>
              ) : (
                t("authModal.loginButton")
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentPage("register")}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                {t("authModal.registerLink")}
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {currentPage === "register" && (
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
                  disabled={!registerEmail || countdown > 0 || isSendingCode}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {isSendingCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    t("authModal.sendCode")
                  )}
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
              disabled={isRegistering}
              className="w-full rounded-lg border-2 border-black bg-[#FFD600] py-2 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              {isRegistering ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("authModal.registering")}
                </span>
              ) : (
                t("authModal.registerButton")
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentPage("login")}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                {t("authModal.loginLink")}
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Form */}
        {currentPage === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
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
                    value={forgotVerificationCode}
                    onChange={(e) => setForgotVerificationCode(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                    placeholder={t("authModal.codePlaceholder")}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendForgotCode}
                  disabled={
                    !forgotEmail || forgotCountdown > 0 || isSendingForgotCode
                  }
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {isSendingForgotCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : forgotCountdown > 0 ? (
                    `${forgotCountdown}s`
                  ) : (
                    t("authModal.sendCode")
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.newPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={forgotPassword}
                  onChange={(e) => setForgotPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.newPasswordPlaceholder")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("authModal.confirmNewPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-black focus:outline-none"
                  placeholder={t("authModal.confirmNewPasswordPlaceholder")}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResettingPassword}
              className="w-full rounded-lg border-2 border-black bg-[#FFD600] py-2 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              {isResettingPassword ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("authModal.resettingPassword")}
                </span>
              ) : (
                t("authModal.resetPasswordButton")
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
