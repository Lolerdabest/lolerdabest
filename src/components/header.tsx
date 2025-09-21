import Link from 'next/link';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="py-6 border-b border-white/10">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <Link href="/" className="flex flex-col items-center gap-2 group">
          <Logo />
          <h1 className="text-4xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
            Enchanted Arsenal
          </h1>
        </Link>
      </div>
    </header>
  );
}
