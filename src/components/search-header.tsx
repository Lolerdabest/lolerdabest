
'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (term: string) => void;
}

export function SearchHeader({ onSearch }: SearchHeaderProps) {
  return (
    <header className="py-4 border-b fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-20">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center justify-center gap-4">
           <Link href="/" className="flex items-center gap-4 group">
              <Logo className="w-10 h-10" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Loler's Hustle
              </h1>
            </Link>
        </div>
        <p 
          className="text-xs text-primary/80 font-medium tracking-wider"
          style={{ textShadow: '0 0 8px hsl(var(--primary) / 0.5)' }}
        >
          Crystal-Smooth Delivery, In-Game & Instantly
        </p>
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for items..."
              className="pl-10 w-full"
              onChange={(e) => onSearch(e.target.value)}
            />
        </div>
      </div>
    </header>
  );
}
