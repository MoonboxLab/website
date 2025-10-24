"use client";

import { createContext, useContext, ReactNode } from "react";

interface MusicContextType {
  isPrivacyModalOpen: boolean;
  setIsPrivacyModalOpen: (open: boolean) => void;
  selectedMusicForDownload: any;
  setSelectedMusicForDownload: (music: any) => void;
  downloadMusicZip: (musicItem?: any) => Promise<void>;
  fetchMusics: (currentEventId?: number) => Promise<void>;
  musics: any[];
}

const MusicPageContext = createContext<MusicContextType | undefined>(undefined);

export function useMusicPage() {
  const context = useContext(MusicPageContext);
  if (context === undefined) {
    throw new Error("useMusicPage must be used within a MusicPageProvider");
  }
  return context;
}

interface MusicPageProviderProps {
  children: ReactNode;
  value: MusicContextType;
}

export function MusicPageProvider({ children, value }: MusicPageProviderProps) {
  return (
    <MusicPageContext.Provider value={value}>
      {children}
    </MusicPageContext.Provider>
  );
}
