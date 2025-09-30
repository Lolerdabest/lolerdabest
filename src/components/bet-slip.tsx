'use client';

import { useBet } from '@/context/bet-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Ticket, Trash2, Send } from 'lucide-react';
import { placeBetAction, type FormState } from '@/app/actions';
import { useEffect, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-bold text-lg py-6" disabled={pending}>
      <Send className="mr-2 h-5 w-5" />
      {pending ? 'Submitting Bet...' : 'Submit Bet'}
    </Button>
  );
}

const initialState: FormState = {
  message: '',
  success: false,
};

export function BetSlip() {
  const { bets, removeBet, clearBets, totalWager } = useBet();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const [state, formAction] = useFormState(placeBetAction, initialState);

  const betDetailsString = useMemo(() => {
    return bets.map(bet => {
      if (bet.game === 'Mines') {
        return `[${bet.game}] ${bet.details} - Wager: $${bet.wager.toFixed(2)}`;
      }
      return `[${bet.game}] ${bet.details} - Wager: $${bet.wager.toFixed(2)} (Potential Payout: $${bet.payout.toFixed(2)})`;
    }).join('\n');
  }, [bets]);

  const gameType = useMemo(() => bets.length > 0 ? bets[0].game : '', [bets]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        formRef.current?.reset();
        clearBets();
      }
    }
  }, [state, toast, clearBets]);

  return (
      <Card className="border-primary/50 bg-card/80 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-primary animate-text-glow">
            <Ticket />
            Betting Slip
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent>
            {bets.length === 0 ? (
              <div className="text-muted-foreground text-center py-8 px-4">
                <p>Your bet slip is empty.</p>
                <p className="text-sm">Add a bet from a game below to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bets.map((bet) => (
                  <div key={bet.id} className="flex items-start gap-4 p-3 rounded-lg bg-background/50">
                    <div className="flex-grow">
                      <p className="font-semibold leading-tight text-primary">{bet.game}</p>
                      <p className="text-sm text-muted-foreground">{bet.details}</p>
                      <p className="text-sm">Wager: <span className="font-bold text-accent">${bet.wager.toFixed(2)}</span></p>
                      {bet.game !== 'Mines' && <p className="text-xs">Multiplier: <span className="font-semibold">{bet.multiplier.toFixed(2)}x</span></p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {bet.game !== 'Mines' ? 
                        <p className="font-semibold text-accent">Payout: ${bet.payout.toFixed(2)}</p>
                        : <p className="font-semibold text-accent">Payout Varies</p>
                      }
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeBet(bet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>

        {bets.length > 0 && (
          <CardFooter className="flex-col !items-start gap-4 pt-4 border-t-2 border-primary/20 mt-auto bg-card/50">
              <div className="w-full space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-muted-foreground">Total Wager</span>
                  <span className="text-accent">${totalWager.toFixed(2)}</span>
                </div>
              </div>
            <Separator className="bg-primary/20"/>

            <form action={formAction} ref={formRef} className="w-full space-y-4">
              <input type="hidden" name="betDetails" value={betDetailsString} />
              <input type="hidden" name="totalBetAmount" value={totalWager.toFixed(2)} />
              <input type="hidden" name="gameType" value={gameType} />

              <div className="space-y-2">
                <Label htmlFor="minecraftUsername">Minecraft Username</Label>
                <Input id="minecraftUsername" name="minecraftUsername" placeholder="Steve" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discordTag">Discord Tag</Label>
                <Input id="discordTag" name="discordTag" placeholder="yourname#1234" required />
              </div>
              
              <div className="space-y-2">
                  <Label>Payment Instructions</Label>
                  <div className="p-3 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    <p>After submitting, pay the total wager in-game. An admin will confirm your payment to unlock the game.</p>
                  </div>
              </div>

              <SubmitButton />
            </form>
          </CardFooter>
        )}
      </Card>
  );
}
