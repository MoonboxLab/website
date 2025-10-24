"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import FeaturedSongs from "@/components/FeaturedSongs";
import { useMusicPage } from "@/lib/MusicPageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Calendar } from "lucide-react";

// Helper function to convert event ID (year*12+month) to year and month
const convertEventIdToDate = (eventId: number) => {
  const year = Math.floor(eventId / 12);
  const month = eventId % 12;
  return { year, month };
};

export default function MusicPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
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

  const fetchEvents = async () => {
    try {
      // Fetch template events (精选活动列表)
      const templateResponse = await fetch("/api/music/template/month/list");
      const templateData = await templateResponse.json();

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

      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchMusics();
    fetchEvents();
  }, []);

  // Set current event ID when events are loaded
  useEffect(() => {
    if (events.length > 0 && !currentEventId) {
      setCurrentEventId(events[0].id);
    }
  }, [events, currentEventId]);

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
