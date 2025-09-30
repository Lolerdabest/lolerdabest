
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition, useEffect, useMemo } from 'react';
import { playRouletteAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
const NUMBER_SPACING = 360 / ROULETTE_NUMBERS.length;

const getNumberColorClass = (num: number) => {
    if (num === 0) return 'bg-green-600';
    return RED_NUMBERS.includes(num) ? 'bg-red-700' : 'bg-black';
};

const RecentNumber = ({ num }: { num: number }) => (
    <div className={cn("h-6 w-6 md:h-8 md:w-8 flex items-center justify-center rounded-full text-white text-xs md:text-sm font-bold", getNumberColorClass(num))}>
        {num}
    </div>
);


export function PlayableRoulette({ bet, serverSeed }: { bet: Bet; serverSeed: string }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [result, setResult] = useState<{ winningNumber: number; totalPayout: number } | null>(null);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [ballRotation, setBallRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [recentNumbers, setRecentNumbers] = useState<number[]>([]);

    const parsedBets = useMemo(() => {
        try {
            return JSON.parse(bet.details);
        } catch (e) {
            console.error("Failed to parse bet details:", bet.details);
            return [];
        }
    }, [bet.details]);

    const handlePlay = () => {
        if (isPending || isSpinning) return;

        setIsSpinning(true);
        startTransition(async () => {
            try {
                // Initial animation
                const initialWheelSpins = 2;
                const initialBallSpins = 10;
                setWheelRotation(360 * initialWheelSpins + Math.random() * 360);
                setBallRotation(-(360 * initialBallSpins + Math.random() * 360));
                
                const res = await playRouletteAction(bet.id);

                const winningIndex = ROULETTE_NUMBERS.indexOf(res.winningNumber);
                const finalAngle = winningIndex * NUMBER_SPACING;

                const wheelRevolutions = 4;
                const finalWheelRotation = (360 * wheelRevolutions) + finalAngle + (Math.random() - 0.5) * (NUMBER_SPACING * 0.8);

                const ballRevolutions = 15;
                const finalBallRotation = -(360 * ballRevolutions) - finalAngle - (Math.random() - 0.5) * (NUMBER_SPACING * 0.4);

                setWheelRotation(finalWheelRotation);
                setBallRotation(finalBallRotation);


                setTimeout(() => {
                    setResult(res);
                    setIsSpinning(false);
                    setRecentNumbers(prev => [res.winningNumber, ...prev].slice(0, 20));
                    toast({
                        title: res.totalPayout > bet.wager ? 'You Won!' : 'You Lost.',
                        description: `The ball landed on ${res.winningNumber}.`,
                        variant: res.totalPayout > bet.wager ? 'default' : 'destructive'
                    });
                }, 8000); // Animation duration

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
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="text-center">{result.totalPayout > bet.wager ? 'Congratulations!' : 'Better Luck Next Time!'}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                         <Alert variant={result.totalPayout > bet.wager ? 'default' : 'destructive'}>
                            {result.totalPayout > bet.wager ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle>The winning number is {result.winningNumber}</AlertTitle>
                            <AlertDescription>
                                You wagered ${bet.wager.toFixed(2)} and won ${result.totalPayout.toFixed(2)}.
                            </AlertDescription>
                        </Alert>
                        <Button onClick={() => window.location.href = '/'} className="w-full mt-4">Play Again</Button>
                    </CardContent>
                </Card>
                 <div className="w-full max-w-2xl mx-auto p-2 rounded-md bg-card/50">
                    <p className="text-xs text-center text-muted-foreground mb-2">Recent Numbers</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {recentNumbers.map((num, i) => <RecentNumber key={i} num={num} />)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center gap-4 md:gap-8">
            <div className="w-full max-w-2xl mx-auto p-2 rounded-md bg-card/50">
                <p className="text-xs text-center text-muted-foreground mb-2">Recent Numbers</p>
                <div className="flex flex-wrap gap-1 justify-center">
                    {recentNumbers.map((num, i) => <RecentNumber key={i} num={num} />)}
                </div>
            </div>
            
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                {/* Wheel */}
                 <div 
                    className="absolute w-full h-full rounded-full border-[16px] md:border-[24px] border-yellow-800 bg-neutral-900 shadow-2xl transition-transform duration-[7500ms] cubic-bezier(0.25, 0.1, 0.25, 1.0)"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                    {ROULETTE_NUMBERS.map((num, i) => (
                        <div 
                            key={num} 
                            className="absolute top-0 left-1/2 w-px h-1/2 origin-bottom" 
                            style={{ transform: `translateX(-50%) rotate(${i * NUMBER_SPACING}deg)`}}
                        >
                            <div className={cn("absolute -top-1 left-1/2 -translate-x-1/2 w-[24px] h-[24px] md:w-[36px] md:h-[36px] flex items-center justify-center text-white font-bold text-sm md:text-lg", getNumberColorClass(num))}>
                                <span style={{ transform: `rotate(${-i * NUMBER_SPACING}deg)` }}>{num}</span>
                            </div>
                        </div>
                    ))}
                    {/* Inner lines */}
                    {ROULETTE_NUMBERS.map((_, i) => (
                         <div key={`line-${i}`} className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/10 origin-bottom" style={{ transform: `translateX(-50%) rotate(${i * NUMBER_SPACING - (NUMBER_SPACING / 2)}deg)`}} />
                    ))}
                </div>

                {/* Ball Track */}
                <div className="absolute w-[90%] h-[90%] md:w-[95%] md:h-[95%] rounded-full">
                     <div 
                        className="absolute top-1/2 left-0 w-3 h-3 md:w-4 md:h-4 bg-slate-200 rounded-full z-20 origin-center" 
                        style={{ 
                            transform: `rotate(${ballRotation}deg) translateX(calc(50vw - 60px))`,
                             '@media (min-width: 768px)': {
                                transform: `rotate(${ballRotation}deg) translateX(210px)`,
                            },
                            transition: 'transform 8s cubic-bezier(0.1, 0.4, 0.1, 1)',
                        }}
                    />
                </div>
               
                 {/* Center piece */}
                <div className="absolute w-20 h-20 md:w-32 md:h-32 bg-yellow-800 rounded-full border-4 border-yellow-600 flex items-center justify-center shadow-inner">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-yellow-700 rounded-full" />
                </div>
            </div>

            <Card className="max-w-md w-full">
                 <CardHeader>
                    <CardTitle className="text-center">Your Roulette Bet</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                    <p className="text-muted-foreground">Total Wager</p>
                    <p className="text-xl font-bold text-primary">${bet.wager.toFixed(2)}</p>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">Your Bets</p>
                    <div className="text-sm font-semibold max-h-24 overflow-y-auto">
                      {parsedBets.map((b: any, i:number) => <div key={i}>{b.type}: {b.value} (${b.wager.toFixed(2)})</div>)}
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handlePlay} disabled={isPending || isSpinning} className="w-full max-w-md py-6 text-lg">
                {isPending || isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </Button>
        </div>
    );
}

    