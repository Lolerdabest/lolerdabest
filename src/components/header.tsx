
import Link from 'next/link';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="p-3 bg-card border-2 border-border rounded-full">
            <Logo className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
            Curated
          </h1>
        </Link>
        <p className="text-sm text-muted-foreground font-medium tracking-wider">
          Curated games for you.
        </p>
      </div>
    </header>
  );
}
