import type { Item } from './types';
import { enchantments } from './enchantments';

const itemData: Omit<Item, 'description' | 'image' | 'imageHint'>[] = [
  // Diamond Armor
  { id: 'diamond-helmet', name: 'Diamond Helmet', price: 400, enchantments: [...enchantments.armor, ...enchantments.helmet], icon: 'H', canUpgradeToNetherite: true },
  { id: 'diamond-chestplate', name: 'Diamond Chestplate', price: 600, enchantments: [...enchantments.armor], icon: 'C', canUpgradeToNetherite: true },
  { id: 'diamond-leggings', name: 'Diamond Leggings', price: 550, enchantments: [...enchantments.armor], icon: 'L', canUpgradeToNetherite: true },
  { id: 'diamond-boots', name: 'Diamond Boots', price: 400, enchantments: [...enchantments.armor, ...enchantments.boots], icon: 'B', canUpgradeToNetherite: true },
  
  // Diamond Tools
  { id: 'diamond-sword', name: 'Diamond Sword', price: 250, enchantments: [...enchantments.weapon], icon: 'S', canUpgradeToNetherite: true },
  { id: 'diamond-pickaxe', name: 'Diamond Pickaxe', price: 300, enchantments: [...enchantments.tool], icon: 'P', canUpgradeToNetherite: true },
  { id: 'diamond-axe', name: 'Diamond Axe', price: 300, enchantments: [...enchantments.tool, ...enchantments.weapon], icon: 'A', canUpgradeToNetherite: true },
  { id: 'diamond-shovel', name: 'Diamond Shovel', price: 150, enchantments: [...enchantments.tool], icon: 'S', canUpgradeToNetherite: true },

  // Netherite Items (Base, without upgrade cost)
  { id: 'netherite-helmet', name: 'Netherite Helmet', price: 900, enchantments: [...enchantments.armor, ...enchantments.helmet], icon: 'H' },
  { id: 'netherite-chestplate', name: 'Netherite Chestplate', price: 1100, enchantments: [...enchantments.armor], icon: 'C' },
  { id: 'netherite-leggings', name: 'Netherite Leggings', price: 1050, enchantments: [...enchantments.armor], icon: 'L' },
  { id: 'netherite-boots', name: 'Netherite Boots', price: 900, enchantments: [...enchantments.armor, ...enchantments.boots], icon: 'B' },
  { id: 'netherite-sword', name: 'Netherite Sword', price: 750, enchantments: [...enchantments.weapon], icon: 'S' },
  { id: 'netherite-pickaxe', name: 'Netherite Pickaxe', price: 800, enchantments: [...enchantments.tool], icon: 'P' },
  { id: 'netherite-axe', name: 'Netherite Axe', price: 800, enchantments: [...enchantments.tool, ...enchantments.weapon], icon: 'A' },
  { id: 'netherite-shovel', name: 'Netherite Shovel', price: 650, enchantments: [...enchantments.tool], icon: 'S' },
  
  // Other Items
  { id: 'elytra', name: 'Elytra', price: 700, enchantments: enchantments.elytra, icon: 'E' },
  { id: 'trident', name: 'Trident', price: 600, enchantments: enchantments.trident, icon: 'T' },
  { id: 'totem-of-undying', name: 'Totem of Undying', price: 300, enchantments: [], icon: 'T' },
  { id: 'enchanted-golden-apple', name: 'Enchanted Golden Apple', price: 450, enchantments: [], icon: 'A' },
  { id: 'shulker-box', name: 'Shulker Box', price: 150, enchantments: [], icon: 'S' },
  { id: 'beacon', name: 'Beacon', price: 1000, enchantments: [], icon: 'B' },
];

export const items: Item[] = itemData.map(item => ({
  ...item,
  description: '', 
  image: '', 
  imageHint: '',
  enchantments: [...new Set(item.enchantments)]
}));
