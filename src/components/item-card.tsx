'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MinusCircle, Package, PlusCircle, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface ItemCardProps {
  item: Item;
}

const romanToNumber = (roman: string): number => {
    const romanMap: { [key: string]: number } = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000,
    };
    let result = 0;
    for (let i = 0; i < roman.length; i++) {
        const current = romanMap[roman[i]];
        const next = romanMap[roman[i + 1]];
        if (next && current < next) {
            result -= current;
        } else {
            result += current;
        }
    }
    return result;
};


const parseEnchantment = (enchantmentString: string): Enchantment => {
  const parts = enchantmentString.split(' ');
  const levelRoman = parts.pop() || 'I';
  const level = romanToNumber(levelRoman);
  const name = parts.join(' ');
  return { name, level };
};

export function ItemCard({ item }: ItemCardProps) {
  const { addToCart } = useCart();
  const [selectedEnchantments, setSelectedEnchantments] = useState<Enchantment[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleEnchantmentChange = (checked: boolean, enchantment: Enchantment) => {
    setSelectedEnchantments(prev => {
      if (checked) {
        return [...prev, enchantment];
      } else {
        return prev.filter(e => e.name !== enchantment.name);
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(item, selectedEnchantments, quantity);
    setSelectedEnchantments([]);
    setQuantity(1);
    setIsOpen(false);
  };

  const enchantmentCost = selectedEnchantments.reduce((acc, ench) => acc + (0.5 * ench.level), 0);
  const totalItemPrice = (item.price + enchantmentCost) * quantity;

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
      <CardFooter className='gap-2'>
        {item.enchantments && item.enchantments.length > 0 ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full font-bold" variant="outline" onClick={() => { setSelectedEnchantments([]); setQuantity(1);}}>
                <Wand2 className="mr-2" />
                Enchant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enchant {item.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                {item.enchantments.map((enchantmentString) => {
                  const enchantment = parseEnchantment(enchantmentString);
                  return (
                    <div key={enchantment.name} className="flex items-center space-x-3">
                      <Checkbox
                        id={`${item.id}-${enchantment.name}`}
                        onCheckedChange={(checked) => handleEnchantmentChange(checked as boolean, enchantment)}
                        checked={selectedEnchantments.some(e => e.name === enchantment.name)}
                      />
                      <Label htmlFor={`${item.id}-${enchantment.name}`} className="flex-grow">
                        {enchantment.name} {enchantment.level} <Badge variant="secondary">+${(0.5 * enchantment.level).toFixed(2)}</Badge>
                      </Label>
                    </div>
                  );
                })}
              </div>
              <DialogFooter className="sm:justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}><MinusCircle className="h-5 w-5" /></Button>
                    <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)}><PlusCircle className="h-5 w-5" /></Button>
                  </div>
                <div className="font-bold text-lg text-right">
                  Total: ${totalItemPrice.toFixed(2)}
                </div>
                <Button onClick={handleAddToCart} className="font-bold">
                  <Package className="mr-2" />
                  Add to Cart
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="w-full font-bold" onClick={() => addToCart(item, [], 1)}>
            <Package className="mr-2" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
