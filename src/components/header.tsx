import Link from 'next/link';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="py-6 border-b sticky top-0 bg-background/80 backdrop-blur-lg z-10">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <Link href="/" className="flex items-center gap-4 group">
          <Logo className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Loler's Hustle
          </h1>
        </Link>
      </div>
    </header>
  );
}