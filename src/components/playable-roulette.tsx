
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
const numberColors: { [key: number]: 'red' | 'black' | 'green' } = {
  0: 'green', 1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black', 9: 'red', 10: 'black', 11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black', 21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red', 31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red',
};

export function PlayableRoulette({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss'; winningNumber: number } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalAngle, setFinalAngle] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const { toast } = useToast();

  const handlePlay = () => {
    if (isSpinning || showResult) return;

    setIsSpinning(true);
    setShowResult(false);
    
    startTransition(async () => {
      try {
        const res = await playRouletteAction(bet.id);
        
        const winningIndex = numbers.indexOf(res.winningNumber);
        const segmentAngle = 360 / numbers.length;
        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.9;
        const targetAngle = winningIndex * segmentAngle + randomOffset;
        const totalAngle = (finalAngle % 360) + (360 * 10) + (360 - (finalAngle % 360)) - targetAngle;

        setFinalAngle(totalAngle);
        
        setTimeout(() => {
          setResult(res);
          setIsSpinning(false);
          setShowResult(true);
          toast({
            title: res.result === 'win' ? 'You Won!' : 'You Lost.',
            description: res.message,
            variant: res.result === 'win' ? 'default' : 'destructive'
          });
        }, 8000); 

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
  
  if (showResult && result) {
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

  const segmentAngle = 360 / numbers.length;

  return (
    <Card className="max-w-2xl mx-auto border-primary/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">Your Roulette Bet</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6 flex flex-col items-center justify-center">
        
        <div className="relative w-80 h-80 md:w-96 md:h-96">
            <div className="absolute w-full h-full border-[1.5rem] border-[#8B4513] rounded-full z-10 shadow-inner"></div>
            <div 
                className={cn(
                    "relative w-full h-full rounded-full transition-transform duration-[8000ms] ease-out",
                )}
                style={{ transform: `rotate(-${finalAngle}deg)` }}
            >
                {numbers.map((n, i) => {
                    const angle = i * segmentAngle;
                    const color = numberColors[n];
                    return (
                        <div
                            key={n}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            <div
                                style={{
                                    clipPath: `polygon(50% 50%, 0% 0%, ${Math.tan(segmentAngle * Math.PI / 180) * 50}% 0, 50% 50%)`,
                                    transformOrigin: '50% 50%',
                                }}
                                className={cn(
                                    "absolute w-full h-full",
                                    color === 'red' && 'bg-[#C00]',
                                    color === 'black' && 'bg-black',
                                    color === 'green' && 'bg-[#080]'
                                )}
                            />
                            <div 
                                className="absolute w-full h-1/2 flex items-start justify-center pt-2 text-white text-sm font-bold"
                                style={{
                                    transform: `rotate(${segmentAngle / 2}deg) translateY(-0.5rem)`,
                                }}
                            >
                                <span style={{ transform: `rotate(-${angle + segmentAngle / 2}deg)`}}>
                                    {n}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#DAA520] rounded-full z-20 flex items-center justify-center border-4 border-[#B8860B] shadow-lg">
                <div className="w-6 h-6 bg-[#8B4513] rounded-full"></div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none">
                 <div className={cn(
                    "absolute w-4 h-4 bg-slate-200 rounded-full shadow-md transition-transform duration-[7500ms] ease-out",
                    isSpinning ? "animate-roulette-ball-spin" : ""
                    )}
                    style={{
                        transform: isSpinning ? `rotate(${finalAngle}deg)`: `rotate(0deg)`,
                        animationName: isSpinning ? 'roulette-ball-spin' : 'none'
                    }}
                ></div>
            </div>
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-accent z-40"></div>

             <style jsx>{`
                @keyframes roulette-ball-spin {
                    0% {
                        transform: rotate(0deg) translateY(-145px) rotate(0deg) scale(1);
                    }
                    90% {
                        transform: rotate(${finalAngle + 360}deg) translateY(-145px) rotate(-${finalAngle + 360}deg) scale(1.1);
                    }
                    100% {
                         transform: rotate(${finalAngle}deg) translateY(-110px) rotate(-${finalAngle}deg) scale(1);
                    }
                }
                 @media (min-width: 768px) {
                    @keyframes roulette-ball-spin {
                        0% {
                            transform: rotate(0deg) translateY(-175px) rotate(0deg) scale(1);
                        }
                        90% {
                             transform: rotate(${finalAngle + 360}deg) translateY(-175px) rotate(-${finalAngle + 360}deg) scale(1.1);
                        }
                        100% {
                             transform: rotate(${finalAngle}deg) translateY(-135px) rotate(-${finalAngle}deg) scale(1);
                        }
                    }
                }
            `}</style>
        </div>


        <div className="bg-muted p-4 rounded-lg w-full max-w-md">
            <p className="text-muted-foreground">Your Wager</p>
            <p className="text-xl font-bold text-primary">${bet.wager.toFixed(2)}</p>
            <Separator className="my-2 bg-primary/20" />
            <p className="text-muted-foreground">Your Bets</p>
            <p className="font-semibold">{bet.details.replace(/\\n/g, ', ')}</p>
        </div>

        <Button onClick={handlePlay} disabled={isPending || isSpinning} className="w-full max-w-md py-6 text-lg">
          {isPending || isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">The outcome is determined by the server and cannot be manipulated.</p>
      </CardFooter>
    </Card>
  );
}

