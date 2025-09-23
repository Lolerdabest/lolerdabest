
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Dices, PlusCircle } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function DiceGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(100);
  const [rollOverValue, setRollOverValue] = useState(50.5);
  const [betType, setBetType] = useState<'over' | 'under'>('over');

  const { winChance, multiplier, payout, rollConditionValue } = useMemo(() => {
    const chance = betType === 'over' ? 100 - rollOverValue : rollOverValue;
    const multi = chance > 0 ? 99 / chance : 0;
    const pay = betAmount * multi;
    return {
      winChance: chance.toFixed(2),
      multiplier: multi.toFixed(2),
      payout: pay.toFixed(2),
      rollConditionValue: betType === 'over' ? rollOverValue : 100 - rollOverValue,
    };
  }, [rollOverValue, betAmount, betType]);

  const handleAddBet = () => {
    if (betAmount <= 0) {
      toast({
        title: 'Invalid Bet',
        description: 'Bet amount must be greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    const betId = `dice-${Date.now()}`;
    addBet({
      id: betId,
      game: 'Dice Roll',
      details: `Roll ${betType === 'over' ? 'Over' : 'Under'} ${rollConditionValue.toFixed(2)}`,
      wager: betAmount,
      multiplier: parseFloat(multiplier),
      payout: parseFloat(payout), // Potential payout
    });

    toast({
      title: 'Bet Added!',
      description: 'Your dice bet has been added to the bet slip.',
    });
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Dices />
          Dice Roll
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bet-amount">Bet Amount</Label>
            <Input
              id="bet-amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="font-bold text-lg"
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label>Potential Payout</Label>
            <Input
              value={`$${payout}`}
              disabled
              className="font-bold text-lg text-primary"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <Label htmlFor="win-chance-slider">Multiplier: <span className="text-primary font-bold">{multiplier}x</span></Label>
            <span className="text-muted-foreground">Win Chance: {winChance}%</span>
          </div>
          <Slider
            id="win-chance-slider"
            min={1}
            max={99}
            step={0.1}
            value={[rollOverValue]}
            onValueChange={(value) => setRollOverValue(value[0])}
            className="w-full"
          />
          <RadioGroup defaultValue="over" onValueChange={(value: 'over' | 'under') => setBetType(value)} className="flex justify-center gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="over" id="over" />
                <Label htmlFor="over">Roll Over {rollOverValue.toFixed(2)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="under" id="under" />
                <Label htmlFor="under">Roll Under {(100 - rollOverValue).toFixed(2)}</Label>
              </div>
          </RadioGroup>
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
        <p className="text-center text-muted-foreground">Configure your bet and add it to the slip. <br/>You will place the final bet from the slip.</p>
      </CardFooter>
    </Card>
  );
}
