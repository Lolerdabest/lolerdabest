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
  { id: 'diamond-hoe', name: 'Diamond Hoe', price: 100, canUpgradeToNetherite: true },


  // Netherite Items
  { id: 'netherite-helmet', name: 'Netherite Helmet', price: 300 },
  { id: 'netherite-chestplate', name: 'Netherite Chestplate', price: 400 },
  { id: 'netherite-leggings', name: 'Netherite Leggings', price: 350 },
  { id: 'netherite-boots', name: 'Netherite Boots', price: 300 },
  { id: 'netherite-sword', name: 'Netherite Sword', price: 350 },
  { id: 'netherite-pickaxe', name: 'Netherite Pickaxe', price: 400 },
  { id: 'netherite-axe', name: 'Netherite Axe', price: 400 },
  { id: 'netherite-shovel', name: 'Netherite Shovel', price: 250 },
  { id: 'netherite-hoe', name: 'Netherite Hoe', price: 300 },
  
  // Other Weapons & Tools
  { id: 'bow', name: 'Bow', price: 100 },
  { id: 'crossbow', name: 'Crossbow', price: 120 },
  { id: 'trident', name: 'Trident', price: 1500 },
  { id: 'shield', name: 'Shield', price: 50 },
  { id: 'fishing-rod', name: 'Fishing Rod', price: 30 },
  { id: 'flint-and-steel', name: 'Flint and Steel', price: 20 },
  { id: 'shears', name: 'Shears', price: 20 },

  // Special Items
  { id: 'elytra', name: 'Elytra', price: 1200 },
  { id: 'totem-of-undying', name: 'Totem of Undying', price: 100 },
  { id: 'shulker-box', name: 'Shulker Box', price: 100 },
  { id: 'ender-chest', name: 'Ender Chest', price: 250 },
  { id: 'nether-star', name: 'Nether Star', price: 5000 },
  { id: 'beacon', name: 'Beacon', price: 6000 },
  
  // Food
  { id: 'golden-carrots', name: 'Golden Carrots x64', price: 200 },
  { id: 'golden-apple', name: 'Golden Apple', price: 50 },
  { id: 'enchanted-golden-apple', name: 'Enchanted Golden Apple', price: 1500 },
  { id: 'steak', name: 'Steak x64', price: 100 },
  { id: 'bread', name: 'Bread x64', price: 80 },

  // Potions
  { id: 'potion-of-healing', name: 'Potion of Healing II', price: 75 },
  { id: 'potion-of-strength', name: 'Potion of Strength II (8:00)', price: 150 },
  { id: 'potion-of-swiftness', name: 'Potion of Swiftness II (8:00)', price: 100 },
  { id: 'potion-of-fire-resistance', name: 'Potion of Fire Resistance (8:00)', price: 120 },
  { id: 'potion-of-the-turtle-master', name: 'Potion of the Turtle Master (0:40)', price: 200 },
  { id: 'potion-of-slow-falling', name: 'Potion of Slow Falling (4:00)', price: 100 },
  
  // Resources & Mob Drops
  { id: 'xp-bottles', name: 'XP Bottles x64', price: 600 },
  { id: 'fireworks', name: 'Fireworks x64', price: 150 },
  { id: 'gunpowder', name: 'Gunpowder x64', price: 150 },
  { id: 'ender-pearl', name: 'Ender Pearl x16', price: 80 },
  { id: 'blaze-rod', name: 'Blaze Rod x16', price: 100 },
  { id: 'ghast-tear', name: 'Ghast Tear', price: 120 },
  { id: 'dragon-breath', name: 'Dragon\'s Breath', price: 150 },
  { id: 'phantom-membrane', name: 'Phantom Membrane', price: 40 },
  { id: 'string', name: 'String x64', price: 50 },
  { id: 'bone', name: 'Bone x64', price: 40 },
  { id: 'slime-ball', name: 'Slimeball x16', price: 60 },
  
  // Minerals & Ores
  { id: 'diamond', name: 'Diamond', price: 15 },
  { id: 'emerald', name: 'Emerald', price: 20 },
  { id: 'iron-ingot', name: 'Iron Ingot x64', price: 180 },
  { id: 'gold-ingot', name: 'Gold Ingot x64', price: 200 },
  { id: 'netherite-ingot', name: 'Netherite Ingot', price: 200 },
  { id: 'netherite-scrap', name: 'Netherite Scrap', price: 40 },
  { id: 'lapis-lazuli', name: 'Lapis Lazuli Block x64', price: 100 },
  { id: 'redstone-block', name: 'Redstone Block x64', price: 120 },
  { id: 'coal-block', name: 'Coal Block x64', price: 80 },
  { id: 'quartz', name: 'Nether Quartz x64', price: 70 },
  
  // Building Blocks
  { id: 'oak-log', name: 'Oak Logs x64', price: 30 },
  { id: 'spruce-log', name: 'Spruce Logs x64', price: 30 },
  { id: 'birch-log', name: 'Birch Logs x64', price: 30 },
  { id: 'jungle-log', name: 'Jungle Logs x64', price: 40 },
  { id: 'acacia-log', name: 'Acacia Logs x64', price: 40 },
  { id: 'dark-oak-log', name: 'Dark Oak Logs x64', price: 40 },
  { id: 'cobblestone', name: 'Cobblestone x64', price: 10 },
  { id: 'stone', name: 'Stone x64', price: 20 },
  { id: 'glass', name: 'Glass x64', price: 40 },
  { id: 'sand', name: 'Sand x64', price: 15 },
  { id: 'gravel', name: 'Gravel x64', price: 15 },
  { id: 'obsidian', name: 'Obsidian x16', price: 100 },

  // Redstone
  { id: 'redstone', name: 'Redstone Dust x64', price: 60 },
  { id: 'redstone-torch', name: 'Redstone Torch x16', price: 20 },
  { id: 'repeater', name: 'Redstone Repeater x16', price: 40 },
  { id: 'comparator', name: 'Redstone Comparator x16', price: 50 },
  { id: 'piston', name: 'Piston x16', price: 60 },
  { id: 'sticky-piston', name: 'Sticky Piston x16', price: 80 },
  { id: 'observer', name: 'Observer x16', price: 70 },
  { id: 'dispenser', name: 'Dispenser x16', price: 60 },
  { id: 'dropper', name: 'Dropper x16', price: 50 },
  { id: 'hopper', name: 'Hopper x16', price: 120 },
  { id: 'tnt', name: 'TNT x16', price: 150 },

  // Brewing & Farming
  { id: 'brewing-stand', name: 'Brewing Stand', price: 80 },
  { id: 'cauldron', name: 'Cauldron', price: 40 },
  { id: 'nether-wart', name: 'Nether Wart x16', price: 50 },
  { id: 'blaze-powder', name: 'Blaze Powder x16', price: 60 },
  { id: 'fermented-spider-eye', name: 'Fermented Spider Eye x16', price: 70 },
  { id: 'magma-cream', name: 'Magma Cream x16', price: 60 },
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
