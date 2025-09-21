'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useMemo, useCallback } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  getApplicableEnchantments,
  getExclusiveGroups,
  parseEnchantment,
  formatEnchantment,
} from '@/lib/enchantment-utils';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';

export function ItemCard({ item }: { item: Item }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedEnchantments, setSelectedEnchantments] = useState<Enchantment[]>([]);

  const applicableEnchantments = useMemo(() => getApplicableEnchantments(item), [item]);
  const exclusiveGroups = useMemo(() => getExclusiveGroups(item), [item]);

  const allEnchantmentOptions = useMemo(() => {
    return applicableEnchantments.map(e => parseEnchantment(e)).filter(Boolean) as Enchantment[];
  }, [applicableEnchantments]);
  
  const nonExclusiveEnchantments = useMemo(() => {
    const allExclusiveNames = new Set(exclusiveGroups.flat());
    return allEnchantmentOptions.filter(e => !allExclusiveNames.has(e.name));
  }, [allEnchantmentOptions, exclusiveGroups]);

  const handleEnchantmentChange = useCallback((enchantment: Enchantment, checked: boolean) => {
    setSelectedEnchantments(prev => {
      if (checked) {
        return [...prev, enchantment];
      } else {
        return prev.filter(e => e.name !== enchantment.name);
      }
    });
  }, []);

  const handleExclusiveEnchantmentChange = useCallback((group: string[], value: string) => {
    const newEnchantment = parseEnchantment(value);
    if (!newEnchantment) return;

    setSelectedEnchantments(prev => {
      // Remove any other enchantments from the same exclusive group
      const filtered = prev.filter(e => !group.includes(e.name));
      // Add the new one
      return [...filtered, newEnchantment];
    });
  }, []);

  const enchantmentCost = selectedEnchantments.length * 200;
  const totalPrice = (item.price + enchantmentCost) * quantity;
  
  const handleAddToCart = () => {
    addToCart(item, selectedEnchantments, quantity);
    toast({
      title: 'Added to cart!',
      description: `${quantity}x "${item.name}" has been added to your cart.`,
    });
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const isEnchantable = applicableEnchantments.length > 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-border hover:border-primary/50 bg-card group">
      <div className="relative w-full h-20 animated-gradient overflow-hidden flex items-center justify-center p-4">
        <p className="font-headline text-xs text-primary text-center animate-text-glow break-words">
          {item.name}
        </p>
      </div>
      <CardContent className="p-4 flex flex-col items-center gap-2 text-center flex-1">
        <div className="w-full flex flex-col flex-1">
          <h2 className="text-md font-bold font-headline min-h-[40px] flex items-center justify-center leading-tight">
            {item.name}
          </h2>
          
          {isEnchantable && (
            <div className="text-left text-xs mb-4 space-y-4">
               <Separator />
               {exclusiveGroups.map((group, index) => (
                <div key={index}>
                    <Label className="font-bold mb-2 block">Choose one:</Label>
                    <RadioGroup onValueChange={(value) => handleExclusiveEnchantmentChange(group, value)}>
                        {group.map(name => {
                            const enchantmentString = applicableEnchantments.find(e => e.startsWith(name)) || name;
                            return (
                                <div key={name} className="flex items-center space-x-2">
                                    <RadioGroupItem value={enchantmentString} id={`${item.id}-${name}`} />
                                    <Label htmlFor={`${item.id}-${name}`}>{enchantmentString}</Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
               ))}
              {nonExclusiveEnchantments.length > 0 && (
                <div>
                   <Label className="font-bold mb-2 block">Add extras:</Label>
                  <div className="space-y-2">
                    {nonExclusiveEnchantments.map(enchant => (
                      <div key={enchant.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-${enchant.name}`}
                          onCheckedChange={(checked) => handleEnchantmentChange(enchant, !!checked)}
                        />
                        <Label htmlFor={`${item.id}-${enchant.name}`}>{formatEnchantment(enchant)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
               <Separator />
            </div>
          )}

          <p className="text-lg font-bold text-primary mb-2 mt-auto">R${totalPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground flex-1 mb-4 min-h-[20px]">{item.description}</p>
            
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
