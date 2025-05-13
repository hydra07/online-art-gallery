'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ExhibitionStateContextType {
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  setIsStarted: (started: boolean) => void;
}

const ExhibitionStateContext = createContext<ExhibitionStateContextType | null>(null);

export function ExhibitionStateProvider({ 
  children,
  onExit
}: { 
  children: ReactNode;
  onExit: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <ExhibitionStateContext.Provider value={{ 
      isPaused, 
      setIsPaused,
      setIsStarted: onExit
    }}>
      {children}
    </ExhibitionStateContext.Provider>
  );
}

export function useExhibitionState() {
  const context = useContext(ExhibitionStateContext);
  if (!context) {
    throw new Error('useExhibitionState must be used within ExhibitionStateProvider');
  }
  return context;
}