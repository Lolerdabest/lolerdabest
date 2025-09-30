
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


export function PlayableRoulette({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss'; winningNumber: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [ballAngle, setBallAngle] = useState(0);
  const [wheelAngle, setWheelAngle] = useState(0);

  const { toast } = useToast();

  const handlePlay = () => {
    setSpinning(true);
    // Reset angles and start a new spin
    const currentWheelAngle = wheelAngle % 360;
    const currentBallAngle = ballAngle % 360;
    
    // Add multiple rotations for visual effect
    setWheelAngle(currentWheelAngle + 360 * 2); 
    setBallAngle(currentBallAngle - 360 * 10); 
    
    startTransition(async () => {
      try {
        const res = await playRouletteAction(bet.id);
        
        const winningIndex = numbers.indexOf(res.winningNumber);
        const segmentAngle = 360 / numbers.length;
        
        // Calculate the final angle for the ball to land on the winning number
        const finalAngle = (ballAngle - (ballAngle % (360 * 2))) - (winningIndex * segmentAngle) - (segmentAngle / 2);

        // This timeout lets the initial spin happen before we 'land' the ball
        setTimeout(() => {
          setBallAngle(finalAngle);

          // And after the ball lands, show the result
          setTimeout(() => {
              setResult(res);
              toast({
                  title: res.result === 'win' ? 'You Won!' : 'You Lost.',
                  description: res.message,
                  variant: res.result === 'win' ? 'default' : 'destructive'
              });
              setSpinning(false);
          }, 4000); // Wait for ball landing animation to finish

        }, 2000); // Start landing sequence after 2s of fast spinning

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

  const segmentAngle = 360 / numbers.length;

  return (
    <Card className="max-w-2xl mx-auto border-primary/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">Your Roulette Bet</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6 flex flex-col items-center justify-center">

        <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Outer Rim */}
            <div className="w-full h-full rounded-full bg-yellow-900 border-[10px] border-yellow-700 shadow-inner flex items-center justify-center">
                 {/* Inner Wheel */}
                <div className="relative w-[85%] h-[85%] rounded-full bg-green-900/50" 
                     style={{ 
                         transform: `rotate(${wheelAngle}deg)`, 
                         transition: spinning ? `transform 8s cubic-bezier(0.33, 1, 0.68, 1)` : 'none' 
                     }}
                >
                    {/* Number Pockets */}
                    {numbers.map((n, i) => {
                       const angle = i * segmentAngle;
                       const color = numberColors[n];
                       return (
                         <div key={n} className="absolute w-full h-full" style={{ transform: `rotate(${angle}deg)`}}>
                           <div 
                                className={cn(
                                    "absolute w-[15%] h-1/2 left-1/2 -top-0 origin-bottom border-x border-x-yellow-600/50",
                                    "flex items-start justify-center pt-1",
                                    color === 'red' && 'bg-red-800',
                                    color === 'black' && 'bg-black',
                                    color === 'green' && 'bg-green-700'
                                )}
                                style={{transform: 'translateX(-50%)'}}
                           >
                              <span className="text-white text-sm font-bold" style={{transform: `rotate(90deg)`}}>{n}</span>
                           </div>
                         </div>
                       )
                    })}

                    {/* Center Spinner */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-700 rounded-full z-20 flex items-center justify-center border-4 border-yellow-600 shadow-lg">
                        <div className="w-4 h-4 bg-yellow-900 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Ball */}
            <div className="absolute w-full h-full top-0 left-0" style={{
                transform: `rotate(${ballAngle}deg)`,
                transition: spinning ? `transform 6s cubic-bezier(0.1, 0.5, 0.4, 1.0)` : 'none'
              }}>
                <div className="absolute w-5 h-5 bg-slate-200 rounded-full top-[18px] left-1/2 -translate-x-1/2 z-30 shadow-md" />
            </div>

            {/* Pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-16 border-t-accent z-40" style={{borderTopWidth: '16px'}}></div>
        </div>

        <div className="bg-muted p-4 rounded-lg w-full max-w-md">
            <p className="text-muted-foreground">Your Wager</p>
            <p className="text-xl font-bold text-primary">${bet.wager.toFixed(2)}</p>
            <Separator className="my-2 bg-primary/20" />
            <p className="text-muted-foreground">Your Bets</p>
            <p className="font-semibold">{bet.details.replace(/\\n/g, ', ')}</p>
        </div>

        <Button onClick={handlePlay} disabled={isPending || spinning} className="w-full max-w-md py-6 text-lg">
          {isPending || spinning ? 'Spinning...' : 'Spin the Wheel!'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">The outcome is determined by the server and cannot be manipulated.</p>
      </CardFooter>
    </Card>
  );
}
    

    