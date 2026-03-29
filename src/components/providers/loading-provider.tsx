"use client";
import { createContext, useCallback, useContext, useState } from "react";

type LoadingCtx = { isLoading: boolean; start: () => void; stop: () => void };

const LoadingContext = createContext<LoadingCtx>({
  isLoading: false,
  start: () => {},
  stop: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);

  return (
    <LoadingContext.Provider value={{ isLoading, start, stop }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
