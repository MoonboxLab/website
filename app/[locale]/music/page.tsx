"use client";

import Image from "next/image";

import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
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

export default function MusicPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const { playTrack } = useMusic();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [musics, setMusics] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedMusicForDownload, setSelectedMusicForDownload] =
    useState<any>(null);

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

  const fetchEvents = async () => {
    // Mock data for events
    const mockEvents = [
      {
        id: "event1",
        name: "Concert Night",
      },
      {
        id: "event2",
        name: "DJ Set",
      },
      {
        id: "event3",
        name: "Acoustic Session",
      },
      {
        id: "event4",
        name: "Rock Night",
      },
    ];

    setEvents(mockEvents);

    // Try to fetch real data, but fallback to mock if it fails
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data && data.length > 0) {
        setEvents(data);
      }
    } catch (error) {
      console.log("Using mock data for events");
    }
  };
  const fetchMusics = async () => {
    // Mock data for testing
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

  useEffect(() => {
    fetchEvents();
    fetchMusics();
  }, []);

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

        <div className="mx-auto mt-8 max-w-[1447px] px-4 lg:px-16">
          <div className="mt-8">
            <Image
              src={locale === "en" ? "/music/banner.png" : "/music/banner.png"}
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
                        <div>{t.rich("organizers", { br: () => <br /> })}</div>
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
                onClick={() => setIsAuthModalOpen(true)}
                className="flex-1 rounded-lg border-2 border-black bg-white px-6 py-3 text-lg font-bold"
              >
                {t("submitWork")}
              </button>
              <button className="flex-1 rounded-lg border-2 border-black bg-yellow-400 px-6 py-3 text-lg font-bold">
                {t("voteNow")}
              </button>
            </div>

            {/* Featured Songs Section */}
            <div className="mt-12">
              <div
                className={`mx-auto mt-4 grid w-full rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:px-16 lg:py-10`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold lg:text-3xl">
                      {t("featuredSongs")}
                    </h2>
                    <p className="text-sm text-gray-600 lg:text-base">
                      {t("providedBy")}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsViewAllModalOpen(true)}
                    className="rounded-lg border-2 border-black bg-white px-6 py-3 text-sm font-bold lg:text-base"
                  >
                    {t("viewAll")}
                  </button>
                </div>

                {/* Songs Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {/* Song Card 1 */}
                  {musics.map((item) => (
                    <div className="cursor-pointer" key={item.id}>
                      <div
                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-200"
                        onClick={() =>
                          playTrack(
                            {
                              id: item.id,
                              name: item.name,
                              description: item.description,
                              audioUrl:
                                item.audioUrl || `/music/${item.id}.mp3`,
                              coverUrl:
                                item.coverUrl || `/music/covers/${item.id}.jpg`,
                            },
                            musics,
                          )
                        }
                      >
                        <Image
                          src={item.coverUrl}
                          alt={item.name}
                          width={200}
                          height={200}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <div className="ml-1 h-0 w-0 border-y-[6px] border-l-[8px] border-y-transparent border-l-white"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-col gap-2">
                        <button
                          onClick={() =>
                            playTrack(
                              {
                                id: item.id,
                                name: item.name,
                                description: item.description,
                                audioUrl:
                                  item.audioUrl || `/music/${item.id}.mp3`, // 假设音频文件路径
                                coverUrl:
                                  item.coverUrl ||
                                  `/music/covers/${item.id}.jpg`, // 假设封面路径
                              },
                              musics,
                            )
                          }
                          className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          <Play size={12} />
                          {t("playNow")}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMusicForDownload(item);
                            setIsPrivacyModalOpen(true);
                          }}
                          className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          <Download size={12} />
                          {t("downloadDemo")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      {/* View All Modal */}
      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <div className="mt-2 space-y-3">
            {events.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <div className="text-gray-400">→</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
  );
}
