
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Dice6, Dices } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';

export default function DiceGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(100);
  const [rollOverValue, setRollOverValue] = useState(50.5);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  const { winChance, multiplier } = useMemo(() => {
    const chance = 100 - rollOverValue;
    const multi = chance > 0 ? 99 / chance : 0;
    return {
      winChance: chance.toFixed(2),
      multiplier: multi.toFixed(2),
    };
  }, [rollOverValue]);
  
  const payout = useMemo(() => {
    return (betAmount * parseFloat(multiplier)).toFixed(2);
  }, [betAmount, multiplier]);

  const handleRoll = (rollType: 'over' | 'under') => {
    setIsRolling(true);
    setRollResult(null);

    const result = parseFloat((Math.random() * 100).toFixed(2));

    setTimeout(() => {
      setRollResult(result);
      setIsRolling(false);
      
      const didWin = (rollType === 'over' && result > rollOverValue) || (rollType === 'under' && result < rollOverValue);

      const betDetails = `Rolled ${rollType === 'over' ? 'Over' : 'Under'} ${rollOverValue}. Result: ${result}. ${didWin ? 'Win!' : 'Loss.'}`;

      // We still add the bet to the slip for tracking purposes, even on a loss.
      // The user will only pay if they want to submit this "ticket".
      const betId = `dice-${Date.now()}`;
      addBet({
        id: betId,
        game: 'Dice Roll',
        details: `Roll ${rollType === 'over' ? 'Over' : 'Under'} ${rollOverValue}`,
        wager: betAmount,
        multiplier: parseFloat(multiplier),
        payout: didWin ? parseFloat(payout) : 0,
      });

      toast({
        title: `You ${didWin ? 'Won!' : 'Lost!'}`,
        description: `You rolled ${result}. The bet has been added to your bet slip.`,
        variant: didWin ? 'default' : 'destructive',
      });

    }, 1000);
  };
  
  const rollUnderValue = 100 - rollOverValue;
  const underMultiplier = rollUnderValue > 0 ? (99 / rollUnderValue).toFixed(2) : 0;
  const underPayout = (betAmount * parseFloat(underMultiplier)).toFixed(2);
  const underWinChance = rollUnderValue.toFixed(2);


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
            <Label>Payout on Win</Label>
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Roll Over {rollOverValue.toFixed(2)} to win</span>
            <span>Roll Under {(100 - rollOverValue).toFixed(2)} to win</span>
          </div>
        </div>
        
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
                className="w-full py-8 text-lg font-bold" 
                variant="default"
                onClick={() => handleRoll('over')}
                disabled={isRolling}
            >
                Roll Over {rollOverValue.toFixed(2)}
            </Button>
            <Button
                className="w-full py-8 text-lg font-bold"
                variant="secondary"
                onClick={() => handleRoll('under')}
                disabled={isRolling}
            >
                Roll Under {(100 - rollOverValue).toFixed(2)}
            </Button>
        </div>
      </CardContent>
      <CardFooter className="min-h-[80px] flex items-center justify-center bg-muted/30">
        {isRolling && (
          <div className="flex items-center gap-2 text-lg animate-pulse">
            <Dice6 className="animate-spin" />
            <span>Rolling...</span>
          </div>
        )}
        {rollResult !== null && (
          <p className="text-2xl font-bold">
            You rolled: <span className="text-primary animate-text-glow">{rollResult.toFixed(2)}</span>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
