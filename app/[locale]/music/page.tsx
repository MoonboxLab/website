"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import FeaturedSongs from "@/components/FeaturedSongs";
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

export default function MusicPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [musics, setMusics] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [currentEventId, setCurrentEventId] = useState<number | undefined>(
    undefined,
  );
  const {
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    setSelectedMusicForDownload,
  } = useMusicPage();

  const fetchMusics = async () => {
    console.log("=== fetchMusics called ===", {
      currentEventId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Fetch music templates based on current event
      const url = new URL("/api/music/template/list", window.location.origin);
      if (currentEventId) {
        url.searchParams.set("monthNumber", currentEventId.toString());
      }

      console.log("Fetching musics with URL:", url.toString());

      const response = await fetch(url.toString());
      const data = await response.json();

      console.log("fetchMusics response:", {
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

        console.log("Transformed musics:", transformedMusics.length);
        setMusics(transformedMusics);
      } else {
        console.log("No data or failed response, setting empty array");
        setMusics([]);
      }
    } catch (error) {
      console.error("Failed to fetch musics:", error);
      setMusics([]);
    }
  };

  const fetchEvents = async () => {
    console.log("=== fetchEvents called ===", {
      timestamp: new Date().toISOString(),
    });

    try {
      // Fetch template events (精选活动列表)
      const templateResponse = await fetch("/api/music/template/month/list");
      const templateData = await templateResponse.json();

      console.log("fetchEvents response:", {
        success: templateData.success,
        dataLength: templateData.data?.length || 0,
      });

      const allEvents: Array<{ id: number; name: string; type: string }> = [];

      // Process template events
      if (templateData.success && templateData.data) {
        templateData.data.forEach((eventId: number) => {
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
            name: t("featuredSongsTemplate", { month: monthName, year }),
            type: "template",
          });
        });
      }

      console.log("Processed events:", allEvents.length);
      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    }
  };

  useEffect(() => {
    console.log("=== Events fetch useEffect ===");

    // Use setTimeout to prevent duplicate calls in React Strict Mode
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Set current event ID when events are loaded or URL params change
  useEffect(() => {
    console.log("=== Event ID useEffect ===", {
      eventParam: searchParams.get("event"),
      eventsLength: events.length,
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
    } else if (events.length > 0 && currentEventId === undefined) {
      // Only set default if currentEventId is still undefined
      console.log("Setting currentEventId to first event:", events[0].id);
      setCurrentEventId(events[0].id);
    }
  }, [events, searchParams]); // 移除 currentEventId 依赖

  // Fetch musics when currentEventId changes (including when it's undefined)
  useEffect(() => {
    console.log("=== Music fetch useEffect ===", {
      currentEventId,
      willFetch: true,
    });

    // Use a ref to prevent duplicate calls in React Strict Mode
    const timeoutId = setTimeout(() => {
      fetchMusics();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentEventId]);

  const handleViewAll = () => {
    setIsViewAllModalOpen(true);
  };

  const handleDownload = (music: any) => {
    setSelectedMusicForDownload(music);
    setIsPrivacyModalOpen(true);
  };

  return (
    <div>
      {/* Featured Songs Section for /music page */}
      <FeaturedSongs
        musics={musics}
        onViewAll={handleViewAll}
        onDownload={handleDownload}
        currentEventId={currentEventId}
      />

      {/* View All Modal for /music page */}
      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <div className="mt-2 flex flex-col gap-2">
            {events.length > 0 ? (
              events.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/music?event=${item.id}`}
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
