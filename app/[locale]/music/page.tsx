"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import FeaturedSongs from "@/components/FeaturedSongs";
import { useMusicPage } from "@/lib/MusicPageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function MusicPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [musics, setMusics] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
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

  useEffect(() => {
    fetchMusics();
    fetchEvents();
  }, []);

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
      />

      {/* View All Modal for /music page */}
      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <div className="mt-2 flex flex-col gap-2">
            {events.map((item) => (
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
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
