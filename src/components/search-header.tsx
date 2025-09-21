
'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (term: string) => void;
}

export function SearchHeader({ onSearch }: SearchHeaderProps) {
  return (
    <header className="py-3 border-b fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-20">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="group">
          <h1 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors font-headline">
            Loler's Hustle
          </h1>
        </Link>
        <div className="relative w-full max-w-sm">
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
