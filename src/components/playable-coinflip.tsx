
'use client';

import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useState, useTransition } from 'react';
import { playCoinflipAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

export function PlayableCoinflip({ bet }: { bet: Bet }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ message: string; result: 'win' | 'loss' } | null>(null);
  const { toast } = useToast();
  
  const playerChoice = bet.details.includes('Heads') ? 'Heads' : 'Tails';

  const handlePlay = () => {
    startTransition(async () => {
      try {
        const res = await playCoinflipAction(bet.id, playerChoice);
        setResult(res);
         toast({
          title: res.result === 'win' ? 'You Won!' : 'You Lost.',
          description: res.message,
          variant: res.result === 'win' ? 'default' : 'destructive'
        });
      } catch (error) {
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
          <Button onClick={() => window.location.href = '/'} className="w-full mt-4">Play Again</Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="max-w-md mx-auto border-primary/50">
      <CardHeader>
        <CardTitle className="text-center">Your Coinflip Bet</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">You wagered <span className="font-bold text-primary">${bet.wager.toFixed(2)}</span></p>
        <p className="text-4xl font-bold">You Chose: <span className="text-primary">{playerChoice}</span></p>
        <p className="text-muted-foreground">Potential Payout: <span className="font-bold text-primary">${(bet.wager * 1.90).toFixed(2)}</span></p>
        <Button onClick={handlePlay} disabled={isPending} className="w-full py-6 text-lg">
          {isPending ? 'Flipping...' : 'Flip the Coin!'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">The outcome will be determined by the server and cannot be manipulated.</p>
      </CardFooter>
    </Card>
  );
}
