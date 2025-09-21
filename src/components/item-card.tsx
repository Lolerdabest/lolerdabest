
'use client';

import type { Item, Enchantment } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState, useMemo } from 'react';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { parseEnchantment, processEnchantments } from '@/lib/enchantment-utils';
import { numberToRoman } from '@/lib/roman-utils';


export function ItemCard({ item }: { item: Item }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedEnchantments, setSelectedEnchantments] = useState<Enchantment[]>([]);
  const [selectedExclusiveEnchantments, setSelectedExclusiveEnchantments] = useState<{ [group: string]: Enchantment }>({});
  const [upgradeToNetherite, setUpgradeToNetherite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const allEnchantmentOptions = useMemo(() =>
    item.enchantments.map(parseEnchantment).filter((e): e is Enchantment => e !== null),
    [item.enchantments]
  );
  
  const { exclusiveGroups, nonExclusiveEnchantments } = useMemo(() => {
    return processEnchantments(allEnchantmentOptions);
  }, [allEnchantmentOptions]);

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
    const enchantment = allEnchantmentOptions.find(e => `${e.name} ${numberToRoman(e.level)}` === enchantmentValue);
    
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

    