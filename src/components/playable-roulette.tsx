
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition, useMemo } from 'react';
import { playRouletteAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

const getNumberColor = (num: number) => {
    if (num === 0) return '#22c55e'; // green-500
    return RED_NUMBERS.includes(num) ? '#ef4444' : '#18181b'; // red-500, gray-900
};

const RecentNumber = ({ num }: { num: number }) => (
    <div className={cn("h-6 w-6 md:h-8 md:w-8 flex items-center justify-center rounded-full text-white text-xs md:text-sm font-bold", {
        'bg-green-500': num === 0,
        'bg-red-500': RED_NUMBERS.includes(num),
        'bg-neutral-800': num !== 0 && !RED_NUMBERS.includes(num)
    })}>
        {num}
    </div>
);

export function PlayableRoulette({ bet, serverSeed }: { bet: Bet; serverSeed: string }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [result, setResult] = useState<{ winningNumber: number; totalPayout: number } | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [recentNumbers, setRecentNumbers] = useState<number[]>([]);
    const [styleSheet, setStyleSheet] = useState<HTMLStyleElement | null>(null);

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
                const res = await playRouletteAction(bet.id);
                
                const winningIndex = ROULETTE_NUMBERS.indexOf(res.winningNumber);
                const numberAngle = 360 / ROULETTE_NUMBERS.length;
                const finalAngle = (winningIndex * numberAngle) + (Math.random() * numberAngle) - (numberAngle / 2);

                const spinDuration = 8000; // 8 seconds
                const wheelRevolutions = 10;
                const ballRevolutions = 25;

                const wheelFinalRotation = (360 * wheelRevolutions) - finalAngle;
                const ballFinalRotation = (360 * ballRevolutions) - finalAngle;
                
                const animationStyle = `
                    @keyframes spinWheel {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(${wheelFinalRotation}deg); }
                    }
                    @keyframes spinBall {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(-${ballFinalRotation}deg); }
                    }
                `;
                
                let sheet = styleSheet;
                if (!sheet) {
                    sheet = document.createElement('style');
                    document.head.appendChild(sheet);
                    setStyleSheet(sheet);
                }
                sheet.innerHTML = animationStyle;

                setTimeout(() => {
                    setResult(res);
                    setIsSpinning(false);
                    setRecentNumbers(prev => [res.winningNumber, ...prev].slice(0, 20));
                    toast({
                        title: res.totalPayout > bet.wager ? 'You Won!' : 'You Lost.',
                        description: `The ball landed on ${res.winningNumber}.`,
                        variant: res.totalPayout > bet.wager ? 'default' : 'destructive'
                    });
                }, spinDuration); 

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
                <div 
                    className="absolute w-full h-full rounded-full border-8 border-yellow-800/50 bg-neutral-900/50"
                >
                    <div 
                        className="w-full h-full rounded-full"
                        style={{
                            animation: isSpinning ? 'spinWheel 8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' : 'none'
                        }}
                    >
                        {ROULETTE_NUMBERS.map((num, i) => (
                            <div 
                                key={num}
                                className="absolute top-0 left-1/2 w-px h-1/2 origin-bottom flex justify-center"
                                style={{ transform: `rotate(${i * (360 / ROULETTE_NUMBERS.length)}deg)`}}
                            >
                                <div
                                    className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-bold text-sm md:text-base rounded-t-full")}
                                    style={{
                                        backgroundColor: getNumberColor(num),
                                        transform: 'translateY(-100%)',
                                    }}
                                >
                                    <span style={{ transform: `rotate(${-i * (360 / ROULETTE_NUMBERS.length)}deg)` }}>{num}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div 
                    className="absolute w-[80%] h-[80%] rounded-full"
                    style={{
                        animation: isSpinning ? 'spinBall 8s cubic-bezier(0.3, 0.7, 0.4, 1) forwards' : 'none',
                    }}
                >
                    <div className="absolute top-1/2 left-0 -mt-2 w-4 h-4 bg-slate-200 rounded-full z-20" />
                </div>
               
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
