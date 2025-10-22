"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";

export interface MusicTrack {
  id: string;
  name: string;
  description: string;
  audioUrl?: string;
  coverUrl?: string;
  duration?: number;
}

interface MusicState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playlist: MusicTrack[];
  currentIndex: number;
}

type MusicAction =
  | { type: "SET_TRACK"; payload: MusicTrack }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SET_CURRENT_TIME"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_PLAYLIST"; payload: MusicTrack[] }
  | { type: "NEXT_TRACK" }
  | { type: "PREVIOUS_TRACK" }
  | { type: "SET_CURRENT_INDEX"; payload: number };

const initialState: MusicState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  playlist: [],
  currentIndex: -1,
};

function musicReducer(state: MusicState, action: MusicAction): MusicState {
  switch (action.type) {
    case "SET_TRACK":
      return {
        ...state,
        currentTrack: action.payload,
        isPlaying: true,
        currentTime: 0,
      };
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_PLAYLIST":
      return { ...state, playlist: action.payload };
    case "NEXT_TRACK":
      const nextIndex =
        state.currentIndex < state.playlist.length - 1
          ? state.currentIndex + 1
          : 0;
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.playlist[nextIndex] || null,
        currentTime: 0,
        isPlaying: true,
      };
    case "PREVIOUS_TRACK":
      const prevIndex =
        state.currentIndex > 0
          ? state.currentIndex - 1
          : state.playlist.length - 1;
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.playlist[prevIndex] || null,
        currentTime: 0,
        isPlaying: true,
      };
    case "SET_CURRENT_INDEX":
      return {
        ...state,
        currentIndex: action.payload,
        currentTrack: state.playlist[action.payload] || null,
        currentTime: 0,
        isPlaying: true,
      };
    default:
      return state;
  }
}

interface MusicContextType {
  state: MusicState;
  dispatch: React.Dispatch<MusicAction>;
  audioRef: React.RefObject<HTMLAudioElement>;
  playTrack: (track: MusicTrack, playlist?: MusicTrack[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = (track: MusicTrack, playlist?: MusicTrack[]) => {
    if (playlist) {
      dispatch({ type: "SET_PLAYLIST", payload: playlist });
      const index = playlist.findIndex((t) => t.id === track.id);
      dispatch({ type: "SET_CURRENT_INDEX", payload: index });
    }
    dispatch({ type: "SET_TRACK", payload: track });
  };

  const togglePlayPause = () => {
    if (state.isPlaying) {
      dispatch({ type: "PAUSE" });
    } else {
      dispatch({ type: "PLAY" });
    }
  };

  const nextTrack = () => {
    dispatch({ type: "NEXT_TRACK" });
  };

  const previousTrack = () => {
    dispatch({ type: "PREVIOUS_TRACK" });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: "SET_VOLUME", payload: volume });
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: "SET_CURRENT_TIME", payload: time });
    }
  };

  // 音频事件处理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: "SET_DURATION", payload: audio.duration || 0 });
    };

    const handleEnded = () => {
      if (state.playlist.length > 0) {
        nextTrack();
      } else {
        dispatch({ type: "PAUSE" });
      }
    };

    const handleVolumeChange = () => {
      dispatch({ type: "SET_VOLUME", payload: audio.volume });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [state.playlist.length]);

  // 播放/暂停控制
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      // 检查音频是否已加载
      if (audio.readyState >= 2) {
        // HAVE_CURRENT_DATA
        audio.play().catch((error) => {
          console.log("Play failed:", error);
          dispatch({ type: "PAUSE" });
        });
      }
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  // 音量控制
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.volume;
  }, [state.volume]);

  // 当前曲目变化时更新音频源
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack?.audioUrl) return;

    audio.src = state.currentTrack.audioUrl;
    audio.load();

    // 当音频可以播放时，如果状态是播放中，就自动播放
    const handleCanPlay = () => {
      if (state.isPlaying) {
        audio.play().catch((error) => {
          console.log("Autoplay prevented:", error);
          dispatch({ type: "PAUSE" });
        });
      }
    };

    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [state.currentTrack, state.isPlaying]);

  const value: MusicContextType = {
    state,
    dispatch,
    audioRef,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
