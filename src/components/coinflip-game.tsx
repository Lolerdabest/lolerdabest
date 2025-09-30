
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function CoinflipGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState<'Heads' | 'Tails'>('Heads');

  const multiplier = 1.90; // 5% house edge
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

    addBet({
      game: 'Coinflip',
      details: `Bet on ${choice}`,
      wager: betAmount,
      multiplier: multiplier,
      payout: payout,
    });

    toast({
      title: 'Bet Added!',
      description: 'Your coinflip bet has been added to the bet slip.',
    });
  };
  
  const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><path d="M12 1v4M12 19v4M4 4l2 2M18 18l2 2M1 12h4M19 12h4M4 20l2-2M18 6l2-2"></path></svg>
  );


  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <CoinIcon />
          Coinflip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bet-amount-coinflip">Bet Amount</Label>
            <Input
              id="bet-amount-coinflip"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="font-bold text-lg"
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label>Potential Payout (1.90x)</Label>
            <Input
              value={`$${payout.toFixed(2)}`}
              disabled
              className="font-bold text-lg text-primary"
            />
          </div>
        </div>

        <RadioGroup value={choice} onValueChange={(value: 'Heads' | 'Tails') => setChoice(value)} className="flex justify-center gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Heads" id="heads" />
              <Label htmlFor="heads" className="text-lg">Heads</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Tails" id="tails" />
              <Label htmlFor="tails" className="text-lg">Tails</Label>
            </div>
        </RadioGroup>
        
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
