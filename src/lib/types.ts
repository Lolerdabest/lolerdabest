
export interface Bet {
  id: string; // e.g., 'dice-roll-1'
  game: string; // e.g., 'Dice Roll'
  details: string; // e.g., 'Roll Over 50.5'
  wager: number;
  multiplier: number;
  payout: number;
}
