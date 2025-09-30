
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition, useEffect } from 'react';
import { playRouletteAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';


const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const numberColors: { [key: number]: string } = {
  0: '#008000', // Green
  1: '#C00000', 2: '#000000', 3: '#C00000', 4: '#000000', 5: '#C00000', 6: '#000000', 7: '#C00000', 8: '#000000', 9: '#C00000', 10: '#000000',
  11: '#000000', 12: '#C00000', 13: '#000000', 14: '#C00000', 15: '#000000', 16: '#C00000', 17: '#000000', 18: '#C00000', 19: '#C00000',
  20: '#000000', 21: '#C00000', 22: '#000000', 23: '#C00000', 24: '#000000', 25: '#C00000', 26: '#000000', 27: '#C00000', 28: '#000000',
  29: '#000000', 30: '#C00000', 31: '#000000', 32: '#C00000', 33: '#000000', 34: '#C00000', 35: '#000000', 36: '#C00000',
};

export function PlayableRoulette({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss'; winningNumber: number } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const { toast } = useToast();

  const handlePlay = () => {
    if (isSpinning || result) return;

    setIsSpinning(true);
    
    startTransition(async () => {
      try {
        const res = await playRouletteAction(bet.id);
        
        // --- Animation Logic ---
        const winningIndex = numbers.indexOf(res.winningNumber);
        const segmentAngle = 360 / numbers.length;
        // Calculate the final angle for the wheel to stop at the winning number
        const targetAngle = 360 - (winningIndex * segmentAngle);
        const randomSpins = 5 + Math.floor(Math.random() * 5);
        const finalWheelAngle = (randomSpins * 360) + targetAngle;

        // Ball animation - it spins faster and longer
        const finalBallAngle = finalWheelAngle + (3 * 360);
        
        // Start animations
        setWheelRotation(finalWheelAngle);
        setBallRotation(finalBallAngle);
        
        // Wait for the animation to finish
        setTimeout(() => {
          setIsSpinning(false);
          setResult(res);
          toast({
            title: res.result === 'win' ? 'You Won!' : 'You Lost.',
            description: res.message,
            variant: res.result === 'win' ? 'default' : 'destructive'
          });
        }, 8000); // 8-second animation duration

      } catch (error) {
        setIsSpinning(false);
        toast({
          title: 'Error',
          description: 'Could not play the game. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const segmentAngle = 360 / numbers.length;

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Alert variant={result.result === 'win' ? 'default' : 'destructive'} className="max-w-md mx-auto">
            {result.result === 'win' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{result.result === 'win' ? 'Congratulations!' : 'Better Luck Next Time!'}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.href = '/'} className="w-full max-w-md mt-4">Play Again</Button>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-primary/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">Your Roulette Bet</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6 flex flex-col items-center justify-center">
        
        <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Outer Rim */}
            <div className="absolute w-full h-full rounded-full bg-[#8B4513] border-4 border-[#DAA520] shadow-2xl"></div>
            {/* Ball Track */}
            <div className="absolute top-[5%] left-[5%] w-[90%] h-[90%] rounded-full border-4 border-gray-500/50"></div>

            {/* The Spinning Wheel */}
            <div 
                className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full transition-transform duration-[8000ms] ease-out"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
                {numbers.map((n, i) => {
                    const angle = i * segmentAngle;
                    return (
                        <div
                            key={n}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            <div
                                style={{
                                    backgroundColor: numberColors[n],
                                    clipPath: `polygon(50% 50%, ${50 - Math.tan(segmentAngle / 2 * Math.PI / 180) * 50 - 5}% 0, ${50 + Math.tan(segmentAngle / 2 * Math.PI / 180) * 50 + 5}% 0)`,
                                }}
                                className="absolute w-full h-full"
                            />
                             <div 
                                className="absolute w-full h-1/2 flex justify-center text-white text-base font-bold"
                                style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                            >
                                <span style={{ transform: `translateY(10px) rotate(${-angle - (segmentAngle / 2)}deg)` }}>
                                    {n}
                                </span>
                            </div>
                        </div>
                    )
                })}
                 {/* Center Spinner */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#DAA520] rounded-full border-4 border-[#B8860B] shadow-lg"></div>
            </div>

             {/* Ball */}
            <div
                className="absolute top-0 left-0 w-full h-full transition-transform duration-[7500ms] ease-out"
                style={{ transform: `rotate(${ballRotation}deg)`}}
            >
                <div 
                    className="absolute top-[8%] left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-200 rounded-full shadow-md"
                />
            </div>
            
             {/* Static Pointer */}
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-accent z-40"></div>
        </div>

        <div className="bg-muted p-4 rounded-lg w-full max-w-md">
            <p className="text-muted-foreground">Your Wager</p>
            <p className="text-xl font-bold text-primary">${bet.wager.toFixed(2)}</p>
            <Separator className="my-2 bg-primary/20" />
            <p className="text-muted-foreground">Your Bets</p>
            <p className="font-semibold">{bet.details.replace(/\\n/g, ', ')}</p>
        </div>

        <Button onClick={handlePlay} disabled={isPending || isSpinning} className="w-full max-w-md py-6 text-lg">
          {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">The outcome is determined by the server and cannot be manipulated.</p>
      </CardFooter>
    </Card>
  );
}

    