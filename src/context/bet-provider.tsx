
'use client';

import type { Bet } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface BetContextType {
  bets: Bet[];
  addBet: (bet: Omit<Bet, 'id'> & { id?: string }) => void;
  removeBet: (betId: string) => void;
  clearBets: () => void;
  totalWager: number;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export const BetProvider = ({ children }: { children: React.ReactNode }) => {
  const [bets, setBets] = useState<Bet[]>([]);

  const addBet = useCallback((bet: Omit<Bet, 'id'> & { id?: string }) => {
    const newBet: Bet = {
      ...bet,
      id: bet.id || `${bet.game.replace(/\s/g, '-')}-${Date.now()}`,
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
