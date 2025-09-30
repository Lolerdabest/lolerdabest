
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bomb, PlusCircle } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';
import { Slider } from './ui/slider';

export default function MinesGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(50);
  const [mineCount, setMineCount] = useState(3);

  const handleAddBet = () => {
    if (betAmount <= 0) {
      toast({
        title: 'Invalid Bet',
        description: 'Bet amount must be greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    addBet({
      game: 'Mines',
      details: `Grid with ${mineCount} mines`,
      wager: betAmount,
      multiplier: 1, 
      payout: 0,
    });

    toast({
      title: 'Bet Added!',
      description: 'Your mines game has been added to the bet slip.',
    });
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Bomb />
          Mines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="bet-amount-mines">Bet Amount</Label>
            <Input
              id="bet-amount-mines"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="font-bold text-lg"
              placeholder="50"
            />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="mine-slider">Number of Mines</Label>
            <span className="font-bold text-primary">{mineCount}</span>
          </div>
          <Slider
            id="mine-slider"
            min={1}
            max={24}
            step={1}
            value={[mineCount]}
            onValueChange={(value) => setMineCount(value[0])}
            />
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
      <CardFooter className="min-h-[80px] flex items-center justify-center bg-muted/30">
        <p className="text-center text-muted-foreground">Pay in-game to play: <code className="text-primary">/pay Lolerdabest69 [amount]</code><br/>An admin will confirm your payment to unlock the game.</p>
      </CardFooter>
    </Card>
  );
}
