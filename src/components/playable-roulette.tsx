
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

// European Roulette Wheel Order
const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const numberColors: { [key: number]: string } = {
    0: 'bg-green-600',
    1: 'bg-red-600', 2: 'bg-black', 3: 'bg-red-600', 4: 'bg-black', 5: 'bg-red-600', 6: 'bg-black', 7: 'bg-red-600', 8: 'bg-black', 9: 'bg-red-600', 10: 'bg-black',
    11: 'bg-black', 12: 'bg-red-600', 13: 'bg-black', 14: 'bg-red-600', 15: 'bg-black', 16: 'bg-red-600', 17: 'bg-black', 18: 'bg-red-600', 19: 'bg-red-600',
    20: 'bg-black', 21: 'bg-red-600', 22: 'bg-black', 23: 'bg-red-600', 24: 'bg-black', 25: 'bg-red-600', 26: 'bg-black', 27: 'bg-red-600', 28: 'bg-black',
    29: 'bg-black', 30: 'bg-red-600', 31: 'bg-black', 32: 'bg-red-600', 33: 'bg-black', 34: 'bg-red-600', 35: 'bg-black', 36: 'bg-red-600',
};

const segmentAngle = 360 / numbers.length;

export function PlayableRoulette({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss'; winningNumber: number } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelStyle, setWheelStyle] = useState({});
  const [ballStyle, setBallStyle] = useState({});

  const { toast } = useToast();

  const handlePlay = () => {
    if (isSpinning || result) return;

    setIsSpinning(true);
    setWheelStyle({}); // Clear previous animation styles
    setBallStyle({});
    
    startTransition(async () => {
      try {
        const res = await playRouletteAction(bet.id);
        
        const winningIndex = numbers.indexOf(res.winningNumber);
        // Calculate the final angle for the wheel to stop at the winning number
        const targetAngle = 360 - (winningIndex * segmentAngle);
        
        // Random additional spins for visual variety
        const randomSpins = 8 + Math.random() * 4; 
        const finalWheelAngle = (randomSpins * 360) + targetAngle;
        
        // Make the ball spin faster and in the opposite direction
        const finalBallAngle = -((randomSpins + 2) * 360);

        // Apply animations
        setWheelStyle({
          transform: `rotate(${finalWheelAngle}deg)`,
          transition: 'transform 8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        });
        
        setBallStyle({
            transform: `rotate(${finalBallAngle}deg)`,
            transition: 'transform 7.5s cubic-bezier(0.3, 0.7, 0.4, 1)',
        });
        
        // Wait for the animation to complete before showing the result
        setTimeout(() => {
          setIsSpinning(false);
          setResult(res);
          toast({
            title: res.result === 'win' ? 'You Won!' : 'You Lost.',
            description: res.message,
            variant: res.result === 'win' ? 'default' : 'destructive'
          });
        }, 8500); // Must be slightly longer than animation duration

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
      <CardContent className="text-center space-y-6 flex flex-col items-center justify-center p-4 sm:p-6">
        
        <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Static Outer Rim & Ball Track */}
            <div className="absolute w-full h-full rounded-full bg-[#804A25] border-8 border-[#C08A53] shadow-2xl"></div>
            <div className="absolute w-[85%] h-[85%] rounded-full border-4 border-gray-500/30 bg-gray-800/20"></div>

            {/* The Spinning Wheel */}
            <div 
                className="absolute w-[80%] h-[80%] rounded-full"
                style={wheelStyle}
            >
                {numbers.map((n, i) => {
                    const angle = i * segmentAngle;
                    return (
                        <div
                            key={n}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            {/* The pocket slice */}
                            <div
                                className={cn("absolute w-full h-full", numberColors[n])}
                                style={{ clipPath: `polygon(50% 50%, 41.5% 0, 58.5% 0)` }}
                            />
                             {/* The number */}
                             <div 
                                className="absolute w-full h-1/2 flex justify-center text-white text-base font-bold"
                            >
                                <span style={{ transform: `translateY(15px) rotate(${-angle}deg)` }}>
                                    {n}
                                </span>
                            </div>
                        </div>
                    )
                })}
                 {/* Center Spinner */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-4 border-yellow-700 shadow-lg"></div>
            </div>

            {/* Ball Animation Container */}
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={ballStyle}
            >
                {/* The Ball */}
                <div 
                    className="absolute top-[5.5%] left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-100 rounded-full shadow-md"
                />
            </div>
            
             {/* Static Pointer */}
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-accent z-40"></div>
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
