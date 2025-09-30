
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dot } from 'lucide-react';
import { useBet } from '@/context/bet-provider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

const getNumberColorClass = (n: number) => {
    if (n === 0) return 'bg-green-600/80 text-white';
    if (RED_NUMBERS.includes(n)) return 'bg-red-700/80 text-white';
    if (BLACK_NUMBERS.includes(n)) return 'bg-black/80 text-white';
    return '';
}

type BetType = 'straight' | 'color' | 'parity' | 'range' | 'dozen' | 'column';
const betTypeDisplayNames: Record<BetType, string> = {
    straight: 'Number',
    color: 'Color',
    parity: 'Parity',
    range: 'Range',
    dozen: 'Dozen',
    column: 'Column',
};


const CHIP_VALUES = [250, 500, 1000, 5000, 10000, 50000];

export default function RouletteGame() {
  const { addBet, clearBets, bets } = useBet();
  const { toast } = useToast();
  const [selectedChip, setSelectedChip] = useState(250);

  const handleBetPlacement = (type: BetType, value: string | number, multiplier: number) => {
    if (selectedChip <= 0) {
      toast({ title: "Invalid Wager", description: "Please select a chip value greater than zero.", variant: "destructive" });
      return;
    }
    
    // Clear other game types from bet slip if present
    if (bets.length > 0 && bets[0].game !== 'Roulette') {
        clearBets();
         toast({
            title: "Bet Slip Cleared",
            description: "Roulette bets cannot be combined with other games. Your previous bets were cleared.",
        });
    }

    addBet({
      game: 'Roulette',
      details: type, // "straight", "color", etc.
      wager: selectedChip,
      multiplier: multiplier,
      payout: value, // The specific bet value ("red", 17, etc)
    });

    const betTypeName = betTypeDisplayNames[type];
    toast({
        title: "Bet Added to Slip",
        description: `${betTypeName} bet on ${value} for $${selectedChip.toFixed(2)}`,
    });
  };
  
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Dot />
          Roulette
        </CardTitle>
        <CardDescription>Place your bets on the table below. Select a chip value first. Minimum bet is $250.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Betting Mat */}
        <ScrollArea className="w-full">
            <div className="bg-green-800/50 p-2 rounded-lg space-y-1 min-w-[400px]">
                {/* Numbers Grid */}
                <div className="grid grid-cols-13 gap-1">
                    <button onClick={() => handleBetPlacement('straight', 0, 36)} className={cn("row-span-3 aspect-[1/3] flex items-center justify-center font-bold rounded-sm text-xs md:text-sm transition-colors", getNumberColorClass(0), "hover:bg-green-500/50")}>
                        0
                    </button>
                    {Array.from({length: 36}, (_, i) => i + 1).map(n => (
                         <button key={n} onClick={() => handleBetPlacement('straight', n, 36)} className={cn("aspect-square flex items-center justify-center font-bold rounded-sm text-xs md:text-sm transition-colors", getNumberColorClass(n), "hover:bg-green-500/50")}>
                            {n}
                        </button>
                    ))}
                    <button onClick={() => handleBetPlacement('column', 'col3', 3)} className="aspect-square flex items-center justify-center font-bold rounded-sm text-xs md:text-sm text-white bg-green-900/80 hover:bg-green-500/50 transition-colors">2-1</button>
                    <button onClick={() => handleBetPlacement('column', 'col2', 3)} className="aspect-square flex items-center justify-center font-bold rounded-sm text-xs md:text-sm text-white bg-green-900/80 hover:bg-green-500/50 transition-colors">2-1</button>
                    <button onClick={() => handleBetPlacement('column', 'col1', 3)} className="aspect-square flex items-center justify-center font-bold rounded-sm text-xs md:text-sm text-white bg-green-900/80 hover:bg-green-500/50 transition-colors">2-1</button>
                </div>

                 <div className="grid grid-cols-13 gap-1">
                    <div className="col-span-1"></div>
                    <div className="col-span-4">
                        <button onClick={() => handleBetPlacement('dozen', '1st 12', 3)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">1st 12</button>
                    </div>
                     <div className="col-span-4">
                        <button onClick={() => handleBetPlacement('dozen', '2nd 12', 3)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">2nd 12</button>
                    </div>
                     <div className="col-span-4">
                        <button onClick={() => handleBetPlacement('dozen', '3rd 12', 3)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">3rd 12</button>
                    </div>
                </div>

                 <div className="grid grid-cols-13 gap-1">
                    <div className="col-span-1"></div>
                    <div className="col-span-2">
                        <button onClick={() => handleBetPlacement('range', '1-18', 2)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">1-18</button>
                    </div>
                     <div className="col-span-2">
                        <button onClick={() => handleBetPlacement('parity', 'even', 2)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">EVEN</button>
                    </div>
                    <div className="col-span-2">
                        <button onClick={() => handleBetPlacement('color', 'red', 2)} className="w-full bg-red-700 hover:bg-red-500 py-2 rounded-sm text-white font-bold text-xs md:text-sm">RED</button>
                    </div>
                    <div className="col-span-2">
                        <button onClick={() => handleBetPlacement('color', 'black', 2)} className="w-full bg-black hover:bg-neutral-700 py-2 rounded-sm text-white font-bold text-xs md:text-sm">BLACK</button>
                    </div>
                    <div className="col-span-2">
                        <button onClick={() => handleBetPlacement('parity', 'odd', 2)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">ODD</button>
                    </div>
                    <div className="col-span-2">
                        <button onClick={() => handleBetPlacement('range', '19-36', 2)} className="w-full bg-green-900/80 hover:bg-green-500/50 py-2 rounded-sm text-white font-bold text-xs md:text-sm">19-36</button>
                    </div>
                </div>
            </div>
            <style jsx>{`
              .grid-cols-13 {
                grid-template-columns: 0.5fr repeat(12, 1fr);
              }
            `}</style>
        </ScrollArea>


        <Separator />

        {/* Chip Selector */}
        <div className="space-y-3">
             <div className="flex justify-between items-center">
                <Label>Chip Value</Label>
                <span className="font-bold text-lg text-primary">${selectedChip}</span>
             </div>
             <ToggleGroup type="single" value={String(selectedChip)} onValueChange={(value) => value && setSelectedChip(Number(value))} className="grid grid-cols-6 gap-2">
                {CHIP_VALUES.map(value => (
                    <ToggleGroupItem key={value} value={String(value)} className="w-full h-12 flex items-center justify-center rounded-full border-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                        {value >= 1000 ? `${value/1000}k` : value}
                    </ToggleGroupItem>
                ))}
             </ToggleGroup>
        </div>
        
        {bets.length > 0 && bets[0].game === 'Roulette' && (
            <>
            <Separator />
            <div className="flex justify-between items-center gap-4">
                <Button variant="outline" onClick={clearBets} className="w-full">
                    Clear All Bets
                </Button>
            </div>
            </>
        )}

      </CardContent>
    </Card>
  );
}
