
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useEffect, useState, useTransition } from 'react';
import { playRouletteAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';


const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const numberColors: { [key: number]: 'red' | 'black' | 'green' } = {
  0: 'green', 1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black', 9: 'red', 10: 'black', 11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black', 21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red', 31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red',
};

const getNumberColorClass = (num: number) => {
    const color = numberColors[num];
    if (color === 'red') return 'bg-red-700 text-white';
    if (color === 'black') return 'bg-gray-800 text-white';
    return 'bg-green-600 text-white';
}

export function PlayableRoulette({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss'; winningNumber: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [finalAngle, setFinalAngle] = useState(0);
  const { toast } = useToast();

  const handlePlay = () => {
    setSpinning(true);
    startTransition(async () => {
      try {
        const res = await playRouletteAction(bet.id);
        
        const winningIndex = numbers.indexOf(res.winningNumber);
        const segmentAngle = 360 / numbers.length;
        // Add random offset within the segment and multiple rotations
        const angle = (360 * 5) + (winningIndex * segmentAngle) + (Math.random() * segmentAngle * 0.8 - segmentAngle * 0.4);
        setFinalAngle(angle);

        setTimeout(() => {
            setResult(res);
            toast({
                title: res.result === 'win' ? 'You Won!' : 'You Lost.',
                description: res.message,
                variant: res.result === 'win' ? 'default' : 'destructive'
            });
            setSpinning(false);
        }, 5000); // Wait for animation to finish

      } catch (error) {
        setSpinning(false);
        toast({
          title: 'Error',
          description: 'Could not play the game. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  if (result) {
    return (
       <Alert variant={result.result === 'win' ? 'default' : 'destructive'} className="max-w-md mx-auto">
        {result.result === 'win' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <AlertTitle>{result.result === 'win' ? 'Congratulations!' : 'Better Luck Next Time!'}</AlertTitle>
        <AlertDescription>
          {result.message}
          <Button onClick={() => window.location.reload()} className="w-full mt-4">Play Again</Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-primary/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">Your Roulette Bet</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="relative w-80 h-80 mx-auto mb-8">
            <div 
                className="absolute w-full h-full rounded-full border-8 border-primary/50 transition-transform duration-[5000ms] ease-out"
                style={{
                    transform: `rotate(${finalAngle}deg)`,
                    background: `conic-gradient(from 0deg, ${numbers.map((n, i) => `${numberColors[n]} ${i * (360/numbers.length)}deg ${(i+1) * (360/numbers.length)}deg`).join(', ')})`
                }}
            >
               {numbers.map((n, i) => {
                   const angle = i * (360 / numbers.length);
                   return <div key={i} className="absolute w-1/2 h-1/2 top-0 left-1/2 origin-[0%_100%]" style={{transform: `rotate(${angle}deg)`}}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white font-bold text-sm" style={{transform: `translateX(-50%) rotate(90deg)`}}>{n}</span></div>
               })}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-primary z-10"></div>
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-16 border-t-accent z-20" style={{borderTopWidth: '16px'}}></div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
            <p className="text-muted-foreground">Your Wager</p>
            <p className="text-xl font-bold text-primary">${bet.wager.toFixed(2)}</p>
            <Separator className="my-2" />
            <p className="text-muted-foreground">Your Bets</p>
            <p className="font-semibold">{bet.details.replace(/\\n/g, ', ')}</p>
        </div>

        <Button onClick={handlePlay} disabled={isPending || spinning} className="w-full py-6 text-lg">
          {isPending || spinning ? 'Spinning...' : 'Spin the Wheel!'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">The outcome is determined by the server and cannot be manipulated.</p>
      </CardFooter>
    </Card>
  );
}
