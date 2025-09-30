

export type BetStatus = 'pending' | 'active' | 'completed';

export interface Bet {
  id: string; 
  game: string; 
  details: string; 
  wager: number;
  multiplier: number;
  payout: number;
  minecraftUsername: string;
  discordTag: string;
  status: BetStatus;
  createdAt: string; // ISO 8601 date string
  result?: 'win' | 'loss';
}
