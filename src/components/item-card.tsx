'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState, useMemo, useEffect } from 'react';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { exclusiveEnchantmentGroups } from '@/lib/enchantments';

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
  const [selectedExclusiveEnchantments, setSelectedExclusiveEnchantments] = useState<{ [group: string]: Enchantment }>({});
  const [upgradeToNetherite, setUpgradeToNetherite] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(item.price);

  useEffect(() => {
    let newPrice = item.price;
    const allSelected = [...selectedEnchantments, ...Object.values(selectedExclusiveEnchantments)];
    allSelected.forEach(enchantment => {
      newPrice += enchantment.cost;
    });
    if (upgradeToNetherite) {
      newPrice += 150;
    }
    setCurrentPrice(newPrice);
  }, [item.price, selectedEnchantments, selectedExclusiveEnchantments, upgradeToNetherite]);

  const allEnchantmentOptions = useMemo(() =>
    item.enchantments.map(parseEnchantment).filter((e): e is Enchantment => e !== null),
    [item.enchantments]
  );
  
  const { exclusiveGroups, nonExclusiveEnchantments } = useMemo(() => {
    const exclusive = Object.entries(exclusiveEnchantmentGroups).map(([groupName, enchantments]) => {
      const groupEnchantments = allEnchantmentOptions.filter(opt => enchantments.includes(`${opt.name} ${Object.keys(romanMap).find(key => romanMap[key] === opt.level)}`));
      return { groupName, enchantments: groupEnchantments };
    }).filter(g => g.enchantments.length > 0);

    const allExclusiveEnchantmentNames = Object.values(exclusiveEnchantmentGroups).flat();
    const nonExclusive = allEnchantmentOptions.filter(opt => !allExclusiveEnchantmentNames.includes(`${opt.name} ${Object.keys(romanMap).find(key => romanMap[key] === opt.level)}`));
    
    return { exclusiveGroups: exclusive, nonExclusiveEnchantments: nonExclusive };
  }, [allEnchantmentOptions]);


  const descriptiveEnchantments = useMemo(() =>
    item.enchantments.filter(e => e.startsWith('Full') || e.startsWith('All items')),
    [item.enchantments]
  );
  
  const handleAddToCart = () => {
    let finalItem = { ...item };
    const allSelected = [...selectedEnchantments, ...Object.values(selectedExclusiveEnchantments)];

    if (upgradeToNetherite) {
      finalItem.name = `Netherite ${item.name.split(' ').slice(1).join(' ')}`;
    }
    // Price is already calculated, so we just pass it along
    finalItem.price = currentPrice;

    addToCart(finalItem, allSelected, 1);
  };
  
  const handleEnchantmentChange = (checked: boolean, enchantment: Enchantment) => {
    setSelectedEnchantments(prev =>
      checked ? [...prev, enchantment] : prev.filter(e => e.name !== enchantment.name)
    );
  };
  
  const handleExclusiveEnchantmentChange = (groupName: string, enchantmentName: string) => {
    const enchantment = allEnchantmentOptions.find(e => e.name === enchantmentName.split(' ').slice(0, -1).join(' '));
    if (enchantment) {
      setSelectedExclusiveEnchantments(prev => ({
        ...prev,
        [groupName]: enchantment
      }));
    }
  };

  const isKit = item.id === 'maxed-netherite-kit';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border-border hover:border-primary bg-card group">
      <CardContent className="p-6 flex flex-col items-center gap-4 text-center flex-1">
        <div className="w-full flex flex-col flex-1">
            <h2 className="text-xl font-bold font-headline min-h-[56px] flex items-center justify-center">{item.name}</h2>
            <p className="text-lg font-bold text-primary mb-4">R${currentPrice.toFixed(2)}</p>

            <Separator className="my-2 bg-border"/>

            <div className="w-full space-y-3 text-left text-sm flex-1 max-h-60 overflow-y-auto pr-2">
              {isKit ? (
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {descriptiveEnchantments.map(desc => <li key={desc}>{desc}</li>)}
                </ul>
              ) : (
                <>
                  {exclusiveGroups.map(group => (
                    <div key={group.groupName} className="p-3 rounded-md border border-dashed border-primary/50 space-y-2">
                       <RadioGroup onValueChange={(value) => handleExclusiveEnchantmentChange(group.groupName, value)}>
                        {group.enchantments.map(enchantment => (
                          <div key={enchantment.name} className="flex items-center space-x-3">
                            <RadioGroupItem value={`${enchantment.name} ${enchantment.level}`} id={`${item.id}-${group.groupName}-${enchantment.name}`} />
                            <Label htmlFor={`${item.id}-${group.groupName}-${enchantment.name}`} className="cursor-pointer text-xs">
                              {enchantment.name} {enchantment.level} (+R${enchantment.cost.toFixed(2)})
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  {nonExclusiveEnchantments.length > 0 && 
                    <div className="space-y-3 pt-2">
                      {nonExclusiveEnchantments.map(enchantment => (
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

const romanMap: { [key: string]: number } = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
