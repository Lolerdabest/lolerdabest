
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, TowerControl } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function DragonTowersGame() {
  const { addBet } = useBet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

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
      game: 'Dragon Towers',
      details: `Difficulty: ${difficulty}`,
      wager: betAmount,
      multiplier: 0,
      payout: 0, // Payout is determined by gameplay
    });

    toast({
      title: 'Bet Added!',
      description: 'Your Dragon Towers game has been added to the bet slip.',
    });
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <TowerControl />
          Dragon Towers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bet-amount-towers">Bet Amount</Label>
          <Input
            id="bet-amount-towers"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="font-bold text-lg"
            placeholder="10"
          />
        </div>

        <div className="space-y-3">
            <Label>Difficulty</Label>
            <RadioGroup 
                value={difficulty} 
                onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)} 
                className="grid grid-cols-3 gap-4"
            >
                <div>
                    <RadioGroupItem value="easy" id="easy" className="sr-only" />
                    <Label htmlFor="easy" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        Easy
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="medium" id="medium" className="sr-only" />
                    <Label htmlFor="medium" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        Medium
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="hard" id="hard" className="sr-only" />
                    <Label htmlFor="hard" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        Hard
                    </Label>
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
        <p className="text-center text-muted-foreground">Climb the tower, avoid the skulls. <br /> The higher you go, the bigger the prize.</p>
      </CardFooter>
    </Card>
  );
}
