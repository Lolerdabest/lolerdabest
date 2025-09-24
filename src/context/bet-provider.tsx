
'use client';

import type { Bet } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

// This interface is for the individual game bets before they are submitted.
// The main Bet type in types.ts is for the confirmed bet record.
export interface TempBet {
  id: string; 
  game: string; 
  details: string; 
  wager: number;
  multiplier: number;
  payout: number;
}


interface BetContextType {
  bets: TempBet[];
  addBet: (bet: Omit<TempBet, 'id'>) => void;
  removeBet: (betId: string) => void;
  clearBets: () => void;
  totalWager: number;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export const BetProvider = ({ children }: { children: React.ReactNode }) => {
  const [bets, setBets] = useState<TempBet[]>([]);

  const addBet = useCallback((bet: Omit<TempBet, 'id'>) => {
    const newBet: TempBet = {
      ...bet,
      id: `${bet.game.replace(/\s/g, '-')}-${Date.now()}`,
    };
    setBets((prevBets) => [...prevBets, newBet]);
  }, []);

  const removeBet = useCallback((betId: string) => {
    setBets((prevBets) => prevBets.filter((bet) => bet.id !== betId));
  }, []);
  
  const clearBets = useCallback(() => {
    setBets([]);
  }, []);

  const totalWager = useMemo(() => {
    return bets.reduce((total, bet) => total + bet.wager, 0);
  }, [bets]);

  return (
    <BetContext.Provider
      value={{ bets, addBet, removeBet, clearBets, totalWager }}
    >
      {children}
    </BetContext.Provider>
  );
};

export const useBet = () => {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBet must be used within a BetProvider');
  }
  return context;
};
