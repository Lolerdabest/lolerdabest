
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CircleDotDashed, PlusCircle } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { cn } from '@/lib/utils';

type BetType = 'number' | 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';

const getPayoutMultiplier = (type: BetType) => {
    switch (type) {
        case 'number': return 35;
        case 'red':
        case 'black':
        case 'even':
        case 'odd':
        case 'low':
        case 'high':
        default:
            return 2;
    }
}

const getBetDetails = (type: BetType, value?: number) => {
    switch(type) {
        case 'number': return `Number ${value}`;
        case 'red': return 'Color: Red';
        case 'black': return 'Color: Black';
        case 'even': return 'Even Numbers';
        case 'odd': return 'Odd Numbers';
        case 'low': return 'Numbers 1-18';
        case 'high': return 'Numbers 19-36';
    }
}


export default function RouletteGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState<BetType>('red');
  const [number, setNumber] = useState(1);

  const multiplier = getPayoutMultiplier(betType);
  const payout = betAmount * multiplier;

  const handleAddBet = () => {
    if (betAmount <= 0) {
      toast({
        title: 'Invalid Bet',
        description: 'Bet amount must be greater than zero.',
        variant: 'destructive',
      });
      return;
    }
     if (betType === 'number' && (number < 0 || number > 36)) {
      toast({
        title: 'Invalid Number',
        description: 'Please pick a number between 0 and 36.',
        variant: 'destructive',
      });
      return;
    }

    addBet({
      game: 'Roulette',
      details: getBetDetails(betType, number),
      wager: betAmount,
      multiplier: multiplier,
      payout: payout,
    });

    toast({
      title: 'Bet Added!',
      description: 'Your roulette bet has been added to the bet slip.',
    });
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <CircleDotDashed />
          Roulette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="bet-amount-roulette">Bet Amount</Label>
            <Input
              id="bet-amount-roulette"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="font-bold text-lg"
              placeholder="10"
            />
        </div>

        <div className="space-y-3">
            <Label>Bet Type</Label>
            <ToggleGroup 
                type="single" 
                value={betType} 
                onValueChange={(value: BetType) => value && setBetType(value)}
                className="grid grid-cols-3"
            >
                <ToggleGroupItem value="red" aria-label="Bet on Red" className="bg-red-800/50 hover:bg-red-800/80 data-[state=on]:bg-red-700">Red</ToggleGroupItem>
                <ToggleGroupItem value="black" aria-label="Bet on Black" className="bg-gray-700/50 hover:bg-gray-700/80 data-[state=on]:bg-gray-600">Black</ToggleGroupItem>
                <ToggleGroupItem value="number" aria-label="Bet on a number">Number</ToggleGroupItem>
                <ToggleGroupItem value="even" aria-label="Bet on Even">Even</ToggleGroupItem>
                <ToggleGroupItem value="odd" aria-label="Bet on Odd">Odd</ToggleGroupItem>
                <ToggleGroupItem value="low" aria-label="Bet on Low (1-18)">1-18</ToggleGroupItem>
                <ToggleGroupItem value="high" aria-label="Bet on High (19-36)">19-36</ToggleGroupItem>
            </ToggleGroup>
        </div>

        {betType === 'number' && (
            <div className="space-y-2 animate-in fade-in duration-300">
                <Label htmlFor="number-input">Pick a number (0-36)</Label>
                <Input
                    id="number-input"
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value))}
                    min={0}
                    max={36}
                    className="font-bold text-lg"
                />
            </div>
        )}

        <div className="p-4 rounded-md bg-muted/50 text-center">
            <p className="text-muted-foreground">Potential Payout</p>
            <p className="text-2xl font-bold text-primary">${payout.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">({multiplier}x Multiplier)</p>
        </div>
        
        <Separator />

        <Button 
            className="w-full py-8 text-lg font-bold" 
            variant="default"
            onClick={handleAddBet}
        >
          <PlusCircle className="mr-2" />
          Add Bet to Slip
        </Button>
      </CardContent>
    </Card>
  );
}
