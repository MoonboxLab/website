"use client";

import Image from "next/image";
import { Play, Download, Music } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMusic } from "@/lib/MusicContext";

interface FeaturedSongsProps {
  musics: any[];
  onViewAll: () => void;
  onDownload: (music: any) => void;
  currentEventId?: number;
  isLoading?: boolean;
}

export default function FeaturedSongs({
  musics,
  onViewAll,
  onDownload,
  currentEventId,
  isLoading = false,
}: FeaturedSongsProps) {
  const t = useTranslations("Music");
  const { playTrack } = useMusic();

  // Helper function to convert event ID (year*12+month) to year and month
  const convertEventIdToDate = (eventId: number) => {
    const year = Math.floor((eventId - 1) / 12);
    const month = ((eventId - 1) % 12) + 1;
    return { year, month };
  };

  // Get dynamic title based on current event
  const getTitle = () => {
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    if (currentEventId && currentEventId > 0) {
      const { year, month } = convertEventIdToDate(currentEventId);
      const monthKey = monthNames[month - 1];
      const monthName = t(`months.${monthKey}`);
      return t("featuredSongsTemplate", { month: monthName, year });
    }
    // Use current month when no valid eventId
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const monthKey = monthNames[currentMonth - 1];
    const monthName = t(`months.${monthKey}`);
    return t("featuredSongsTemplate", { month: monthName, year: currentYear });
  };

  return (
    <div className="mt-12">
      <div
        className={`mx-auto mt-4 grid w-full rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:px-16 lg:py-10`}
      >
        {isLoading ? (
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="mb-2 h-7 w-56 rounded bg-gray-200 lg:h-8 lg:w-72" />
              <div className="h-4 w-40 rounded bg-gray-200 lg:w-48" />
            </div>
            <div className="h-10 w-28 rounded-lg border-2 border-black bg-gray-200" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold lg:text-3xl">{getTitle()}</h2>
              <p className="text-sm text-gray-600 lg:text-base">
                {t("providedBy")}
              </p>
            </div>
            <button
              onClick={onViewAll}
              className="rounded-lg border-2 border-black bg-white px-6 py-3 text-sm font-bold lg:text-base"
            >
              {t("viewAll")}
            </button>
          </div>
        )}

        {/* Songs Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <div className="h-full w-full animate-pulse bg-gray-200" />
                </div>
                <div className="mt-2">
                  <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="h-8 w-full animate-pulse rounded border border-gray-300 bg-gray-200" />
                  <div className="h-8 w-full animate-pulse rounded border border-gray-300 bg-gray-200" />
                </div>
              </div>
            ))
          ) : musics.length > 0 ? (
            musics.map((item) => (
              <div className="cursor-pointer" key={item.id}>
                <div
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() =>
                    playTrack(
                      {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        audioUrl: item.audioUrl || `/music/${item.id}.mp3`,
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
                    className="h-full w-full object-cover transition-all duration-300 hover:brightness-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[inset_0_-2px_5px_rgba(255,255,255,0.6)] group-hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group-hover:backdrop-brightness-110">
                      <div className="ml-1 h-0 w-0 border-y-[6px] border-l-[8px] border-y-transparent border-l-white transition-all duration-300 group-hover:scale-110"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    onClick={() =>
                      playTrack(
                        {
                          id: item.id,
                          name: item.name,
                          description: item.description,
                          audioUrl: item.audioUrl || `/music/${item.id}.mp3`,
                          coverUrl:
                            item.coverUrl || `/music/covers/${item.id}.jpg`,
                        },
                        musics,
                      )
                    }
                    className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    <Play size={12} />
                    {t("playNow")}
                  </button>
                  {item.status === 1 && (
                    <button
                      onClick={() => onDownload(item)}
                      className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                      <Download size={12} />
                      {t("downloadDemo")}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Music className="mb-6 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                {t("noSongsAvailable.title")}
              </h3>
              <p className="max-w-md text-center text-sm text-gray-500">
                {t("noSongsAvailable.description")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
