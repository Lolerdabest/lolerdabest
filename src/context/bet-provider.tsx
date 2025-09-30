
'use client';

import type { Bet } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// This interface is for the individual game bets before they are submitted.
// The main Bet type in types.ts is for the confirmed bet record.
export interface TempBet {
  id: string; 
  game: string; 
  details: string; 
  wager: number;
  multiplier: number;
  payout: any; // Can be string or number depending on game
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
  const { toast } = useToast();

  const addBet = useCallback((bet: Omit<TempBet, 'id'>) => {
    const newBet: TempBet = {
      ...bet,
      id: `${bet.game.replace(/\s/g, '-')}-${Date.now()}-${Math.random()}`,
    };
    
    setBets((prevBets) => {
      // For roulette, allow multiple bets. For other games, replace.
      if (newBet.game === 'Roulette') {
        // If the slip is empty or already contains roulette bets, add it.
        if (prevBets.length === 0 || prevBets[0].game === 'Roulette') {
            return [...prevBets, newBet];
        } else {
            // If other game type is present, clear and add roulette bet.
             toast({
                title: "Bet Slip Cleared",
                description: "You cannot mix different game types. Your previous bet was removed.",
             });
             return [newBet];
        }
      }

      // For single-bet games like Coinflip, Mines, etc.
      if (prevBets.length === 0 || prevBets[0].game === newBet.game) {
        if(['Coinflip', 'Mines', 'Dragon Towers'].includes(newBet.game)) {
            if(prevBets.length > 0) {
                 toast({
                     title: "Bet Slip Updated",
                     description: `${newBet.game} bets can't be combined. Your previous bet was replaced.`,
                 });
            }
            return [newBet];
         }
         return [...prevBets, newBet];
      }
      
      // If different game type, clear the slip and add the new one
      toast({
        title: "Bet Slip Cleared",
        description: "You cannot mix different game types. Your previous bets were removed.",
      });
      return [newBet];
    });
  }, [toast]);

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
