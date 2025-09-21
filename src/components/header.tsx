import Link from 'next/link';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="py-4 border-b border-white/10">
      <div className="container mx-auto flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo />
          <h1 className="text-2xl font-bold font-headline tracking-tighter text-foreground group-hover:text-accent transition-colors">
            MineMarket
          </h1>
        </Link>
      </div>
    </header>
  );
}
