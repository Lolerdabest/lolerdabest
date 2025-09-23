
'use client';
import { Header } from '@/components/header';
import { BetSlip } from '@/components/bet-slip';
import { BetProvider } from '@/context/bet-provider';
import CoinflipGame from '@/components/coinflip-game';
import MinesGame from '@/components/mines-game';

export default function Home() {
  return (
    <BetProvider>
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-12">
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
