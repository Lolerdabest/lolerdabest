import Link from 'next/link';
import { Swords } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="p-3 bg-primary/10 border-2 border-primary rounded-full">
            <Swords className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors animate-text-glow">
            MineMarket
          </h1>
        </Link>
        <p className="text-sm text-primary/80 font-medium tracking-wider">
          Your one-stop shop for Minecraft dominance.
        </p>
      </div>
    </header>
  );
}
