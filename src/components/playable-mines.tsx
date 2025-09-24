
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition } from 'react';
import { cashOutMinesAction, playMinesAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Bomb, CheckCircle, Diamond, Gem, Star, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tile = {
  state: 'hidden' | 'revealed';
  isMine: boolean;
};

const createInitialGrid = (): Tile[] => {
  return Array(25).fill(null).map(() => ({
    state: 'hidden',
    isMine: false,
  }));
};

export function PlayableMines({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [grid, setGrid] = useState<Tile[]>(createInitialGrid());
  const [gameOver, setGameOver] = useState<'win' | 'loss' | null>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [finalPayout, setFinalPayout] = useState(0);
  const { toast } = useToast();
  
  const mineCountMatch = bet.details.match(/(\d+) mines/);
  const mineCount = mineCountMatch ? parseInt(mineCountMatch[1], 10) : 3;

  const handleTileClick = (index: number) => {
    if (gameOver || grid[index].state === 'revealed') return;

    startTransition(async () => {
      try {
        const res = await playMinesAction(bet.id, index);
        
        const newGrid = [...grid];
        if (res.mineHit) {
          newGrid[index] = { state: 'revealed', isMine: true };
          setGrid(newGrid);
          setGameOver('loss');
          toast({ title: 'Boom!', description: res.message, variant: 'destructive'});
        } else {
          newGrid[index] = { state: 'revealed', isMine: false };
          setGrid(newGrid);
          setMultiplier(res.newMultiplier);
          toast({ title: 'Safe!', description: `Multiplier is now ${res.newMultiplier}x` });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Could not play. Please refresh and try again.', variant: 'destructive'});
      }
    });
  };

  const handleCashOut = () => {
     startTransition(async () => {
        try {
            const res = await cashOutMinesAction(bet.id);
            setFinalPayout(res.payout);
            setGameOver('win');
            toast({ title: 'Cashed Out!', description: res.message });
        } catch (error) {
             toast({ title: 'Error', description: 'Could not cash out. Please try again.', variant: 'destructive'});
        }
     });
  };

  if (gameOver) {
      return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center">{gameOver === 'win' ? 'You Won!' : 'Game Over'}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                 <Alert variant={gameOver === 'win' ? 'default' : 'destructive'}>
                    {gameOver === 'win' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>{gameOver === 'win' ? 'Congratulations!' : 'You Hit a Mine!'}</AlertTitle>
                    <AlertDescription>
                        {gameOver === 'win' ? `You cashed out and won $${finalPayout.toFixed(2)}!` : 'Better luck next time.'}
                    </AlertDescription>
                </Alert>
                <Button onClick={() => window.location.href = '/'} className="w-full mt-4">Play Again</Button>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="max-w-md mx-auto border-primary/50">
      <CardHeader>
        <CardTitle className="text-center">Mines</CardTitle>
        <p className="text-center text-muted-foreground">{mineCount} mines are hidden. Good luck.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
            {grid.map((tile, index) => (
                <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    disabled={isPending || tile.state === 'revealed'}
                    className={cn(
                        "aspect-square rounded-md flex items-center justify-center transition-all",
                        "disabled:cursor-not-allowed",
                        tile.state === 'hidden' && "bg-muted hover:bg-muted/80",
                        tile.state === 'revealed' && !tile.isMine && "bg-primary/20",
                        tile.state === 'revealed' && tile.isMine && "bg-destructive",
                    )}
                >
                    {tile.state === 'revealed' && (tile.isMine ? <Bomb className="w-6 h-6 text-white" /> : <Gem className="w-6 h-6 text-primary" />)}
                </button>
            ))}
        </div>
        <div className="flex items-center justify-between p-4 rounded-md bg-muted">
            <div>
                <p className="text-sm text-muted-foreground">Current Multiplier</p>
                <p className="text-2xl font-bold text-primary">{multiplier.toFixed(2)}x</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Current Payout</p>
                <p className="text-2xl font-bold text-primary">${(bet.wager * multiplier).toFixed(2)}</p>
            </div>
        </div>
        <Button onClick={handleCashOut} disabled={isPending || multiplier <= 1} className="w-full py-6 text-lg font-bold">
            Cash Out
        </Button>
      </CardContent>
    </Card>
  );
}
