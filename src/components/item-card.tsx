'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

export function ItemCard({ item }: { item: Item }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  const descriptiveEnchantments = useMemo(() =>
    item.enchantments.filter(e => e.startsWith('Full') || e.startsWith('All items')),
    [item.enchantments]
  );
  
  const handleAddToCart = () => {
    // Since enchantments are not selectable, an empty array is passed.
    const selectedEnchantments: Enchantment[] = [];
    addToCart(item, selectedEnchantments, quantity);
    toast({
      title: 'Added to cart!',
      description: `${quantity}x "${item.name}" has been added to your cart.`,
    });
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const isKit = item.id === 'maxed-netherite-kit';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-border hover:border-primary bg-card group">
      <CardContent className="p-6 flex flex-col items-center gap-4 text-center flex-1">
        <div className="w-full flex flex-col flex-1">
            <h2 className="text-lg font-bold font-headline min-h-[56px] flex items-center justify-center animate-text-glow">{item.name}</h2>
            <p className="text-lg font-bold text-primary mb-4">R${(item.price * quantity).toFixed(2)}</p>

            <Separator className="my-2 bg-border"/>

            <div className="w-full space-y-3 text-left text-sm flex-1 max-h-60 overflow-y-auto pr-2">
              {isKit && (
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {descriptiveEnchantments.map(desc => <li key={desc}>{desc}</li>)}
                </ul>
              )}
              {!isKit && item.enchantments.length > 0 && (
                <p className="text-muted-foreground text-center">This item can be enchanted. Contact us for custom orders.</p>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-auto pt-4">
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
