"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Loader2,
} from "lucide-react";
import { useMusic } from "@/lib/MusicContext";
import Image from "next/image";

export default function FloatingMusicPlayer() {
  const {
    state,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
  } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);

  if (!state.currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * state.duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
          isExpanded ? "w-80" : "h-16 w-64"
        }`}
      >
        {/* 紧凑模式 */}
        {!isExpanded && (
          <div className="flex h-full items-center gap-3 px-3">
            {/* 封面 */}
            <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200">
              {state.currentTrack.coverUrl ? (
                <Image
                  src={state.currentTrack.coverUrl}
                  alt={state.currentTrack.name}
                  width={40}
                  height={40}
                  className="h-full w-full rounded object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded bg-gradient-to-br from-purple-400 to-pink-400">
                  <div className="h-4 w-4 rounded bg-white/80"></div>
                </div>
              )}
            </div>

            {/* 歌曲信息 */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {state.currentTrack.name}
              </p>
              <p className="truncate text-xs text-gray-600">
                {state.currentTrack.description}
              </p>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center gap-1">
              <button
                onClick={previousTrack}
                className="rounded p-1 hover:bg-gray-100"
                disabled={state.playlist.length <= 1}
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlayPause}
                className="rounded p-1 hover:bg-gray-100"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : state.isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="rounded p-1 hover:bg-gray-100"
                disabled={state.playlist.length <= 1}
              >
                <SkipForward size={16} />
              </button>
              <button
                onClick={() => setIsExpanded(true)}
                className="rounded p-1 hover:bg-gray-100"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* 展开模式 */}
        {isExpanded && (
          <div className="flex h-full flex-col p-3">
            {/* 头部 */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* 封面 */}
                <div className="h-10 w-10 rounded bg-gray-200">
                  {state.currentTrack.coverUrl ? (
                    <Image
                      src={state.currentTrack.coverUrl}
                      alt={state.currentTrack.name}
                      width={40}
                      height={40}
                      className="h-full w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded bg-gradient-to-br from-purple-400 to-pink-400">
                      <div className="h-4 w-4 rounded bg-white/80"></div>
                    </div>
                  )}
                </div>

                {/* 歌曲信息 */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {state.currentTrack.name}
                  </p>
                  <p className="truncate text-xs text-gray-600">
                    {state.currentTrack.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="rounded p-1 hover:bg-gray-100"
              >
                <Minimize2 size={14} />
              </button>
            </div>

            {/* 进度条 */}
            <div className="mb-2">
              <div
                className="h-2 w-full cursor-pointer rounded-full bg-gray-200"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full rounded-full bg-black transition-all duration-100"
                  style={{
                    width: `${(state.currentTime / state.duration) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-600">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={previousTrack}
                  className="rounded p-1.5 hover:bg-gray-100"
                  disabled={state.playlist.length <= 1}
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="rounded p-1.5 hover:bg-gray-100"
                  disabled={state.isLoading}
                >
                  {state.isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : state.isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </button>
                <button
                  onClick={nextTrack}
                  className="rounded p-1.5 hover:bg-gray-100"
                  disabled={state.playlist.length <= 1}
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* 音量控制 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsVolumeVisible(!isVolumeVisible)}
                  className="rounded p-1.5 hover:bg-gray-100"
                >
                  {state.volume === 0 ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} />
                  )}
                </button>
                {isVolumeVisible && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={state.volume}
                      onChange={handleVolumeChange}
                      className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20"
                      style={{
                        background: `linear-gradient(to right, #000 0%, #000 ${
                          state.volume * 100
                        }%, #e5e7eb ${state.volume * 100}%, #e5e7eb 100%)`,
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <style jsx>{`
                      input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #000;
                        cursor: pointer;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                      }
                      input[type="range"]::-moz-range-thumb {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #000;
                        cursor: pointer;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                      }
                    `}</style>
                    <span className="w-8 text-center text-xs text-gray-600">
                      {Math.round(state.volume * 100)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
