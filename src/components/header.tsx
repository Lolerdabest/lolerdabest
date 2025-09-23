import Link from 'next/link';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="py-6 border-b border-primary/20">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-4 group">
          <Logo className="w-12 h-12" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors animate-text-glow">
            Loler's Gambling House
          </h1>
        </Link>
        <p className="text-sm text-primary/80 font-medium tracking-wider">
          Place your bets. Win big. Get paid.
        </p>
      </div>
    </header>
  );
}
