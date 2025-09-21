'use client';

import Image from 'next/image';
import type { Item } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10">
      <CardHeader>
        <div className="aspect-square relative rounded-md overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover image-rendering-pixelated"
            data-ai-hint={item.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-xl font-headline">{item.name}</CardTitle>
        <p className="text-muted-foreground mt-2 text-2xl font-bold font-mono">
          ${item.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full font-bold" onClick={() => addToCart(item)}>
          <Package className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
