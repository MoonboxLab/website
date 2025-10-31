"use client";

import Image from "next/image";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import UploadWorkModal from "@/components/UploadWorkModal";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Play, Download, X, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMusic } from "@/lib/MusicContext";
import { MusicPageProvider } from "@/lib/MusicPageContext";
import { useAuthSync } from "@/lib/useAuthSync";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Music");
  const locale = useLocale();
  const router = useRouter();
  const { playTrack } = useMusic();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isProfileIncompleteModalOpen, setIsProfileIncompleteModalOpen] =
    useState(false);
  const [isEventNotStartedModalOpen, setIsEventNotStartedModalOpen] =
    useState(false);
  const [isNoSubmissionModalOpen, setIsNoSubmissionModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedMusicForDownload, setSelectedMusicForDownload] =
    useState<any>(null);
  const [musics, setMusics] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // Use the auth sync hook
  const { isLoggedIn, user } = useAuthSync({
    onLogin: () => {
      setIsAuthModalOpen(false);
    },
    onLogout: () => {
      setIsAuthModalOpen(false);
      setIsUploadModalOpen(false);
      setIsProfileIncompleteModalOpen(false);
      setUserProfile(null);
    },
  });

  // Check user profile completeness
  const checkUserProfile = async () => {
    if (!isLoggedIn || !user) return false;

    setIsCheckingProfile(true);
    try {
      const token = localStorage.getItem("authToken");
      const uid = user.id;

      if (!token || !uid) return false;

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          uid: uid.toString(),
        },
      });

      // Check if login is required (code 104)
      if (response.status === 401) {
        try {
          const errorData = await response.clone().json();
          if (errorData.code === 104 || errorData.requiresLogin) {
            window.dispatchEvent(new CustomEvent("showLoginModal"));
            return false;
          }
        } catch (e) {
          // Not JSON response, continue
        }
      }

      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);

        // Check if profile is incomplete
        const isIncomplete =
          !profileData.alias || !profileData.fullName || !profileData.avatar;

        if (isIncomplete) {
          setIsProfileIncompleteModalOpen(true);
          return false; // Profile is incomplete
        }
        return true; // Profile is complete
      }
      return false;
    } catch (error) {
      console.error("Error checking user profile:", error);
      return false;
    } finally {
      setIsCheckingProfile(false);
    }
  };

  const handleGoToProfile = () => {
    setIsProfileIncompleteModalOpen(false);
    router.push(`/${locale}/profile`);
  };

  const fetchMusics = useCallback(async (currentEventId?: number) => {
    console.log("=== Layout fetchMusics called ===", {
      currentEventId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Fetch music templates based on current event
      const url = new URL("/api/music/template/list", window.location.origin);
      if (currentEventId) {
        url.searchParams.set("monthNumber", currentEventId.toString());
      }

      console.log("Layout fetching musics with URL:", url.toString());

      const response = await fetch(url.toString());
      const data = await response.json();

      console.log("Layout fetchMusics response:", {
        success: data.success,
        dataLength: data.data?.length || 0,
      });

      if (data.success && data.data) {
        // Transform API data to match component format
        const transformedMusics = data.data
          .filter((item: any) => item.status !== 0) // Filter out items with status 0 (不显示)
          .map((item: any) => ({
            id: item.id.toString(),
            name: item.title,
            description: item.description,
            audioUrl: item.url,
            coverUrl: item.cover,
            downloadUrl: item.zipUrl,
            status: item.status, // 0-不显示 1-可以下载 2-只显示不下载
            singer: item.singer,
          }));

        console.log("Layout transformed musics:", transformedMusics.length);
        setMusics(transformedMusics);
      } else {
        console.log("Layout: No data or failed response, setting empty array");
        setMusics([]);
      }
    } catch (error) {
      console.error("Layout: Failed to fetch musics:", error);
      setMusics([]);
    }
  }, []);

  const handleSubmitWork = async () => {
    // 检查特殊情况
    if (musics.length === 0) {
      // 情况1：活动还未开始
      setIsEventNotStartedModalOpen(true);
      return;
    }

    // 检查是否所有音乐的status都不等于1
    const hasDownloadableMusic = musics.some((music) => music.status === 1);
    if (!hasDownloadableMusic) {
      // 情况2：活动不能递交作品
      setIsNoSubmissionModalOpen(true);
      return;
    }

    // 正常情况：检查登录状态
    if (isLoggedIn) {
      // 已登录：先检查用户资料完整性
      const isProfileComplete = await checkUserProfile();

      // 如果资料完整，直接显示上传作品弹窗
      if (isProfileComplete) {
        setIsUploadModalOpen(true);
      }
      // 如果资料不完整，checkUserProfile会弹出提示弹窗
    } else {
      setIsAuthModalOpen(true); // 未登录：显示登录弹窗
    }
  };

  const downloadMusicZip = async (musicItem?: any) => {
    setIsDownloading(true);
    try {
      // 如果指定了特定音乐，使用其downloadUrl
      if (musicItem && musicItem.downloadUrl) {
        // 直接使用a标签打开downloadUrl
        const link = document.createElement("a");
        link.href = musicItem.downloadUrl;
        link.download = `${musicItem.name
          .toLowerCase()
          .replace(/\s+/g, "-")}-demo.zip`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 关闭隐私政策弹窗
      setIsPrivacyModalOpen(false);
    } catch (error) {
      console.error("Download error:", error);
      // 可以添加错误提示
    } finally {
      setIsDownloading(false);
    }
  };

  const contextValue = {
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    selectedMusicForDownload,
    setSelectedMusicForDownload,
    downloadMusicZip,
    fetchMusics,
    musics,
  };

  useEffect(() => {
    // Fetch all musics initially (no specific event)
    fetchMusics();
  }, [fetchMusics]);

  return (
    <MusicPageProvider value={contextValue}>
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

          <div className="mx-auto mt-8 max-w-[1447px] px-4 lg:px-16">
            <div className="mt-8">
              <Image
                src={
                  locale === "en" ? "/music/banner.png" : "/music/banner.png"
                }
                alt="music-banner"
                width={1280}
                height={720}
                className="aspect-[1280/720] w-full object-cover"
              />

              <div className="relative z-[1]">
                <div className="border border-t-0 border-black bg-white pt-6 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="relative mt-8 pb-6 text-center text-[#174172]">
                    <div className="text-2xl font-bold lg:text-3xl">
                      {t("nobodySquare")}
                    </div>
                    <div className="mt-2 text-sm font-bold lg:text-2xl">
                      {t("producerInfo")}
                    </div>
                    <div className="mt-2 px-4 text-base lg:px-16 lg:text-2xl lg:leading-10">
                      {t.rich("nobodySquareIntro", {
                        br: () => <br />,
                      })}
                    </div>

                    {isOpen ? null : (
                      <button
                        className="absolute right-4 top-0 h-6 w-6 rounded-full border-2 border-[#605D5E] lg:top-4 lg:h-12 lg:w-12"
                        onClick={() => setIsOpen(true)}
                      >
                        <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 bg-[#605D5E] lg:w-5"></div>
                        <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-[#605D5E] lg:w-5"></div>
                      </button>
                    )}
                  </div>
                </div>
                {isOpen ? (
                  <div className="relative -mt-px w-full border border-t-0 border-black bg-white px-4 py-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:px-16 lg:py-12">
                    <button
                      className="absolute -top-2 right-4 h-6 w-6 rounded-full border-2 border-[#605D5E] lg:top-4 lg:h-12 lg:w-12"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 bg-[#605D5E] lg:w-5"></div>
                    </button>
                    <div className="mx-auto w-full max-w-[998px] text-base text-[#174172] lg:grid lg:grid-cols-2 lg:gap-12 lg:text-xl">
                      {/* 左侧列 */}
                      <div>
                        <div className="mt-3 flex gap-2 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("organizersTitle")}
                          </div>
                          <div>
                            {t.rich("organizers", {
                              br: () => <br />,
                              bingo: (chunks) => (
                                <a
                                  href="https://www.bingogroup.com.hk/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline decoration-solid underline-offset-4 transition-colors hover:text-blue-600"
                                >
                                  {chunks}
                                </a>
                              ),
                              fireverse: (chunks) => (
                                <a
                                  href="https://app.fireverseai.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline decoration-solid underline-offset-4 transition-colors hover:text-blue-600"
                                >
                                  {chunks}
                                </a>
                              ),
                              aicean: (chunks) => (
                                <a
                                  href="https://www.aicean.ai/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline decoration-solid underline-offset-4 transition-colors hover:text-blue-600"
                                >
                                  {chunks}
                                </a>
                              ),
                            })}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("highlightsTitle")}
                          </div>
                          <div>{t("highlights")}</div>
                        </div>
                        <div className="mt-3 flex gap-2 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("scheduleTitle")}
                          </div>
                          <div>{t.rich("schedule", { br: () => <br /> })}</div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("scoringMechanismTitle")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("scoringMechanism", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("votingMethodTitle")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("votingMethod", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold underline decoration-solid underline-offset-4">
                            {t("prizeDistributionTitle")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("prizeDistribution", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("juryMembersTitle")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("juryMembers", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                            {t("rewardsTitle")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("rewards", { br: () => <br /> })}
                          </div>
                        </div>
                      </div>

                      {/* 右侧列 */}
                      <div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold underline decoration-solid underline-offset-4">
                            {t("competitionTermsTitle")}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold">
                            {t("competitionTerms1Title")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("competitionTerms1", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold">
                            {t("competitionTerms2Title")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("competitionTerms2", {
                              br: () => <br />,
                              strong: (chunks) => <strong>{chunks}</strong>,
                            })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold">
                            {t("competitionTerms3Title")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("competitionTerms3", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold">
                            {t("competitionTerms4Title")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("competitionTerms4", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold">
                            {t("competitionTerms5Title")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("competitionTerms5", { br: () => <br /> })}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-5">
                          <div className="font-bold">
                            {t("competitionTerms6Title")}
                          </div>
                          <div className="mt-2 lg:mt-3">
                            {t.rich("competitionTerms6", { br: () => <br /> })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleSubmitWork}
                  className="flex-1 rounded-lg border-2 border-black bg-white px-6 py-3 text-lg font-bold"
                >
                  {t("submitWork")}
                </button>
                <Link
                  href={`/${locale}/music/voting`}
                  className="flex-1 rounded-lg border-2 border-black bg-yellow-400 px-6 py-3 text-center text-lg font-bold"
                >
                  {t("voteNow")}
                </Link>
              </div>

              {/* Children content */}
              {children}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

        {/* Upload Work Modal */}
        <UploadWorkModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          musics={musics}
        />

        {/* Download Usage Guidelines Modal */}
        <Dialog open={isPrivacyModalOpen} onOpenChange={setIsPrivacyModalOpen}>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                {t("downloadUsageTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 max-h-[400px] space-y-4 overflow-y-auto text-sm leading-relaxed">
              <div>{t.rich("downloadUsageContent", { br: () => <br /> })}</div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => downloadMusicZip(selectedMusicForDownload)}
                disabled={isDownloading}
                className="rounded-lg border-2 border-black bg-yellow-400 px-6 py-3 text-lg font-bold disabled:opacity-50"
              >
                {isDownloading ? t("downloading") : t("agree")}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Incomplete Modal */}
        <Dialog
          open={isProfileIncompleteModalOpen}
          onOpenChange={setIsProfileIncompleteModalOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-center text-xl font-bold">
                <User className="h-6 w-6" />
                {t("profileIncompleteModal.title")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-center">
              <div className="text-gray-600">
                <p className="mb-2">
                  {t("profileIncompleteModal.description")}
                </p>
                <ul className="space-y-1 text-left text-sm">
                  <li>{t("profileIncompleteModal.requirements.nickname")}</li>
                  <li>{t("profileIncompleteModal.requirements.fullName")}</li>
                  <li>{t("profileIncompleteModal.requirements.avatar")}</li>
                </ul>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleGoToProfile}
                  className="rounded-lg border-2 border-black bg-yellow-400 px-6 py-3 text-lg font-bold transition-colors hover:bg-yellow-500"
                >
                  {t("profileIncompleteModal.completeProfile")}
                </button>
                <button
                  onClick={() => setIsProfileIncompleteModalOpen(false)}
                  className="rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 text-lg font-bold transition-colors hover:bg-gray-200"
                >
                  {t("profileIncompleteModal.later")}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Event Not Started Modal */}
        <Dialog
          open={isEventNotStartedModalOpen}
          onOpenChange={setIsEventNotStartedModalOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-center text-xl font-bold">
                <User className="h-6 w-6" />
                {t("eventNotStarted.title")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-center">
              <div className="text-gray-600">
                <p className="mb-2">{t("eventNotStarted.description")}</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsEventNotStartedModalOpen(false)}
                  className="rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 text-lg font-bold transition-colors hover:bg-gray-200"
                >
                  {t("ok")}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* No Submission Allowed Modal */}
        <Dialog
          open={isNoSubmissionModalOpen}
          onOpenChange={setIsNoSubmissionModalOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-center text-xl font-bold">
                <User className="h-6 w-6" />
                {t("noSubmissionAllowed.title")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-center">
              <div className="text-gray-600">
                <p className="mb-2">{t("noSubmissionAllowed.description")}</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsNoSubmissionModalOpen(false)}
                  className="rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 text-lg font-bold transition-colors hover:bg-gray-200"
                >
                  {t("ok")}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MusicPageProvider>
  );
}
