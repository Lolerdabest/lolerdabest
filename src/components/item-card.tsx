'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState, useMemo, useEffect } from 'react';
import { Separator } from './ui/separator';

interface ItemCardProps {
  item: Item;
}

const romanToNumber = (roman: string): number => {
  const romanMap: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
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
  return { name, level, cost: 180 }; // Example cost
};

export function ItemCard({ item }: ItemCardProps) {
  const { addToCart } = useCart();
  const [selectedEnchantments, setSelectedEnchantments] = useState<Enchantment[]>([]);
  const [upgradeToNetherite, setUpgradeToNetherite] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(item.price);

  useEffect(() => {
    let newPrice = item.price;
    selectedEnchantments.forEach(enchantment => {
      newPrice += enchantment.cost;
    });
    if (upgradeToNetherite) {
      newPrice += 150;
    }
    setCurrentPrice(newPrice);
  }, [item.price, selectedEnchantments, upgradeToNetherite]);

  const allEnchantmentOptions = useMemo(() =>
    item.enchantments.map(parseEnchantment),
    [item.enchantments]
  );
  
  const handleAddToCart = () => {
    let finalItem = { ...item };
    if (upgradeToNetherite) {
      finalItem.name = `Netherite ${item.name.split(' ').slice(1).join(' ')}`;
      finalItem.price = currentPrice; // Use the calculated price
    }

    addToCart(finalItem, selectedEnchantments, 1);
  };
  
  const handleEnchantmentChange = (checked: boolean, enchantment: Enchantment) => {
    setSelectedEnchantments(prev =>
      checked ? [...prev, enchantment] : prev.filter(e => e.name !== enchantment.name)
    );
  };

  const Icon = item.icon || 'H';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-2 border-primary/20 hover:border-primary bg-card/80 backdrop-blur-sm p-6">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div 
          className="w-16 h-16 flex items-center justify-center text-4xl font-bold text-primary" 
          style={{ textShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))' }}
        >
          {Icon}
        </div>
        <h2 className="text-3xl tracking-widest">{item.name}</h2>
        <p className="text-2xl text-accent font-bold">R${currentPrice.toFixed(2)}</p>

        <Separator className="my-2 bg-primary/20"/>

        <div className="w-full space-y-4 text-left text-lg tracking-wider">
          {allEnchantmentOptions.map(enchantment => (
            <div key={enchantment.name} className="flex items-center space-x-3">
              <Checkbox
                id={`${item.id}-${enchantment.name}`}
                onCheckedChange={(checked) => handleEnchantmentChange(checked as boolean, enchantment)}
                checked={selectedEnchantments.some(e => e.name === enchantment.name)}
              />
              <Label htmlFor={`${item.id}-${enchantment.name}`} className="cursor-pointer">
                {enchantment.name} {enchantment.level} (+R${enchantment.cost.toFixed(2)})
              </Label>
            </div>
          ))}

          {item.canUpgradeToNetherite && (
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`${item.id}-netherite`}
                  onCheckedChange={(checked) => setUpgradeToNetherite(checked as boolean)}
                  checked={upgradeToNetherite}
                />
                <Label htmlFor={`${item.id}-netherite`} className="cursor-pointer">
                  Upgrade to Netherite (+R$150.00)
                </Label>
              </div>
            )}
        </div>

        <Button onClick={handleAddToCart} className="w-full font-bold text-xl py-6 mt-4">
          ADD TO CART
        </Button>
      </CardContent>
    </Card>
  );
}
