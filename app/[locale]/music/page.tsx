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
  const year = Math.floor((eventId - 1) / 12);
  const month = ((eventId - 1) % 12) + 1;
  return { year, month };
};

export default function MusicPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [currentEventId, setCurrentEventId] = useState<number | undefined>(
    undefined,
  );
  const [isLoadingMusics, setIsLoadingMusics] = useState<boolean>(true);
  const {
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    setSelectedMusicForDownload,
    fetchMusics,
    musics,
  } = useMusicPage();

  const fetchEvents = async () => {
    console.log("=== fetchEvents called ===", {
      timestamp: new Date().toISOString(),
    });

    setIsLoadingEvents(true);
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
    } finally {
      setIsLoadingEvents(false);
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

  // Fetch musics when currentEventId changes (but not when it's undefined, since layout handles initial load)
  useEffect(() => {
    console.log("=== Music fetch useEffect ===", {
      currentEventId,
      willFetch: currentEventId !== undefined,
      eventsLength: events.length,
      isLoadingEvents,
    });

    // If events are still loading, wait
    if (isLoadingEvents) {
      return;
    }

    // If events are loaded but empty, directly set musics to empty
    if (events.length === 0) {
      setIsLoadingMusics(false);
      // Call fetchMusics with an invalid eventId to ensure musics state is cleared
      // Using -1 as invalid eventId should return empty array from API
      fetchMusics(-1);
      return;
    }

    // Only fetch when we have a specific event ID (not undefined)
    if (currentEventId !== undefined) {
      // Set loading immediately to avoid brief empty-state flash between sequential effects in Strict Mode
      setIsLoadingMusics(true);
      // Use setTimeout to prevent duplicate calls in React Strict Mode
      const timeoutId = setTimeout(() => {
        (async () => {
          try {
            await fetchMusics(currentEventId);
          } finally {
            setIsLoadingMusics(false);
          }
        })();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentEventId, fetchMusics, events, isLoadingEvents]);

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
        isLoading={isLoadingMusics}
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
