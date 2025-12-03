"use client";

import React, { createContext, useContext, useCallback, useState } from "react";

interface NftBalanceContextType {
  refreshTrigger: number;
  refreshNftBalance: () => void;
}

const NftBalanceContext = createContext<NftBalanceContextType | undefined>(
  undefined,
);

export function NftBalanceProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshNftBalance = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <NftBalanceContext.Provider value={{ refreshTrigger, refreshNftBalance }}>
      {children}
    </NftBalanceContext.Provider>
  );
}

export function useNftBalanceRefresh() {
  const context = useContext(NftBalanceContext);
  if (!context) {
    throw new Error(
      "useNftBalanceRefresh must be used within NftBalanceProvider",
    );
  }
  return context;
}

