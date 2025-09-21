import type { Item } from './types';
import { enchantments } from './enchantments';
import { PlaceHolderImages } from './placeholder-images';

const itemData: Omit<Item, 'description' | 'image' | 'imageHint'>[] = [
  // Full Kit
  {
    id: 'maxed-netherite-kit',
    name: 'Maxed Netherite Kit',
    price: 10000,
    enchantments: [
      'Full Netherite Armor (Helmet, Chestplate, Leggings, Boots)',
      'Full Netherite Tools (Sword, Pickaxe, Axe, Shovel)',
      'All items enchanted with the best compatible enchantments (e.g., Protection IV, Unbreaking III, Mending, Efficiency V, Sharpness V, etc.)'
    ],
    icon: 'K',
    canUpgradeToNetherite: false,
  },

  // Diamond Armor
  { id: 'diamond-helmet', name: 'Diamond Helmet', price: 150, enchantments: [...enchantments.armor, ...enchantments.helmet], icon: 'H', canUpgradeToNetherite: true },
  { id: 'diamond-chestplate', name: 'Diamond Chestplate', price: 250, enchantments: [...enchantments.armor], icon: 'C', canUpgradeToNetherite: true },
  { id: 'diamond-leggings', name: 'Diamond Leggings', price: 200, enchantments: [...enchantments.armor], icon: 'L', canUpgradeToNetherite: true },
  { id: 'diamond-boots', name: 'Diamond Boots', price: 150, enchantments: [...enchantments.armor, ...enchantments.boots], icon: 'B', canUpgradeToNetherite: true },
  
  // Diamond Tools
  { id: 'diamond-sword', name: 'Diamond Sword', price: 120, enchantments: [...enchantments.weapon], icon: 'S', canUpgradeToNetherite: true },
  { id: 'diamond-pickaxe', name: 'Diamond Pickaxe', price: 150, enchantments: [...enchantments.tool], icon: 'P', canUpgradeToNetherite: true },
  { id: 'diamond-axe', name: 'Diamond Axe', price: 150, enchantments: [...enchantments.tool, ...enchantments.weapon], icon: 'A', canUpgradeToNetherite: true },
  { id: 'diamond-shovel', name: 'Diamond Shovel', price: 80, enchantments: [...enchantments.tool], icon: 'S', canUpgradeToNetherite: true },

  // Netherite Items (Base, without upgrade cost)
  { id: 'netherite-helmet', name: 'Netherite Helmet', price: 300, enchantments: [...enchantments.armor, ...enchantments.helmet], icon: 'H' },
  { id: 'netherite-chestplate', name: 'Netherite Chestplate', price: 300, enchantments: [...enchantments.armor], icon: 'C' },
  { id: 'netherite-leggings', name: 'Netherite Leggings', price: 300, enchantments: [...enchantments.armor], icon: 'L' },
  { id: 'netherite-boots', name: 'Netherite Boots', price: 300, enchantments: [...enchantments.armor, ...enchantments.boots], icon: 'B' },
  { id: 'netherite-sword', name: 'Netherite Sword', price: 350, enchantments: [...enchantments.weapon], icon: 'S' },
  { id: 'netherite-pickaxe', name: 'Netherite Pickaxe', price: 400, enchantments: [...enchantments.tool], icon: 'P' },
  { id: 'netherite-axe', name: 'Netherite Axe', price: 400, enchantments: [...enchantments.tool, ...enchantments.weapon], icon: 'A' },
  { id: 'netherite-shovel', name: 'Netherite Shovel', price: 250, enchantments: [...enchantments.tool], icon: 'S' },
  
  // Other Items
  { id: 'elytra', name: 'Elytra', price: 1200, enchantments: enchantments.elytra, icon: 'E' },
  { id: 'totem-of-undying', name: 'Totem of Undying', price: 100, enchantments: [], icon: 'T' },
  { id: 'shulker-box', name: 'Shulker Box', price: 100, enchantments: [], icon: 'S' },
];

export const items: Item[] = itemData.map(item => {
  const placeholder = PlaceHolderImages.find(p => p.id === item.id);
  return {
    ...item,
    description: placeholder?.description || '', 
    image: placeholder?.imageUrl || '', 
    imageHint: placeholder?.imageHint || '',
    enchantments: [...new Set(item.enchantments)]
  }
});
