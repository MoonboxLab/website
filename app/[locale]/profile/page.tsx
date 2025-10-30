"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import AvatarUpload from "../../../components/AvatarUpload";
import AuthModal from "@/components/AuthModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { useAuthSync } from "@/lib/useAuthSync";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface UserProfile {
  id: string;
  fullName: string;
  alias: string;
  email: string;
  hasNobodyNFT: boolean;
  whatsapp: string;
  wechat: string;
  telegram: string;
  avatar?: string;
  address?: string;
}

interface MusicCreation {
  id: number;
  uid: number;
  templateId: number;
  url: string;
  title: string;
  month: number;
  scope: number;
  status: number;
  createTm: number;
}

interface VoteRecord {
  id: number;
  chain: string;
  creationId: number;
  user: string;
  coinName: string;
  coin: string | null;
  amount: number;
  createTm: number;
}

interface VoteRecordResponse {
  data: VoteRecord[];
  creation: MusicCreation;
}

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const tMusic = useTranslations("Music");
  const { address: connectedAddress } = useAccount();
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    fullName: "",
    alias: "",
    email: "",
    hasNobodyNFT: false,
    whatsapp: "",
    wechat: "",
    telegram: "",
    avatar: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [musicCreations, setMusicCreations] = useState<MusicCreation[]>([]);
  const [voteRecords, setVoteRecords] = useState<VoteRecordResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [walletAddressInput, setWalletAddressInput] = useState("");
  const isManualInputRef = useRef(false); // Track if user manually entered address

  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!token || !user?.id) {
        return;
      }

      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          uid: user.id,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Profile GET - Received user data:", userData);
        console.log("Profile GET - Address in user data:", userData.address);
        setProfile(userData);
        // Don't set walletAddressInput here, let useEffect handle it
      } else {
        // If no profile exists, try to get user data from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setProfile({
            id: user.id || "",
            fullName: user.fullName || "",
            alias: user.alias || "",
            email: user.email || "",
            hasNobodyNFT: user.hasNobodyNFT || false,
            whatsapp: user.whatsapp || "",
            wechat: user.wechat || "",
            telegram: user.telegram || "",
            avatar: user.avatar || "",
            address: user.address || "",
          });
          // Don't set walletAddressInput here, let useEffect handle it
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error(t("loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const loadMusicData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!token || !user?.id) {
        console.log("No auth token or user ID for music data loading");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        uid: user.id,
      };

      // Load music creation records
      const creationResponse = await fetch("/api/music/creation/record", {
        headers,
      });
      if (creationResponse.ok) {
        const creationData = await creationResponse.json();
        setMusicCreations(creationData.data || []);
      }

      // Load vote records for each creation
      const creationResponseData = await fetch("/api/music/creation/record", {
        headers,
      });
      if (creationResponseData.ok) {
        const creationData = await creationResponseData.json();
        const creations = creationData.data || [];

        // Load vote records for each creation
        const votePromises = creations.map(async (creation: MusicCreation) => {
          try {
            const voteResponse = await fetch(
              `/api/music/vote/record?id=${creation.id}`,
              { headers },
            );
            if (voteResponse.ok) {
              const voteData = await voteResponse.json();
              return voteData;
            }
            return null;
          } catch (error) {
            console.error(
              `Error loading vote records for creation ${creation.id}:`,
              error,
            );
            return null;
          }
        });

        const voteResults = await Promise.all(votePromises);
        const validVoteResults = voteResults.filter(
          (result) => result !== null,
        );
        setVoteRecords(validVoteResults);
      }
    } catch (error) {
      console.error("Error loading music data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Use the auth sync hook
  const { isLoggedIn } = useAuthSync({
    onLogin: () => {
      setShowAuthModal(false);
      loadUserProfile();
      loadMusicData();
    },
    onLogout: () => {
      setShowAuthModal(true);
      setProfile({
        id: "",
        fullName: "",
        alias: "",
        email: "",
        hasNobodyNFT: false,
        whatsapp: "",
        wechat: "",
        telegram: "",
        avatar: "",
        address: "",
      });
      setWalletAddressInput("");
    },
  });

  // Load user profile on component mount
  useEffect(() => {
    if (isLoggedIn) {
      loadUserProfile();
      loadMusicData();
    } else {
      // Check if user is already logged in from localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        loadUserProfile();
        loadMusicData();
      } else {
        // User is not logged in, show auth modal
        setShowAuthModal(true);
      }
    }
  }, [isLoggedIn, loadUserProfile, loadMusicData]);

  // Handle scroll to participation records after loading completes
  useEffect(() => {
    // Only scroll when isLoading is false
    if (!isLoading && window.location.hash === "#participation-records") {
      setTimeout(() => {
        const element = document.getElementById("participation-records");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [isLoading]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Handle scroll to participation records after data is loaded
  useEffect(() => {
    // Only scroll if data is not loading and we have a hash in URL
    if (!isLoadingData && window.location.hash === "#participation-records") {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        const element = document.getElementById("participation-records");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [isLoadingData]);

  // Sync wallet address to input when wallet is connected and address is not yet saved
  useEffect(() => {
    console.log("Profile useEffect - Sync address:", {
      profileAddress: profile.address,
      connectedAddress: connectedAddress,
      currentWalletAddressInput: walletAddressInput,
      isManualInput: isManualInputRef.current,
    });

    // If profile.address exists, use it (already saved) - always override
    if (profile.address) {
      console.log(
        "Profile useEffect - Setting walletAddressInput from profile.address:",
        profile.address,
      );
      isManualInputRef.current = false;
      setWalletAddressInput(profile.address);
    } else if (connectedAddress) {
      // If profile.address is empty but wallet is connected, use connected address
      // This handles wallet switching - always update when wallet changes
      if (walletAddressInput !== connectedAddress) {
        console.log(
          "Profile useEffect - Setting walletAddressInput from connectedAddress:",
          connectedAddress,
        );
        isManualInputRef.current = false;
        setWalletAddressInput(connectedAddress);
      }
    } else if (!connectedAddress && !profile.address) {
      // If both are empty, clear the input
      console.log(
        "Profile useEffect - No address to sync, clearing walletAddressInput",
      );
      isManualInputRef.current = false;
      setWalletAddressInput("");
    }
  }, [connectedAddress, profile.address]);

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | boolean,
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!token || !user?.id) {
        toast.error(t("notLoggedIn"));
        return;
      }

      // Include wallet address in profile if it's filled
      const profileToSave = {
        ...profile,
        address: walletAddressInput || profile.address || "",
      };

      console.log("Profile PUT - Profile to save:", profileToSave);
      console.log(
        "Profile PUT - Address in profile to save:",
        profileToSave.address,
      );
      console.log("Profile PUT - walletAddressInput:", walletAddressInput);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          uid: user.id,
        },
        body: JSON.stringify(profileToSave),
      });

      if (response.ok) {
        toast.success(t("saveSuccess"));
        // Update profile state with saved address
        setProfile((prev) => ({
          ...prev,
          address: profileToSave.address,
        }));
        // Update localStorage with new profile data
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...profileToSave };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t("saveError"));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string) => {
    setIsUploadingAvatar(true);

    setProfile((prev) => ({
      ...prev,
      avatar: newAvatarUrl,
    }));

    // Auto-save profile after avatar update
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!token || !user?.id) {
        toast.error(t("notLoggedIn"));
        return;
      }

      const updatedProfile = { ...profile, avatar: newAvatarUrl };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          uid: user.id,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        toast.success(t("avatarUploadSuccess"));
        // Update localStorage with new profile data
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...updatedProfile };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t("saveError"));
        // Revert avatar change on error
        setProfile((prev) => ({
          ...prev,
          avatar: profile.avatar,
        }));
      }
    } catch (error) {
      console.error("Error saving profile after avatar update:", error);
      toast.error(t("saveError"));
      // Revert avatar change on error
      setProfile((prev) => ({
        ...prev,
        avatar: profile.avatar,
      }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const connectWallet = () => {
    // This would integrate with your existing wallet connection logic
    toast.info(t("connectWalletInfo"));
  };

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Reset profile state
    setProfile({
      id: "",
      fullName: "",
      alias: "",
      email: "",
      hasNobodyNFT: false,
      whatsapp: "",
      wechat: "",
      telegram: "",
      avatar: "",
    });

    // Show auth modal
    setShowAuthModal(true);

    // Trigger auth sync
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "authToken",
        newValue: null,
        oldValue: localStorage.getItem("authToken"),
      }),
    );

    toast.success(t("logoutSuccess"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <Header />
        <div className="flex min-h-[calc(100vh-88px)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="relative">
        <div className="w-screen overflow-scroll bg-gray-100 pb-[150px]">
          <div className="absolute left-0 right-0 top-0 z-20 w-full">
            <Header />
          </div>

          <Image
            src={"/show_bg.jpg"}
            quality={100}
            unoptimized
            alt="background-image"
            height={340}
            width={1920}
            style={{ objectFit: "cover" }}
            className="w-full"
          />

          <div className="mx-[15px] mt-[30px] sm:mx-[60px] 4xl:mx-[160px]">
            <div className="rounded-[16px] bg-white p-[60px] text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="mb-[30px]">
                <div className="mx-auto mb-[20px] flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gray-200">
                  <svg
                    className="h-[40px] w-[40px] text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h1 className="mb-[20px] text-[24px] font-bold text-black">
                  {t("notLoggedInTitle")}
                </h1>
                <p className="mb-[30px] text-[16px] text-gray-600">
                  {t("notLoggedInMessage")}
                </p>
                <Button
                  onClick={handleLogin}
                  className="hover-btn-shadow h-[48px] rounded-[8px] border-[2px] border-black bg-[rgba(255,214,0,1)] px-[24px] text-[16px] font-medium text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                >
                  {t("loginButton")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-screen overflow-scroll bg-gray-100 pb-[150px]">
        <div className="absolute left-0 right-0 top-0 z-20 w-full">
          <Header />
        </div>

        <Image
          src={"/show_bg.jpg"}
          quality={100}
          unoptimized
          alt="background-image"
          height={340}
          width={1920}
          style={{ objectFit: "cover" }}
          className="w-full"
        />
        <div className="mx-[15px] mt-[30px] space-y-[20px] sm:mx-[60px] 4xl:mx-[160px]">
          {/* Personal Information Card */}
          <div
            className="rounded-[16px] p-[30px] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: "#F3EFE4" }}
          >
            <h1 className="mb-[30px] text-center text-[24px] font-bold text-black">
              {t("title")}
            </h1>

            <div className="flex flex-col gap-[30px] lg:flex-row">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="group relative">
                  <div className="h-[120px] w-[120px] overflow-hidden rounded-[12px] border-[2px] border-black">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={t("avatar")}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-400">
                          {t("noAvatar")}
                        </span>
                      </div>
                    )}
                  </div>
                  <AvatarUpload
                    onAvatarChange={handleAvatarChange}
                    userId={profile?.id}
                    disabled={isUploadingAvatar}
                    isUploading={isUploadingAvatar}
                  />
                </div>
              </div>

              {/* Profile Form */}
              <div className="flex-1 space-y-[20px]">
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-[16px] font-medium text-black"
                    >
                      {t("fullName")}
                    </Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder={t("fullNamePlaceholder")}
                      className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="alias"
                      className="text-[16px] font-medium text-black"
                    >
                      {t("alias")}
                    </Label>
                    <Input
                      id="alias"
                      value={profile.alias}
                      onChange={(e) =>
                        handleInputChange("alias", e.target.value)
                      }
                      placeholder={t("aliasPlaceholder")}
                      className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[16px] font-medium text-black">
                    {t("email")}
                  </Label>
                  <div className="mt-[8px] text-[16px] text-gray-600">
                    {profile.email || t("emailPlaceholder")}
                  </div>
                </div>

                <div>
                  <Label className="mb-[12px] block text-[16px] font-medium text-black">
                    {t("hasNobodyNFT")}
                  </Label>
                  <div className="mt-[8px] text-[16px] text-gray-600">
                    {profile.hasNobodyNFT ? t("yes") : t("no")}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="walletAddress"
                    className="mb-[12px] block text-[16px] font-medium text-black"
                  >
                    {t("walletAddress")}
                  </Label>
                  <Input
                    id="walletAddress"
                    value={walletAddressInput}
                    onChange={(e) => {
                      isManualInputRef.current = true;
                      setWalletAddressInput(e.target.value);
                    }}
                    placeholder={t("walletAddressPlaceholder")}
                    disabled={!!profile.address}
                    className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px] disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                  {!profile.address && (
                    <div className="mt-[12px]">
                      <ConnectButton.Custom>
                        {({
                          account,
                          chain,
                          openAccountModal,
                          openChainModal,
                          openConnectModal,
                          authenticationStatus,
                          mounted,
                        }) => {
                          const ready =
                            mounted && authenticationStatus !== "loading";
                          const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                              authenticationStatus === "authenticated");

                          if (!connected) {
                            return (
                              <Button
                                onClick={openConnectModal}
                                className="h-[48px] w-full rounded-[8px] border-[2px] border-black bg-[rgba(255,214,0,1)] text-[16px] font-semibold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:text-white md:w-auto md:px-[40px]"
                              >
                                {t("connectWallet")}
                              </Button>
                            );
                          }
                          return null;
                        }}
                      </ConnectButton.Custom>
                    </div>
                  )}
                  {profile.address && (
                    <div className="mt-[8px] text-[14px] text-gray-500">
                      {t("walletAddressLocked")}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
                  <div>
                    <Label
                      htmlFor="whatsapp"
                      className="text-[16px] font-medium text-black"
                    >
                      WhatsApp{" "}
                      <span className="text-[14px] font-normal text-gray-500">
                        {t("optional")}
                      </span>
                    </Label>
                    <Input
                      id="whatsapp"
                      value={profile.whatsapp}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      placeholder={t("whatsappPlaceholder")}
                      className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="wechat"
                      className="text-[16px] font-medium text-black"
                    >
                      {t("wechat")}{" "}
                      <span className="text-[14px] font-normal text-gray-500">
                        {t("optional")}
                      </span>
                    </Label>
                    <Input
                      id="wechat"
                      value={profile.wechat}
                      onChange={(e) =>
                        handleInputChange("wechat", e.target.value)
                      }
                      placeholder={t("wechatPlaceholder")}
                      className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="telegram"
                      className="text-[16px] font-medium text-black"
                    >
                      Telegram{" "}
                      <span className="text-[14px] font-normal text-gray-500">
                        {t("optional")}
                      </span>
                    </Label>
                    <Input
                      id="telegram"
                      value={profile.telegram}
                      onChange={(e) =>
                        handleInputChange("telegram", e.target.value)
                      }
                      placeholder={t("telegramPlaceholder")}
                      className="mt-[8px] h-[48px] rounded-[8px] border-[2px] border-black bg-white text-[16px]"
                    />
                  </div>
                </div>

                <div className="mt-[8px] text-[14px] text-gray-600">
                  {t("contactInfoHint")}
                </div>

                <div className="flex gap-[20px] pt-[20px]">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="hover-btn-shadow h-[56px] w-full rounded-[8px] border-[2px] border-black bg-[rgba(255,214,0,1)] text-[18px] font-semibold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:text-white md:w-auto md:px-[40px]"
                  >
                    {isSaving ? t("saving") : t("saveProfile")}
                  </Button>
                  <Button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="hover-btn-shadow h-[56px] w-full rounded-[8px] border-[2px] border-black bg-blue-500 text-[18px] font-semibold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] md:w-auto md:px-[40px]"
                  >
                    {t("changePassword")}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="hover-btn-shadow h-[56px] w-full rounded-[8px] border-[2px] border-black bg-red-500 text-[18px] font-semibold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] md:w-auto md:px-[40px]"
                  >
                    {t("logout")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Participation Records Section */}
          {/* Voting History Card */}
          <div
            className="rounded-[16px] p-[30px] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: "#F3EFE4" }}
          >
            <h2 className="mb-[20px] text-[20px] font-semibold text-black">
              {t("votingHistory")}
            </h2>
            {isLoadingData ? (
              <div className="py-[40px] text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="text-gray-600">{t("loadingVoteRecords")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-[2px] border-black">
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("date")}
                      </th>
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("artistName")}
                      </th>
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("songName")}
                      </th>
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("votes")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voteRecords.length > 0 ? (
                      voteRecords.flatMap((voteRecord) =>
                        voteRecord.data.map((vote, index) => (
                          <tr
                            key={`${voteRecord.creation.id}-${vote.id}-${index}`}
                            className="border-b border-gray-200"
                          >
                            <td className="px-[16px] py-[12px] text-[14px] text-gray-600">
                              {formatDate(vote.createTm)}
                            </td>
                            <td className="px-[16px] py-[12px] text-[14px] text-gray-600">
                              {/* TODO: Get artist name from user ID - for now showing user ID */}
                              {t("userPlaceholder", {
                                uid: voteRecord.creation.uid,
                              })}
                            </td>
                            <td className="px-[16px] py-[12px] text-[14px] text-gray-600">
                              {voteRecord.creation.title}
                            </td>
                            <td className="px-[16px] py-[12px] text-[14px] text-gray-600">
                              {vote.amount} {vote.coinName}
                            </td>
                          </tr>
                        )),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-[16px] py-[20px] text-center text-[14px] text-gray-500"
                        >
                          {t("noVoteRecords")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Song History Card */}
          <div
            id="participation-records"
            className="scroll-mt-20 rounded-[16px] p-[30px] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: "#F3EFE4" }}
          >
            <h2 className="mb-[20px] text-[20px] font-semibold text-black">
              {t("songHistory")}
            </h2>
            {isLoadingData ? (
              <div className="py-[40px] text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="text-gray-600">{t("loadingSongRecords")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-[2px] border-black">
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("date")}
                      </th>
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("songName")}
                      </th>
                      <th className="px-[16px] py-[12px] text-left text-[16px] font-semibold text-black">
                        {t("status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicCreations.length > 0 ? (
                      musicCreations.map((creation) => (
                        <tr
                          key={creation.id}
                          className="border-b border-gray-200"
                        >
                          <td className="px-[16px] py-[12px] text-[14px] text-gray-600">
                            {formatDate(creation.createTm)}
                          </td>
                          <td className="px-[16px] py-[12px] text-[14px] text-gray-600">
                            {creation.title}
                          </td>
                          <td className="px-[16px] py-[12px] text-[14px]">
                            <div className="flex items-center gap-[8px] text-green-600">
                              <svg
                                className="h-[16px] w-[16px]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{t("uploadSuccess")}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-[16px] py-[20px] text-center text-[14px] text-gray-500"
                        >
                          {t("noSongRecords")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Privacy Policy Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="privacy-policy"
              className="rounded-[16px] border-[2px] border-black bg-[#F3EFE4] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              <AccordionTrigger className="px-[30px] py-[20px] text-left text-[20px] font-semibold text-black hover:no-underline">
                {tMusic("privacyPolicyTitle")}
              </AccordionTrigger>
              <AccordionContent className="px-[30px] pb-[30px]">
                <div className="space-y-4 text-sm leading-relaxed text-black">
                  <p>{tMusic("privacyPolicyIntro")}</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>{tMusic("privacyPolicyPoint1")}</li>
                    <li>{tMusic("privacyPolicyPoint2")}</li>
                    <li>{tMusic("privacyPolicyPoint3")}</li>
                    <li>{tMusic("privacyPolicyPoint4")}</li>
                    <li>{tMusic("privacyPolicyPoint5")}</li>
                    <li>{tMusic("privacyPolicyPoint6")}</li>
                  </ul>
                  <p>{tMusic("privacyPolicyRights")}</p>
                  <p>{tMusic("privacyPolicyMinor")}</p>
                  <p>{tMusic("privacyPolicyDetails")}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <ChangePasswordModal
        open={showChangePasswordModal}
        onOpenChange={setShowChangePasswordModal}
      />
    </div>
  );
}
