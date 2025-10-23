"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import VotingSongs from "@/components/VotingSongs";
import { useMusicPage } from "@/lib/MusicPageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function MusicVotingPage() {
  const t = useTranslations("Music");
  const locale = useLocale();
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [votingMusics, setVotingMusics] = useState<any[]>([]);
  const [votingEvents, setVotingEvents] = useState<any[]>([]);
  const {
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    setSelectedMusicForDownload,
  } = useMusicPage();

  const fetchVotingMusics = async () => {
    // Mock data for voting - different from regular musics
    const mockVotingMusics = [
      {
        id: "v1",
        name: "Voting Song 1",
        description: "First voting track",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=10",
        downloadUrl: "/music/downloads/voting-song-1-demo.zip",
        voteCount: 156,
      },
      {
        id: "v2",
        name: "Voting Song 2",
        description: "Second voting track",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=11",
        downloadUrl: "/music/downloads/voting-song-2-demo.zip",
        voteCount: 89,
      },
      {
        id: "v3",
        name: "Voting Song 3",
        description: "Third voting track",
        audioUrl:
          "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
        coverUrl: "https://picsum.photos/200/200?random=12",
        downloadUrl: "/music/downloads/voting-song-3-demo.zip",
        voteCount: 234,
      },
    ];

    setVotingMusics(mockVotingMusics);

    // Try to fetch real voting data, but fallback to mock if it fails
    try {
      const response = await fetch("/api/voting-musics");
      const data = await response.json();
      if (data && data.length > 0) {
        setVotingMusics(data);
      }
    } catch (error) {
      console.log("Using mock data for voting musics");
    }
  };

  const fetchVotingEvents = async () => {
    // Mock data for voting events - different from regular events
    const mockVotingEvents = [
      {
        id: "voting1",
        name: "Voting Event 1",
      },
      {
        id: "voting2",
        name: "Voting Event 2",
      },
      {
        id: "voting3",
        name: "Voting Event 3",
      },
    ];

    setVotingEvents(mockVotingEvents);

    // Try to fetch real voting events data, but fallback to mock if it fails
    try {
      const response = await fetch("/api/voting-events");
      const data = await response.json();
      if (data && data.length > 0) {
        setVotingEvents(data);
      }
    } catch (error) {
      console.log("Using mock data for voting events");
    }
  };

  useEffect(() => {
    fetchVotingMusics();
    fetchVotingEvents();
  }, []);

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
      {/* Voting Songs Section */}
      <VotingSongs
        musics={votingMusics}
        onViewAll={handleViewAll}
        onBid={handleBid}
      />

      {/* View All Modal for /music/voting page */}
      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <div className="mt-2 flex flex-col gap-2">
            {votingEvents.map((item) => (
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
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
