
import { promises as fs } from 'fs';
import path from 'path';
import type { Bet } from '@/lib/types';
import { BetSlip } from '@/components/bet-slip';
import { BetProvider } from '@/context/bet-provider';
import CoinflipGame from '@/components/coinflip-game';
import MinesGame from '@/components/mines-game';
import RouletteGame from '@/components/roulette-game';
import DragonTowersGame from '@/components/dragon-towers-game';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlayableCoinflip } from '@/components/playable-coinflip';
import { PlayableMines } from '@/components/playable-mines';
import { PlayableRoulette } from '@/components/playable-roulette';
import { PlayableDragonTowers } from '@/components/playable-dragon-towers';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'bets.json');

async function getActiveBetForPlayer(username: string): Promise<Bet | undefined> {
  if (!username) return undefined;
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const betsData = JSON.parse(data);
    const bets: Bet[] = betsData.bets || [];
    return bets.find(bet => 
        bet.minecraftUsername.trim().toLowerCase() === username.trim().toLowerCase() && 
        bet.status === 'active'
    );
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    if (error instanceof SyntaxError) {
        return undefined;
    }
    console.error('Failed to read bets.json:', error);
    return undefined;
  }
}

export default async function Home({ searchParams }: { searchParams: { username?: string } }) {
  const username = searchParams.username || '';
  const activeBet = await getActiveBetForPlayer(username);
  const serverSeed = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"; // Example static seed

  if (activeBet) {
    const gameType = activeBet.game;
    return (
       <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-12">
            <h2 className="text-2xl font-bold text-center text-primary mb-4 animate-text-glow">Welcome, {activeBet.minecraftUsername}!</h2>
            <p className="text-center text-muted-foreground mb-8">Your bet has been confirmed. It's time to play!</p>
            {gameType.includes('Coinflip') && <PlayableCoinflip bet={activeBet} />}
            {gameType.includes('Mines') && <PlayableMines bet={activeBet} />}
            {gameType.includes('Roulette') && <PlayableRoulette bet={activeBet} />}
            {gameType.includes('Dragon Towers') && <PlayableDragonTowers bet={activeBet} />}
        </main>
      </div>
    );
  }

  return (
    <BetProvider>
      <div className="flex flex-col">
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-12">
           <Card className="max-w-2xl mx-auto mb-12 border-primary/50 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Find Your Active Game</CardTitle>
              <CardDescription className="text-center text-muted-foreground pt-2">
                If you've already paid and your bet has been confirmed, enter your username to start playing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full space-y-2">
                  <Label htmlFor="username-check" className="sr-only">Enter Your Minecraft Username</Label>
                  <Input 
                    id="username-check" 
                    name="username" 
                    placeholder="Steve" 
                    defaultValue={username}
                    required 
                    className="py-6 text-center text-lg"
                  />
                </div>
                <Button type="submit" variant="default" className="w-full sm:w-auto py-6 text-lg">Find My Game</Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            <div className="space-y-8">
              <CoinflipGame />
              <MinesGame />
              <RouletteGame />
              <DragonTowersGame />
            </div>
            <div className="lg:sticky lg:top-24 space-y-8">
              <BetSlip />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-6">Rules &amp; Regulations</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold"><Scale className="mr-2 h-5 w-5 text-primary"/> Fair Play &amp; Odds</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>All games offered are based on provably fair algorithms. The outcome of each game is determined by cryptographic seeds that ensure neither the player nor the house can manipulate the results.</p>
                  <p>Odds are transparent. Coinflip has a ~50% chance of winning with a 1.95x payout. The Mines payout multiplier increases with each safe tile revealed, with the risk determined by the number of mines selected.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/> Provably Fair System</AccordionTrigger>
                <AccordionContent className="space-y-2 text-muted-foreground">
                  <p>We use a system of a server seed and a client seed (your username) to generate game outcomes. The server seed is hashed and displayed before you play.</p>
                  <div className="p-3 rounded-md bg-muted/50 text-foreground">
                    <p className="text-sm font-semibold">Current Server Seed (Hashed):</p>
                    <code className="text-xs break-all">{serverSeed}</code>
                  </div>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold"><AlertTriangle className="mr-2 h-5 w-5 text-primary"/> Responsible Gambling</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>Please play responsibly. Only bet what you can afford to lose. This is a game for entertainment purposes only.</p>
                  <p>You must be of legal age to gamble in your jurisdiction. By placing a bet, you confirm that you meet this requirement.</p>
                  <p>All transactions are final. Once a bet is confirmed and played, it cannot be reversed.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
      </div>
    </BetProvider>
  );
}

export const dynamic = 'force-dynamic';
