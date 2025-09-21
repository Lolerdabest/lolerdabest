
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
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

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

const numberToRoman = (num: number): string => {
  const romanMap: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (const key in romanMap) {
    while (num >= romanMap[key]) {
      roman += key;
      num -= romanMap[key];
    }
  }
  return roman;
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
  const { toast } = useToast();
  const [selectedEnchantments, setSelectedEnchantments] = useState<Enchantment[]>([]);
  const [selectedExclusiveEnchantments, setSelectedExclusiveEnchantments] = useState<{ [group: string]: Enchantment }>({});
  const [upgradeToNetherite, setUpgradeToNetherite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const currentPrice = useMemo(() => {
    let newPrice = item.price;
    const allSelected = [...selectedEnchantments, ...Object.values(selectedExclusiveEnchantments)];
    allSelected.forEach(enchantment => {
      newPrice += enchantment.cost;
    });
    if (upgradeToNetherite) {
      newPrice += 150;
    }
    return newPrice;
  }, [item.price, selectedEnchantments, selectedExclusiveEnchantments, upgradeToNetherite]);

  const allEnchantmentOptions = useMemo(() =>
    item.enchantments.map(parseEnchantment).filter((e): e is Enchantment => e !== null),
    [item.enchantments]
  );
  
  const { exclusiveGroups, nonExclusiveEnchantments } = useMemo(() => {
    const exclusive: { groupName: string; enchantments: Enchantment[] }[] = Object.entries(exclusiveEnchantmentGroups).map(([groupName, enchantmentsInGroup]) => {
        const groupEnchantments = allEnchantmentOptions.filter(opt =>
            enchantmentsInGroup.some(enchantmentString => {
                const parts = enchantmentString.split(' ');
                parts.pop(); // remove level
                const name = parts.join(' ');
                return opt.name === name;
            })
        ).filter(opt => enchantmentsInGroup.includes(`${opt.name} ${numberToRoman(opt.level)}`));

        return { groupName, enchantments: groupEnchantments };
    }).filter(g => g.enchantments.length > 0);

    const allExclusiveEnchantmentStrings = Object.values(exclusiveEnchantmentGroups).flat();
    const nonExclusive = allEnchantmentOptions.filter(opt => 
        !allExclusiveEnchantmentStrings.includes(`${opt.name} ${numberToRoman(opt.level)}`)
    );
    
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

    addToCart(finalItem, allSelected, quantity);
    toast({
      title: 'Added to cart!',
      description: `${quantity}x "${finalItem.name}" has been added to your cart.`,
    });
  };
  
  const handleEnchantmentChange = (checked: boolean, enchantment: Enchantment) => {
    setSelectedEnchantments(prev =>
      checked ? [...prev, enchantment] : prev.filter(e => e.name !== enchantment.name)
    );
  };
  
  const handleExclusiveEnchantmentChange = (groupName: string, enchantmentValue: string) => {
    const parts = enchantmentValue.split(' ');
    const levelRoman = parts.pop();
    const name = parts.join(' ');
    const level = romanToNumber(levelRoman || 'I');

    const enchantment = allEnchantmentOptions.find(e => e.name === name && e.level === level);
    
    if (enchantment) {
      setSelectedExclusiveEnchantments(prev => ({
        ...prev,
        [groupName]: enchantment
      }));
    }
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
            <p className="text-lg font-bold text-primary mb-4">R${(currentPrice * quantity).toFixed(2)}</p>

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
                        {group.enchantments.map(enchantment => {
                          const value = `${enchantment.name} ${numberToRoman(enchantment.level)}`;
                          return (
                          <div key={value} className="flex items-center space-x-3">
                            <RadioGroupItem value={value} id={`${item.id}-${group.groupName}-${value}`} />
                            <Label htmlFor={`${item.id}-${group.groupName}-${value}`} className="cursor-pointer text-xs">
                              {enchantment.name} {numberToRoman(enchantment.level)} (+R${enchantment.cost.toFixed(2)})
                            </Label>
                          </div>
                        )})}
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
                                {enchantment.name} {numberToRoman(enchantment.level)} (+R${enchantment.cost.toFixed(2)})
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

    