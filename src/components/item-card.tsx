'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState, useMemo, useEffect } from 'react';
import { Separator } from './ui/separator';
import Image from 'next/image';

interface ItemCardProps {
  item: Item;
}

const romanToNumber = (roman: string): number => {
  if (!roman || typeof roman !== 'string') return 1;
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

const parseEnchantment = (enchantmentString: string): Enchantment | null => {
  if (enchantmentString.startsWith('Full') || enchantmentString.startsWith('All items')) {
    return null;
  }
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
    item.enchantments.map(parseEnchantment).filter((e): e is Enchantment => e !== null),
    [item.enchantments]
  );

  const descriptiveEnchantments = useMemo(() =>
    item.enchantments.filter(e => e.startsWith('Full') || e.startsWith('All items')),
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
  const isKit = item.id === 'maxed-netherite-kit';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-border hover:border-primary bg-card group">
      <CardContent className="p-6 flex flex-col items-center gap-4 text-center flex-1">
        <div className="relative w-full aspect-square bg-muted/30 rounded-md overflow-hidden">
        {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform pixelated"
              data-ai-hint={item.imageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary" 
              style={{ textShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))' }}
            >
              {Icon}
            </div>
          )}
        </div>
        
        <div className="w-full flex flex-col flex-1">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-lg font-bold text-primary mb-4">R${currentPrice.toFixed(2)}</p>

            <Separator className="my-2 bg-border"/>

            <div className="w-full space-y-3 text-left text-sm flex-1">
              {isKit ? (
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {descriptiveEnchantments.map(desc => <li key={desc}>{desc}</li>)}
                </ul>
              ) : (
                <>
                  {allEnchantmentOptions.length > 0 && 
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {allEnchantmentOptions.map(enchantment => (
                        <div key={enchantment.name} className="flex items-center space-x-3">
                        <Checkbox
                            id={`${item.id}-${enchantment.name}`}
                            onCheckedChange={(checked) => handleEnchantmentChange(checked as boolean, enchantment)}
                            checked={selectedEnchantments.some(e => e.name === enchantment.name)}
                        />
                        <Label htmlFor={`${item.id}-${enchantment.name}`} className="cursor-pointer text-xs">
                            {enchantment.name} {enchantment.level} (+R${enchantment.cost.toFixed(2)})
                        </Label>
                        </div>
                    ))}
                    </div>
                  }

                  {item.canUpgradeToNetherite && (
                      <div className="flex items-center space-x-3 pt-2 border-t border-border">
                        <Checkbox
                          id={`${item.id}-netherite`}
                          onCheckedChange={(checked) => setUpgradeToNetherite(checked as boolean)}
                          checked={upgradeToNetherite}
                        />
                        <Label htmlFor={`${item.id}-netherite`} className="cursor-pointer text-xs">
                          Upgrade to Netherite (+R$150.00)
                        </Label>
                      </div>
                    )}
                </>
              )}
            </div>

            <Button onClick={handleAddToCart} className="w-full font-bold text-lg py-6 mt-4">
              ADD TO CART
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
