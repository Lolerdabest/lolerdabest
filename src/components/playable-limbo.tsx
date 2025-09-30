
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition, useEffect } from 'react';
import { playLimboAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlayableLimbo({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss'; finalMultiplier: number, payout: number } | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [isAnimating, setIsAnimating] = useState(false);

  const { toast } = useToast();
  
  const targetMultiplierMatch = bet.details.match(/Target: ([\d.]+)x/);
  const targetMultiplier = targetMultiplierMatch ? parseFloat(targetMultiplierMatch[1]) : 1.01;

  const handlePlay = () => {
    if (isPending || isAnimating) return;

    setIsAnimating(true);
    startTransition(async () => {
      try {
        const res = await playLimboAction(bet.id);
        
        // Animate the result
        const start = 1.00;
        const end = res.finalMultiplier;
        const duration = Math.min(2000, end * 50); // Animate faster for larger numbers
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
           if (!startTime) startTime = currentTime;
           const progress = (currentTime - startTime) / duration;
           const easeOutProgress = 1 - Math.pow(1 - progress, 3);
           const animatedValue = start + (end - start) * easeOutProgress;
           
           if (progress < 1) {
                setCurrentMultiplier(parseFloat(animatedValue.toFixed(2)));
                requestAnimationFrame(animate);
           } else {
                setCurrentMultiplier(end);
                setIsAnimating(false);
                setResult(res);
                toast({
                    title: res.result === 'win' ? 'You Won!' : 'You Lost.',
                    description: res.message,
                    variant: res.result === 'win' ? 'default' : 'destructive'
                });
           }
        };

        requestAnimationFrame(animate);

      } catch (error) {
        setIsAnimating(false);
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
    <Card className="max-w-md mx-auto border-primary/50">
      <CardHeader>
        <CardTitle className="text-center">Limbo</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="p-8 bg-muted rounded-lg flex flex-col items-center justify-center min-h-[150px]">
            <p 
                className={cn(
                    "text-6xl font-bold font-mono transition-colors duration-300",
                    isAnimating ? 'text-primary' : (currentMultiplier >= targetMultiplier ? 'text-green-400' : 'text-destructive'),
                )}
            >
                {currentMultiplier.toFixed(2)}x
            </p>
            <p className="text-muted-foreground text-sm mt-2">Target: {targetMultiplier.toFixed(2)}x</p>
        </div>
        
        <Button onClick={handlePlay} disabled={isPending || isAnimating} className="w-full py-6 text-lg">
          {isPending || isAnimating ? 'Playing...' : 'Play Limbo'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">You wagered <span className="font-bold text-primary">${bet.wager.toFixed(2)}</span>. Payout on win: <span className="font-bold text-primary">${(bet.wager * targetMultiplier).toFixed(2)}</span>.</p>
      </CardFooter>
    </Card>
  );
}
