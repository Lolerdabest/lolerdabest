import type { Item } from './types';
import { PlaceHolderImages } from './placeholder-images';

const itemDetails: { [key: string]: { name: string; price: number } } = {
  'diamond-sword': { name: 'Diamond Sword', price: 2.50 },
  'netherite-ingot': { name: 'Netherite Ingot', price: 5.00 },
  'elytra': { name: 'Elytra', price: 7.00 },
  'totem-of-undying': { name: 'Totem of Undying', price: 3.00 },
  'enchanted-golden-apple': { name: 'Enchanted Golden Apple', price: 4.50 },
  'shulker-box': { name: 'Shulker Box', price: 1.50 },
  'beacon': { name: 'Beacon', price: 10.00 },
  'trident': { name: 'Trident', price: 6.00 },
};

export const items: Item[] = PlaceHolderImages.map((placeholder) => {
  const details = itemDetails[placeholder.id] || { name: 'Unknown Item', price: 0 };
  const nameParts = placeholder.description.split(/, (.+)/);
  return {
    id: placeholder.id,
    name: details.name,
    price: details.price,
    image: placeholder.imageUrl,
    imageHint: placeholder.imageHint,
    description: nameParts[1] || placeholder.description
  };
}).filter(item => item.price > 0);
