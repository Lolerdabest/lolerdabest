
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition, useMemo } from 'react';
import { cashOutDragonTowersAction, playDragonTowersAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Gem, Skull, CheckCircle, XCircle, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

type TileState = 'hidden' | 'safe' | 'skull';

const TOWER_LEVELS = 8;
const TILES_PER_LEVEL = 5;

const createInitialTower = (): TileState[][] => {
  return Array(TOWER_LEVELS).fill(null).map(() => Array(TILES_PER_LEVEL).fill('hidden'));
};

export function PlayableDragonTowers({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [tower, setTower] = useState<TileState[][]>(createInitialTower());
  const [gameOver, setGameOver] = useState<'win' | 'loss' | null>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [finalPayout, setFinalPayout] = useState(0);
  const [currentRow, setCurrentRow] = useState(TOWER_LEVELS - 1);
  const { toast } = useToast();

  const difficulty = useMemo(() => {
    const match = bet.details.match(/Difficulty: (\w+)/);
    return match ? match[1] : 'easy';
  }, [bet.details]);

  const handleTileClick = (rowIndex: number, tileIndex: number) => {
    if (gameOver || isPending || rowIndex !== currentRow) return;

    startTransition(async () => {
      try {
        const res = await playDragonTowersAction(bet.id, rowIndex, tileIndex);
        
        const newTower = tower.map(row => [...row]);
        if (res.result === 'loss') {
          newTower[rowIndex][tileIndex] = 'skull';
          setTower(newTower);
          setGameOver('loss');
          toast({ title: 'Boom!', description: res.message, variant: 'destructive'});
        } else {
          newTower[rowIndex][tileIndex] = 'safe';
          setTower(newTower);
          setMultiplier(res.newMultiplier);
          setCurrentRow(currentRow - 1);
          toast({ title: 'Safe!', description: `Multiplier is now ${res.newMultiplier}x. Advanced to level ${TOWER_LEVELS - (currentRow - 1)}.` });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Could not play. Please refresh and try again.', variant: 'destructive'});
      }
    });
  };

  const handleCashOut = () => {
     startTransition(async () => {
        try {
            const res = await cashOutDragonTowersAction(bet.id);
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
                    <AlertTitle>{gameOver === 'win' ? 'Congratulations!' : 'You Hit a Skull!'}</AlertTitle>
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
        <CardTitle className="text-center">Dragon Towers</CardTitle>
        <p className="text-center text-muted-foreground">Climb the tower. Current level: {TOWER_LEVELS - currentRow}.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col-reverse gap-2 bg-background p-2 rounded-md">
            {tower.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-2">
                {row.map((tile, tileIndex) => (
                    <button
                        key={tileIndex}
                        onClick={() => handleTileClick(rowIndex, tileIndex)}
                        disabled={isPending || gameOver || rowIndex !== currentRow}
                        className={cn(
                            "aspect-square rounded-md flex items-center justify-center transition-all border-2",
                            "disabled:cursor-not-allowed",
                             rowIndex > currentRow && "border-transparent",
                             rowIndex === currentRow ? "border-primary/50 animate-pulse" : "border-transparent",
                             tile === 'hidden' && "bg-muted hover:bg-muted/80",
                             tile === 'safe' && "bg-primary/20 border-primary",
                             tile === 'skull' && "bg-destructive border-destructive-foreground",
                        )}
                    >
                        {tile === 'safe' && <Gem className="w-6 h-6 text-primary" />}
                        {tile === 'skull' && <Skull className="w-6 h-6 text-white" />}
                        {tile === 'hidden' && rowIndex === currentRow && <ShieldQuestion className="w-6 h-6 text-primary/50"/>}
                    </button>
                ))}
                </div>
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
        <Button onClick={handleCashOut} disabled={isPending || multiplier <= 1 || gameOver} className="w-full py-6 text-lg font-bold">
            Cash Out
        </Button>
      </CardContent>
    </Card>
  );
}
