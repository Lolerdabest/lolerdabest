'use client';

import type { Item } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export function ItemCard({ item }: { item: Item }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(item, [], quantity);
    toast({
      title: 'Added to cart!',
      description: `${quantity}x "${item.name}" has been added to your cart.`,
    });
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const totalPrice = item.price * quantity;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-border hover:border-primary/50 bg-card group">
      <div className="relative w-full h-48 bg-muted overflow-hidden flex items-center justify-center p-4">
        <p className="font-headline text-lg text-primary text-center animate-text-glow break-words">
          {item.name}
        </p>
      </div>
      <CardContent className="p-4 flex flex-col items-center gap-2 text-center flex-1">
        <div className="w-full flex flex-col flex-1">
          <h2 className="text-md font-bold font-headline min-h-[40px] flex items-center justify-center leading-tight">
            {item.name}
          </h2>
          <p className="text-lg font-bold text-primary mb-2">R${totalPrice.toFixed(2)}</p>

          <p className="text-xs text-muted-foreground flex-1 mb-4 min-h-[48px]">{item.description}</p>
            
          <div className="flex items-center justify-center gap-2 mt-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(-1)}><MinusCircle /></Button>
            <Input
              type="number"
              className="w-16 h-10 text-center font-bold text-lg"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(1)}><PlusCircle /></Button>
          </div>

          <Button onClick={handleAddToCart} className="w-full font-bold text-lg py-6 mt-4">
            ADD TO CART
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
