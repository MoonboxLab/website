"use client";

import Image from "next/image";

import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Play, Download } from "lucide-react";

export default function MusicPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const list = [
    {
      id: 1,
      name: "CoolBoy1234",
      description: "♪♪海阔天空",
    },
    {
      id: 2,
      name: "HawkHawk",
      description: "♪♪如果粤语歌曲有天花板...",
    },
    {
      id: 3,
      name: "ILOVEStevey",
      description: "♪♪塞基洛斯之歌",
    },
    {
      id: 4,
      name: "CoolGirl8862",
      description: "♪♪海阔天空",
    },
  ];

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
                <div>
                  <h2 className="text-2xl font-bold lg:text-3xl">
                    {t("featuredSongs")}
                  </h2>
                  <p className="text-sm text-gray-600 lg:text-base">
                    {t("providedBy")}
                  </p>
                </div>

                {/* Songs Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {/* Song Card 1 */}
                  {list.map((item) => (
                    <div className="cursor-pointer" key={item.id}>
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400"></div>
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
                        <button className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs">
                          <Play size={12} />
                          {t("playNow")}
                        </button>
                        <button className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs">
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
    </div>
  );
}
