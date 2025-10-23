"use client";

import Image from "next/image";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import UploadWorkModal from "@/components/UploadWorkModal";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Play, Download, X } from "lucide-react";
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

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Music");
  const locale = useLocale();
  const { playTrack } = useMusic();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedMusicForDownload, setSelectedMusicForDownload] =
    useState<any>(null);
  const [musics, setMusics] = useState<any[]>([]);

  // Use the auth sync hook
  const { isLoggedIn } = useAuthSync({
    onLogin: () => {
      setIsAuthModalOpen(false);
    },
    onLogout: () => {
      setIsAuthModalOpen(false);
      setIsUploadModalOpen(false);
    },
  });

  const fetchMusics = async () => {
    // Mock data for testing - same as MusicPage
    const mockMusics = [
      {
        id: "1",
        name: "Nobody Square Theme",
        description: "Main theme song",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=1",
        downloadUrl: "/music/downloads/nobody-square-theme-demo.zip",
      },
      {
        id: "2",
        name: "Digital Dreams",
        description: "Electronic ambient track",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=2",
        downloadUrl: "/music/downloads/digital-dreams-demo.zip",
      },
      {
        id: "3",
        name: "NFT Symphony",
        description: "Orchestral piece",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=3",
        downloadUrl: "/music/downloads/nft-symphony-demo.zip",
      },
      {
        id: "4",
        name: "Blockchain Blues",
        description: "Jazz fusion track",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=4",
        downloadUrl: "/music/downloads/blockchain-blues-demo.zip",
      },
      {
        id: "5",
        name: "Crypto Waves",
        description: "Synthwave style",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=5",
      },
    ];

    setMusics(mockMusics);

    // Try to fetch real data, but fallback to mock if it fails
    try {
      const response = await fetch("/api/musics");
      const data = await response.json();
      if (data && data.length > 0) {
        setMusics(data);
      }
    } catch (error) {
      console.log("Using mock data for musics");
    }
  };

  const handleSubmitWork = () => {
    if (isLoggedIn) {
      setIsUploadModalOpen(true); // 已登录：显示上传作品弹窗
    } else {
      setIsAuthModalOpen(true); // 未登录：显示登录弹窗
    }
  };

  const downloadMusicZip = async (musicItem?: any) => {
    setIsDownloading(true);
    try {
      // 如果指定了特定音乐，使用其downloadUrl
      if (musicItem && musicItem.downloadUrl) {
        const response = await fetch(musicItem.downloadUrl);
        if (!response.ok) {
          throw new Error("Download failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${musicItem.name
          .toLowerCase()
          .replace(/\s+/g, "-")}-demo.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
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
  };

  useEffect(() => {
    fetchMusics();
  }, []);

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
                            {t.rich("organizers", { br: () => <br /> })}
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
                          <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
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
              <div className="mt-8 flex gap-4">
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

        {/* Privacy Policy Modal */}
        <Dialog open={isPrivacyModalOpen} onOpenChange={setIsPrivacyModalOpen}>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                {t("privacyPolicyTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 max-h-[400px] space-y-4 overflow-y-auto text-sm leading-relaxed">
              <p>{t("privacyPolicyIntro")}</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>{t("privacyPolicyPoint1")}</li>
                <li>{t("privacyPolicyPoint2")}</li>
                <li>{t("privacyPolicyPoint3")}</li>
                <li>{t("privacyPolicyPoint4")}</li>
                <li>{t("privacyPolicyPoint5")}</li>
                <li>{t("privacyPolicyPoint6")}</li>
              </ul>
              <p>{t("privacyPolicyRights")}</p>
              <p>{t("privacyPolicyMinor")}</p>
              <p>{t("privacyPolicyDetails")}</p>
              <p className="font-semibold">{t("privacyPolicyAgreement")}</p>
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
      </div>
    </MusicPageProvider>
  );
}
