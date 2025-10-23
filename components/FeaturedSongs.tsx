"use client";

import Image from "next/image";
import { Play, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMusic } from "@/lib/MusicContext";

interface FeaturedSongsProps {
  musics: any[];
  onViewAll: () => void;
  onDownload: (music: any) => void;
}

export default function FeaturedSongs({
  musics,
  onViewAll,
  onDownload,
}: FeaturedSongsProps) {
  const t = useTranslations("Music");
  const { playTrack } = useMusic();

  return (
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
            onClick={onViewAll}
            className="rounded-lg border-2 border-black bg-white px-6 py-3 text-sm font-bold lg:text-base"
          >
            {t("viewAll")}
          </button>
        </div>

        {/* Songs Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {musics.map((item) => (
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
                      coverUrl: item.coverUrl || `/music/covers/${item.id}.jpg`,
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
                <button
                  onClick={() => onDownload(item)}
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
  );
}
