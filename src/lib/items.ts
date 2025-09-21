import type { Item } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { enchantments } from './enchantments';

const itemDetails: { [key: string]: { name: string; price: number, type: 'tool' | 'armor' | 'item' } } = {
  'diamond-sword': { name: 'Diamond Sword', price: 2.50, type: 'tool' },
  'netherite-ingot': { name: 'Netherite Ingot', price: 5.00, type: 'item' },
  'elytra': { name: 'Elytra', price: 7.00, type: 'item' },
  'totem-of-undying': { name: 'Totem of Undying', price: 3.00, type: 'item' },
  'enchanted-golden-apple': { name: 'Enchanted Golden Apple', price: 4.50, type: 'item' },
  'shulker-box': { name: 'Shulker Box', price: 1.50, type: 'item' },
  'beacon': { name: 'Beacon', price: 10.00, type: 'item' },
  'trident': { name: 'Trident', price: 6.00, type: 'tool' },
  'netherite-sword': { name: 'Netherite Sword', price: 8.00, type: 'tool' },
  'netherite-pickaxe': { name: 'Netherite Pickaxe', price: 8.00, type: 'tool' },
  'netherite-axe': { name: 'Netherite Axe', price: 8.00, type: 'tool' },
  'netherite-shovel': { name: 'Netherite Shovel', price: 5.00, type: 'tool' },
  'netherite-hoe': { name: 'Netherite Hoe', price: 4.00, type: 'tool' },
  'netherite-helmet': { name: 'Netherite Helmet', price: 10.00, type: 'armor' },
  'netherite-chestplate': { name: 'Netherite Chestplate', price: 15.00, type: 'armor' },
  'netherite-leggings': { name: 'Netherite Leggings', price: 12.00, type: 'armor' },
  'netherite-boots': { name: 'Netherite Boots', price: 10.00, type: 'armor' },
};

export const items: Item[] = PlaceHolderImages.map((placeholder) => {
  const details = itemDetails[placeholder.id] || { name: 'Unknown Item', price: 0, type: 'item' };
  const nameParts = placeholder.description.split(/, (.+)/);
  
  let availableEnchantments: string[] = [];
  if (details.type === 'tool') {
    availableEnchantments = enchantments.tool;
  } else if (details.type === 'armor') {
    availableEnchantments = enchantments.armor;
  }
  
  if (details.name.toLowerCase().includes('sword') || details.name.toLowerCase().includes('trident') || details.name.toLowerCase().includes('axe')) {
    availableEnchantments = [...new Set([...availableEnchantments, ...enchantments.weapon])];
  }
  if (details.name.toLowerCase().includes('boots')) {
    availableEnchantments = [...new Set([...enchantments.armor, ...enchantments.boots])];
  }
  if (details.name.toLowerCase().includes('elytra')) {
    availableEnchantments = [...new Set([...availableEnchantments, ...enchantments.elytra])];
  }


  return {
    id: placeholder.id,
    name: details.name,
    price: details.price,
    image: placeholder.imageUrl,
    imageHint: placeholder.imageHint,
    description: nameParts[1] || placeholder.description,
    enchantments: availableEnchantments,
  };
}).filter(item => item.price > 0);
