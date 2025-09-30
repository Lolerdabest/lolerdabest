
'use client';

import {
  CoinflipIcon,
  MinesIcon,
  RouletteIcon,
  TowersIcon,
} from './game-icons';
import { cn } from '@/lib/utils';
import { useBet } from '@/context/bet-provider';

const games = [
  { id: 'roulette', name: 'Roulette', icon: RouletteIcon },
  { id: 'coinflip', name: 'Coinflip', icon: CoinflipIcon },
  { id: 'mines', name: 'Mines', icon: MinesIcon },
  { id: 'towers', name: 'Towers', icon: TowersIcon },
];

export function GameSelector() {
  const { bets } = useBet();
  // Get the game name from the first bet in the slip, if any
  const currentGame = bets.length > 0 ? bets[0].game.toLowerCase().replace(' ', '') : 'roulette';
  const currentGameId = currentGame.includes('dragontowers') ? 'towers' : currentGame;

  return (
    <div className="relative mb-8">
      <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
        {games.map((game) => (
          <a
            key={game.id}
            href={`#${game.id}`}
            className={cn(
              'flex flex-col items-center justify-center gap-2 flex-shrink-0 w-28 h-28 rounded-lg transition-all duration-300',
              'bg-card/50 border-2 border-transparent',
              'hover:bg-primary/20 hover:border-primary',
              {
                'bg-primary/20 border-primary text-primary':
                  game.id === currentGameId,
                'text-muted-foreground': game.id !== currentGameId,
              }
            )}
          >
            <game.icon className="h-8 w-8" />
            <span className="text-sm font-bold">{game.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
