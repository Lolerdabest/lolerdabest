
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition } from 'react';
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
  const [finalAngle, setFinalAngle] = useState<number | null>(null);

  const { toast } = useToast();

  const handlePlay = () => {
    setIsSpinning(true);
    setFinalAngle(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await playRouletteAction(bet.id);
        
        const winningIndex = numbers.indexOf(res.winningNumber);
        const segmentAngle = 360 / numbers.length;
        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
        const baseAngle = winningIndex * segmentAngle + randomOffset;
        const totalAngle = 360 * 10 + baseAngle; // 10 full rotations + final position
        
        setFinalAngle(totalAngle);
        
        setTimeout(() => {
          setResult(res);
          setIsSpinning(false);
          toast({
            title: res.result === 'win' ? 'You Won!' : 'You Lost.',
            description: res.message,
            variant: res.result === 'win' ? 'default' : 'destructive'
          });
        }, 8000); // 8s for the animation to complete

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

  if (result && !isSpinning) {
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

  const segmentAngle = 360 / numbers.length;

  return (
    <Card className="max-w-2xl mx-auto border-primary/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">Your Roulette Bet</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6 flex flex-col items-center justify-center">
        
        <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Pointer */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-accent z-50"></div>
            
            {/* Outer Rim */}
            <div className="w-full h-full rounded-full bg-[#A0522D] border-8 border-[#8B4513] flex items-center justify-center shadow-inner">
                {/* Spinning Wheel */}
                <div 
                    className="relative w-[95%] h-[95%] rounded-full transition-transform duration-[8000ms] ease-out"
                    style={{ transform: finalAngle !== null ? `rotate(-${finalAngle}deg)` : 'rotate(0deg)' }}
                >
                     {/* Pockets */}
                    {numbers.map((n, i) => {
                       const angle = i * segmentAngle;
                       const color = numberColors[n];
                       return (
                         <div
                            key={n}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{
                                transform: `rotate(${angle}deg)`,
                                clipPath: `polygon(50% 50%, 0% 0%, 100% 0%)`,
                            }}
                         >
                           <div 
                                className={cn(
                                    "absolute w-full h-full",
                                    color === 'red' && 'bg-[#C00]',
                                    color === 'black' && 'bg-black',
                                    color === 'green' && 'bg-[#080]'
                                )}
                           >
                                <div 
                                    className="absolute w-full h-1/2 flex items-start justify-center pt-1" 
                                    style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                                >
                                    <span 
                                        className="text-white text-sm font-bold"
                                        style={{ transform: `rotate(-${angle + (segmentAngle/2)}deg)`}}
                                    >
                                        {n}
                                    </span>
                                </div>
                           </div>
                         </div>
                       )
                    })}
                </div>
                
                {/* Center Spinner */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#DAA520] rounded-full z-20 flex items-center justify-center border-4 border-[#B8860B] shadow-lg">
                    <div className="w-4 h-4 bg-[#8B4513] rounded-full"></div>
                </div>

                {/* Ball */}
                {!result && (
                    <div 
                        className={cn(
                            "absolute w-5 h-5 bg-slate-200 rounded-full top-[12px] left-1/2 -translate-x-1/2 z-30 shadow-md",
                            isSpinning && "animate-roulette-ball"
                        )}
                        style={{
                            animationDuration: isSpinning ? '2s' : '0s'
                        }}
                    />
                )}
                 <style jsx>{`
                    @keyframes roulette-ball {
                        0% { transform: rotate(0deg) translateY(-145px) rotate(0deg); }
                        100% { transform: rotate(360deg) translateY(-145px) rotate(-360deg); }
                    }
                    .animate-roulette-ball {
                        animation-name: roulette-ball;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                    }
                     @media (min-width: 768px) {
                        @keyframes roulette-ball {
                            0% { transform: rotate(0deg) translateY(-175px) rotate(0deg); }
                            100% { transform: rotate(360deg) translateY(-175px) rotate(-360deg); }
                        }
                    }
                `}</style>

            </div>
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
