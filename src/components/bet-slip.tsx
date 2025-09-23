
'use client';

import { useBet } from '@/context/bet-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Ticket, Trash2, Send } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { placeBetAction, type FormState } from '@/app/actions';
import { useEffect, useRef, useState, useActionState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-bold text-lg py-6" disabled={pending}>
      <Send className="mr-2 h-5 w-5" />
      {pending ? 'Submitting Bet...' : 'Submit Bet for Confirmation'}
    </Button>
  );
}

export function BetSlip() {
  const { bets, removeBet, clearBets, totalWager } = useBet();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(placeBetAction, initialState);
  
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

  const betDetailsString = useMemo(() => {
    return bets.map(bet => 
      `[${bet.game}] ${bet.details} - Wager: $${bet.wager.toFixed(2)} (Potential Payout: $${bet.payout.toFixed(2)})`
    ).join('\n');
  }, [bets]);


  return (
      <Card className="border-primary/50 border-2 shadow-lg shadow-primary/20 bg-card h-full flex flex-col">
        <CardHeader className="sticky top-0 bg-card z-10">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 animate-text-glow">
            <Ticket />
            Bet Slip
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent>
            {bets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your bet slip is empty. <br/> Add a bet from a game to get started!</p>
            ) : (
              <div className="space-y-4">
                {bets.map((bet) => (
                  <div key={bet.id} className="flex items-start gap-4 p-2 rounded-lg bg-background/50">
                    <div className="flex-grow">
                      <p className="font-semibold leading-tight">{bet.game}</p>
                      <p className="text-sm text-muted-foreground">{bet.details}</p>
                      <p className="text-sm">Wager: <span className="font-bold text-primary">${bet.wager.toFixed(2)}</span></p>
                      <p className="text-xs">Multiplier: <span className="font-semibold">{bet.multiplier.toFixed(2)}x</span></p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-primary">Potential: ${bet.payout.toFixed(2)}</p>
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
          <CardFooter className="flex-col !items-start gap-4 pt-4 border-t mt-auto">
              <div className="w-full space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Wager</span>
                  <span>${totalWager.toFixed(2)}</span>
                </div>
              </div>
            <Separator />

            <form action={formAction} ref={formRef} className="w-full space-y-4">
              <input type="hidden" name="betDetails" value={betDetailsString} />
              <input type="hidden" name="totalBetAmount" value={totalWager.toFixed(2)} />

              <div className="space-y-2">
                <Label htmlFor="minecraftUsername">Minecraft Username</Label>
                <Input id="minecraftUsername" name="minecraftUsername" placeholder="Steve" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discordTag">Discord Tag</Label>
                <Input id="discordTag" name="discordTag" placeholder="yourname" required />
              </div>
              
              <div className="space-y-2">
                  <Label>Payment Instructions</Label>
                  <div className="p-3 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    <p>After submitting, pay the total wager in-game. The house will confirm your payment and roll the dice for you.</p>
                    <code className="block bg-background/50 p-2 rounded-md mt-2 text-center text-foreground break-all">
                      /pay lolerdabest69 {totalWager.toFixed(2)}
                    </code>
                  </div>
              </div>

              <SubmitButton />
            </form>
          </CardFooter>
        )}
      </Card>
  );
}
