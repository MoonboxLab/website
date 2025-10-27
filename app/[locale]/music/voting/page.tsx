"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import VotingSongs from "@/components/VotingSongs";
import { useMusicPage } from "@/lib/MusicPageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Helper function to convert event ID (year*12+month) to year and month
const convertEventIdToDate = (eventId: number) => {
  const year = Math.floor(eventId / 12);
  const month = eventId % 12;
  return { year, month };
};

export default function MusicVotingPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [votingMusics, setVotingMusics] = useState<any[]>([]);
  const [votingEvents, setVotingEvents] = useState<any[]>([]);
  const [currentEventId, setCurrentEventId] = useState<number | undefined>(
    undefined,
  );
  const [useMockData, setUseMockData] = useState(false); // 默认使用真实数据
  const {
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    setSelectedMusicForDownload,
  } = useMusicPage();

  const fetchVotingMusics = async () => {
    console.log("=== fetchVotingMusics called ===", {
      currentEventId,
      useMockData,
      timestamp: new Date().toISOString(),
    });

    try {
      // Choose API endpoint based on mock data setting
      const baseUrl = useMockData
        ? "/api/music/creation/vote/list/mock"
        : "/api/music/creation/vote/list";

      const url = new URL(baseUrl, window.location.origin);
      if (currentEventId) {
        url.searchParams.set("monthNumber", currentEventId.toString());
      }

      console.log("Fetching voting musics with URL:", url.toString());

      const response = await fetch(url.toString());
      const data = await response.json();

      console.log("fetchVotingMusics response:", {
        success: data.success,
        dataLength: data.data?.length || 0,
      });

      if (data.success && data.data) {
        // Transform API data to match component format
        const transformedMusics = data.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.user?.nickname || `User ${item.user?.id || item.id}`, // Use nickname or user ID
          description: item.title, // Using title as description
          audioUrl: item.url,
          coverUrl: item.user?.avator || "/music/covers/default.jpg", // Use user avatar as cover
          downloadUrl: null, // No download for voting musics
          voteCount: item.scope || 0, // Using scope as vote count
          status: item.status,
          singer: item.singer,
          user: item.user,
          createTm: item.createTm,
        }));

        console.log("Transformed voting musics:", transformedMusics.length);
        setVotingMusics(transformedMusics);
      } else {
        console.log("No data or failed response, setting empty array");
        setVotingMusics([]);
      }
    } catch (error) {
      console.error("Failed to fetch voting musics:", error);
      setVotingMusics([]);
    }
  };

  const fetchVotingEvents = async () => {
    console.log("=== fetchVotingEvents called ===", {
      useMockData,
      timestamp: new Date().toISOString(),
    });

    try {
      // Choose API endpoint based on mock data setting
      const url = useMockData
        ? "/api/music/creation/month/list/mock"
        : "/api/music/creation/month/list";

      console.log("Fetching voting events with URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("fetchVotingEvents response:", {
        success: data.success,
        dataLength: data.data?.length || 0,
      });

      const allEvents: Array<{ id: number; name: string; type: string }> = [];

      // Process events
      if (data.success && data.data) {
        data.data.forEach((eventId: number) => {
          const { year, month } = convertEventIdToDate(eventId);
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
          const monthKey = monthNames[month - 1];
          const monthName = t(`months.${monthKey}`);

          allEvents.push({
            id: eventId,
            name: t("finalistsTemplate", { month: monthName, year }),
            type: "creation",
          });
        });
      }

      console.log("Processed voting events:", allEvents.length);
      setVotingEvents(allEvents);
    } catch (error) {
      console.error("Failed to fetch voting events:", error);
      setVotingEvents([]);
    }
  };

  useEffect(() => {
    console.log("=== Voting Events fetch useEffect ===");

    // Use setTimeout to prevent duplicate calls in React Strict Mode
    const timeoutId = setTimeout(() => {
      fetchVotingEvents();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [useMockData]);

  // Set current event ID when events are loaded or URL params change
  useEffect(() => {
    console.log("=== Voting Event ID useEffect ===", {
      eventParam: searchParams.get("event"),
      eventsLength: votingEvents.length,
      currentEventId,
    });

    const eventParam = searchParams.get("event");

    if (eventParam) {
      // Use event from URL parameter
      const eventId = parseInt(eventParam);
      if (!isNaN(eventId) && eventId !== currentEventId) {
        console.log("Setting currentEventId from URL param:", eventId);
        setCurrentEventId(eventId);
      }
    } else if (votingEvents.length > 0 && currentEventId === undefined) {
      // Only set default if currentEventId is still undefined
      console.log("Setting currentEventId to first event:", votingEvents[0].id);
      setCurrentEventId(votingEvents[0].id);
    }
  }, [votingEvents, searchParams]); // 移除 currentEventId 依赖

  // Fetch voting musics when currentEventId or useMockData changes
  useEffect(() => {
    console.log("=== Voting Music fetch useEffect ===", {
      currentEventId,
      useMockData,
      willFetch: true,
    });

    // Use setTimeout to prevent duplicate calls in React Strict Mode
    const timeoutId = setTimeout(() => {
      fetchVotingMusics();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentEventId, useMockData]);

  const handleViewAll = () => {
    setIsViewAllModalOpen(true);
  };

  const handleBid = (music: any) => {
    // TODO: 实现投标功能
    console.log("Bidding on:", music);
    // 这里可以打开投标弹窗或跳转到投标页面
  };

  const handleDownload = (music: any) => {
    setSelectedMusicForDownload(music);
    setIsPrivacyModalOpen(true);
  };

  return (
    <div>
      {/* Mock Data Toggle - Hidden */}
      {/* <div className="mb-4 flex justify-center">
        <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold">测试模式:</span>
            <button
              onClick={() => setUseMockData(!useMockData)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                useMockData
                  ? "bg-green-400 text-black hover:bg-green-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {useMockData ? "Mock数据" : "真实数据"}
            </button>
            <span className="text-xs text-gray-600">
              {useMockData ? "使用测试数据" : "使用真实API"}
            </span>
          </div>
        </div>
      </div> */}

      {/* Voting Songs Section */}
      <VotingSongs
        musics={votingMusics}
        onViewAll={handleViewAll}
        onBid={handleBid}
        currentEventId={currentEventId}
      />

      {/* View All Modal for /music/voting page */}
      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <div className="mt-2 flex flex-col gap-2">
            {votingEvents.length > 0 ? (
              votingEvents.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/music/voting?event=${item.id}`}
                  onClick={() => setIsViewAllModalOpen(false)}
                >
                  <div className="cursor-pointer rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:border-gray-400 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <div className="text-gray-400">→</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">
                  {t("noEventsAvailable")}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
