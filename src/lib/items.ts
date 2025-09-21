import type { Item } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { enchantmentBooks } from './enchantments';

const itemData: Omit<Item, 'description' | 'image' | 'imageHint' | 'enchantments'>[] = [
  // Full Kit
  {
    id: 'maxed-netherite-kit',
    name: 'Maxed Netherite Kit',
    price: 10000,
    canUpgradeToNetherite: false,
  },

  // Diamond Armor
  { id: 'diamond-helmet', name: 'Diamond Helmet', price: 150, canUpgradeToNetherite: true },
  { id: 'diamond-chestplate', name: 'Diamond Chestplate', price: 250, canUpgradeToNetherite: true },
  { id: 'diamond-leggings', name: 'Diamond Leggings', price: 200, canUpgradeToNetherite: true },
  { id: 'diamond-boots', name: 'Diamond Boots', price: 150, canUpgradeToNetherite: true },
  
  // Diamond Tools
  { id: 'diamond-sword', name: 'Diamond Sword', price: 120, canUpgradeToNetherite: true },
  { id: 'diamond-pickaxe', name: 'Diamond Pickaxe', price: 150, canUpgradeToNetherite: true },
  { id: 'diamond-axe', name: 'Diamond Axe', price: 150, canUpgradeToNetherite: true },
  { id: 'diamond-shovel', name: 'Diamond Shovel', price: 80, canUpgradeToNetherite: true },

  // Netherite Items
  { id: 'netherite-helmet', name: 'Netherite Helmet', price: 300 },
  { id: 'netherite-chestplate', name: 'Netherite Chestplate', price: 400 },
  { id: 'netherite-leggings', name: 'Netherite Leggings', price: 350 },
  { id: 'netherite-boots', name: 'Netherite Boots', price: 300 },
  { id: 'netherite-sword', name: 'Netherite Sword', price: 350 },
  { id: 'netherite-pickaxe', name: 'Netherite Pickaxe', price: 400 },
  { id: 'netherite-axe', name: 'Netherite Axe', price: 400 },
  { id: 'netherite-shovel', name: 'Netherite Shovel', price: 250 },
  
  // Other Items
  { id: 'bow', name: 'Bow', price: 100 },
  { id: 'crossbow', name: 'Crossbow', price: 120 },
  { id: 'elytra', name: 'Elytra', price: 1200 },
  { id: 'totem-of-undying', name: 'Totem of Undying', price: 100 },
  { id: 'shulker-box', name: 'Shulker Box', price: 100 },
  { id: 'golden-carrots', name: 'Golden Carrots x64', price: 200 },
  { id: 'xp-bottles', name: 'XP Bottles x64', price: 600 },
  { id: 'fireworks', name: 'Fireworks x64', price: 150 },
  { id: 'ender-chest', name: 'Ender Chest', price: 250 },
  { id: 'iron-ingot', name: 'Iron Ingot', price: 5 },
  { id: 'gold-ingot', name: 'Gold Ingot', price: 5 },
  { id: 'netherite-ingot', name: 'Netherite Ingot', price: 200 },
];

const enchantmentBookItems = enchantmentBooks.map(name => ({
  id: `book-${name.toLowerCase().replace(/ /g, '-')}`,
  name: `Enchanted Book: ${name}`,
  price: 180,
}));

export const items: Item[] = [...itemData, ...enchantmentBookItems].map(item => {
  const placeholder = PlaceHolderImages.find(p => p.id === item.id);
  const description = item.id === 'maxed-netherite-kit'
    ? 'Full Netherite Armor, Tools, and Weapons, all fully enchanted with the best compatible enchantments.'
    : (placeholder?.description || 'A high-quality Minecraft item.');

  return {
    ...item,
    description,
    image: placeholder?.imageUrl || 'https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/enchanted_book.png', 
    imageHint: placeholder?.imageHint || 'enchanted book',
    enchantments: []
  }
});
