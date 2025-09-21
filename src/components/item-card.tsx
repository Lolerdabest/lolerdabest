'use client';

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
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
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
