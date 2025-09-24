
import { promises as fs } from 'fs';
import path from 'path';
import type { Bet } from '@/lib/types';
import { Header } from '@/components/header';
import { BetSlip } from '@/components/bet-slip';
import { BetProvider } from '@/context/bet-provider';
import CoinflipGame from '@/components/coinflip-game';
import MinesGame from '@/components/mines-game';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlayableCoinflip } from '@/components/playable-coinflip';
import { PlayableMines } from '@/components/playable-mines';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'bets.json');

async function getActiveBetForPlayer(username: string): Promise<Bet | undefined> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const bets: Bet[] = JSON.parse(data).bets || [];
    // Find the first active bet for the player, case-insensitive and trimming whitespace
    return bets.find(bet => 
        bet.minecraftUsername.trim().toLowerCase() === username.trim().toLowerCase() && 
        bet.status === 'active'
    );
  } catch (error) {
    console.error('Failed to read bets.json:', error);
    return undefined;
  }
}

export default async function Home({ searchParams }: { searchParams: { username?: string } }) {
  const username = searchParams.username || '';
  const activeBet = await getActiveBetForPlayer(username);

  if (activeBet) {
    return (
       <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-12">
            <h2 className="text-2xl font-bold text-center text-primary mb-4">Welcome, {activeBet.minecraftUsername}!</h2>
            <p className="text-center text-muted-foreground mb-8">Your bet has been confirmed. It's time to play!</p>
            {activeBet.game === 'Coinflip' && <PlayableCoinflip bet={activeBet} />}
            {activeBet.game === 'Mines' && <PlayableMines bet={activeBet} />}
        </main>
      </div>
    );
  }

  return (
    <BetProvider>
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-12">
           <Card className="max-w-md mx-auto mb-8 border-primary/30">
            <CardHeader>
              <CardTitle>Find Your Active Game</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Enter Your Minecraft Username</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    placeholder="Steve" 
                    defaultValue={username}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Find My Game</Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            <div className="space-y-8">
              <CoinflipGame />
              <MinesGame />
            </div>
            <div className="lg:sticky lg:top-24 space-y-8">
              <BetSlip />
            </div>
          </div>
        </main>
      </div>
    </BetProvider>
  );
}

export const dynamic = 'force-dynamic';
