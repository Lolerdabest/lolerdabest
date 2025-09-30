
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, TrendingUp } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';

export default function LimboGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.00);

  const potentialPayout = betAmount * targetMultiplier;
  const winChance = (99 / targetMultiplier).toFixed(2); // 99% because of 1% house edge (instant bust)

  const handleAddBet = () => {
    if (betAmount <= 0) {
      toast({
        title: 'Invalid Bet',
        description: 'Bet amount must be greater than zero.',
        variant: 'destructive',
      });
      return;
    }
     if (targetMultiplier < 1.01) {
      toast({
        title: 'Invalid Multiplier',
        description: 'Target multiplier must be at least 1.01.',
        variant: 'destructive',
      });
      return;
    }

    addBet({
      game: 'Limbo',
      details: `Target: ${targetMultiplier.toFixed(2)}x`,
      wager: betAmount,
      multiplier: targetMultiplier, // In Limbo, the "multiplier" is the target the user sets
      payout: potentialPayout,
    });

    toast({
      title: 'Bet Added!',
      description: 'Your Limbo bet has been added to the bet slip.',
    });
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <TrendingUp />
          Limbo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="bet-amount-limbo">Bet Amount</Label>
                <Input
                  id="bet-amount-limbo"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="font-bold text-lg"
                  placeholder="10"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="target-multiplier-limbo">Target Multiplier</Label>
                <Input
                  id="target-multiplier-limbo"
                  type="number"
                  step="0.01"
                  value={targetMultiplier}
                   onChange={(e) => setTargetMultiplier(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                  className="font-bold text-lg"
                  placeholder="2.00"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">Win Chance</p>
                <p className="text-lg font-bold text-primary">{winChance}%</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">Potential Payout</p>
                <p className="text-lg font-bold text-primary">${potentialPayout.toFixed(2)}</p>
            </div>
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
