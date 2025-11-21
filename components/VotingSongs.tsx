"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Ticket, Vote, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMusic } from "@/lib/MusicContext";
import VoteModal from "./VoteModal";

interface VotingSongsProps {
  musics: any[];
  onViewAll: () => void;
  onBid: (music: any) => void;
  currentEventId?: number;
  isLoading?: boolean;
  onVoted?: (voteData: {
    musicId: string;
    voteType: "nobody" | "aice" | "fir";
    amount: number;
    txHash?: string;
  }) => void;
}

export default function VotingSongs({
  musics,
  onViewAll,
  onBid,
  currentEventId,
  isLoading = false,
  onVoted,
}: VotingSongsProps) {
  const t = useTranslations("Music");
  const { playTrack } = useMusic();
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<any>(null);

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

    // If currentEventId is valid, use it regardless of data availability
    if (currentEventId && currentEventId > 0) {
      const { year, month } = convertEventIdToDate(currentEventId);
      const monthKey = monthNames[month - 1];
      const monthName = t(`months.${monthKey}`);
      return t("finalistsTemplate", { month: monthName, year });
    }

    // Use previous month when no valid eventId (e.g., when no events found)
    const now = new Date();
    const currentMonthIndex = now.getMonth(); // getMonth() returns 0-11 (0=Jan, 11=Dec)
    let previousYear = now.getFullYear();
    let previousMonthIndex: number;

    // Calculate previous month index (handle year rollover)
    if (currentMonthIndex === 0) {
      // If current month is January, previous month is December of last year
      previousMonthIndex = 11; // December index
      previousYear -= 1;
    } else {
      // Otherwise, subtract 1 to get previous month index
      previousMonthIndex = currentMonthIndex - 1;
    }

    // previousMonthIndex is now 0-11, use it directly for array access
    const monthKey = monthNames[previousMonthIndex];
    const monthName = t(`months.${monthKey}`);
    return t("finalistsTemplate", { month: monthName, year: previousYear });
  };

  const handleVoteClick = (music: any) => {
    setSelectedMusic(music);
    setIsVoteModalOpen(true);
  };

  const handleVote = async (voteData: {
    musicId: string;
    voteType: "nobody" | "aice" | "fir";
    amount: number;
    txHash?: string;
  }) => {
    // 投票成功后的回调，通知上层刷新数据
    try {
      onVoted?.(voteData);
    } finally {
      // no-op
    }
  };

  return (
    <div className="">
      <div
        className={`mx-auto grid w-full rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:px-16 lg:py-10`}
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
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="relative cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                    <div className="h-full w-full animate-pulse bg-gray-200" />
                  </div>
                  <div className="mt-2">
                    <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                    <div className="mt-1 h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="h-8 w-full animate-pulse rounded border border-gray-300 bg-gray-200" />
                    <div className="h-8 w-full animate-pulse rounded border border-gray-300 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : musics.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {musics.map((item, index) => {
                const rank = index + 1;
                const getRankColor = (rank: number) => {
                  switch (rank) {
                    case 1:
                      return "text-yellow-500"; // 金色
                    case 2:
                      return "text-blue-400"; // 蓝色
                    case 3:
                      return "text-orange-500"; // 橙色
                    default:
                      return "text-gray-700";
                  }
                };

                const getRankBadge = (rank: number) => {
                  if (rank <= 3) {
                    const getRankIcon = (rank: number) => {
                      return (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M10.1737 16.9903H6L4 7.79549L7.33617 10.7375L10.1737 16.9903Z"
                            fill="currentColor"
                          />
                          <path
                            d="M10.1737 16.9903H6L4 7.7955L7.33617 10.7375L10.1737 16.9903Z"
                            fill="white"
                            fillOpacity="0.42"
                          />
                          <path
                            d="M11.5834 6.00162V17H7.1365V16.9114H7.13499V10.9984L7.1365 10.9968L8.52821 9.43318L11.5834 6.00162Z"
                            fill="currentColor"
                          />
                          <path
                            d="M11.5834 6.00162V17H7.1365V16.9114H7.13499V10.9984L7.1365 10.9968L8.52821 9.43318L11.5834 6.00162Z"
                            fill="white"
                            fillOpacity="0.42"
                          />
                          <path
                            d="M12.9961 17H17.1713L19.1713 7.80516H19.1698L15.8351 10.7472L12.9961 17Z"
                            fill="currentColor"
                          />
                          <path
                            d="M11.5594 6V16.9984H16.0063V10.9968L14.6145 9.43156L11.5594 6Z"
                            fill="currentColor"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.5624 9.33011L10.624 10.3994L11.5624 11.3897L12.5457 10.3994L11.5624 9.33011Z"
                            fill="white"
                          />
                          <path
                            d="M17.4685 14.6457H5.82885C5.72976 14.6457 5.64869 14.5588 5.64869 14.4525V14.3784C5.64869 14.2721 5.72976 14.1852 5.82885 14.1852H17.4685C17.5676 14.1852 17.6487 14.2721 17.6487 14.3784V14.4525C17.6487 14.5588 17.5676 14.6457 17.4685 14.6457Z"
                            fill="white"
                          />
                          <path
                            d="M6.38433 14.4155C6.38433 14.4977 6.42525 14.5737 6.49168 14.6149C6.5581 14.656 6.63994 14.656 6.70637 14.6149C6.77279 14.5737 6.81371 14.4977 6.81371 14.4155C6.81371 14.3332 6.77279 14.2572 6.70637 14.216C6.63994 14.1749 6.5581 14.1749 6.49168 14.216C6.42525 14.2572 6.38433 14.3332 6.38433 14.4155Z"
                            fill="currentColor"
                          />
                          <path
                            d="M8.30752 14.4187C8.30752 14.5459 8.40364 14.6489 8.52221 14.6489C8.64077 14.6489 8.73689 14.5459 8.73689 14.4187C8.73689 14.2915 8.64077 14.1884 8.52221 14.1884C8.40364 14.1884 8.30752 14.2915 8.30752 14.4187Z"
                            fill="currentColor"
                          />
                          <path
                            d="M10.2292 14.4187C10.2292 14.5009 10.2701 14.577 10.3365 14.6181C10.403 14.6592 10.4848 14.6592 10.5512 14.6181C10.6177 14.577 10.6586 14.5009 10.6586 14.4187C10.6586 14.2915 10.5625 14.1884 10.4439 14.1884C10.3253 14.1884 10.2292 14.2915 10.2292 14.4187Z"
                            fill="currentColor"
                          />
                          <path
                            d="M12.1509 14.4187C12.1509 14.5459 12.247 14.6489 12.3656 14.6489C12.4841 14.6489 12.5803 14.5459 12.5803 14.4187C12.5803 14.2915 12.4841 14.1884 12.3656 14.1884C12.247 14.1884 12.1509 14.2915 12.1509 14.4187Z"
                            fill="currentColor"
                          />
                          <path
                            d="M14.1236 14.4187C14.1236 14.5459 14.2197 14.6489 14.3383 14.6489C14.4569 14.6489 14.553 14.5459 14.553 14.4187C14.553 14.2915 14.4569 14.1884 14.3383 14.1884C14.2197 14.1884 14.1236 14.2915 14.1236 14.4187Z"
                            fill="currentColor"
                          />
                          <path
                            d="M16.0243 14.4155C16.0243 14.5426 16.1204 14.6457 16.239 14.6457C16.3575 14.6457 16.4536 14.5426 16.4536 14.4155C16.4536 14.2883 16.3575 14.1852 16.239 14.1852C16.1204 14.1852 16.0243 14.2883 16.0243 14.4155Z"
                            fill="currentColor"
                          />
                        </svg>
                      );
                    };

                    return (
                      <div className="absolute left-1 top-1 z-10">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full  backdrop-blur-sm ${
                            rank === 1
                              ? "bg-white/20 text-yellow-500"
                              : rank === 2
                              ? "bg-white/20 text-blue-400"
                              : "bg-white/20 text-orange-500"
                          }`}
                        >
                          {getRankIcon(rank)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                };

                return (
                  <div className="relative cursor-pointer" key={item.id}>
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
                    {getRankBadge(rank)}
                    <div className="mt-2">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                      <div className="mt-1">
                        <div
                          className={`flex items-center gap-1 text-sm font-medium ${getRankColor(
                            rank,
                          )}`}
                        >
                          <Ticket size={14} />
                          <span>{item.voteCount || 0}</span>
                        </div>
                      </div>
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
                                item.audioUrl || `/music/${item.id}.mp3`,
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
                      <button
                        onClick={() => handleVoteClick(item)}
                        className="flex items-center justify-center gap-1 rounded border border-gray-300 bg-yellow-400 px-2 py-1 text-xs font-bold hover:bg-yellow-500"
                      >
                        <Vote size={12} />
                        {t("vote")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <BarChart3 className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                {t("noFinalistsAvailable.title")}
              </h3>
              <p className="max-w-md text-center text-sm text-gray-500">
                {t("noFinalistsAvailable.description")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 投票弹窗 */}
      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        music={selectedMusic}
        onVote={handleVote}
      />
    </div>
  );
}
