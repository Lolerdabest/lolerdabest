
import type { Item } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { enchantmentData } from './enchantment-utils';

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
  { id: 'spyglass', name: 'Spyglass', price: 50 },
  { id: 'compass', name: 'Compass', price: 30 },
  { id: 'clock', name: 'Clock', price: 30 },
  { id: 'lead', name: 'Lead x4', price: 40 },
  { id: 'name-tag', name: 'Name Tag', price: 100 },
  { id: 'saddle', name: 'Saddle', price: 120 },
  { id: 'armor-stand', name: 'Armor Stand', price: 30 },
  { id: 'item-frame', name: 'Item Frame', price: 20 },
  { id: 'glow-item-frame', name: 'Glow Item Frame', price: 40 },
  { id: 'painting', name: 'Painting', price: 20 },


  // Special Items
  { id: 'elytra', name: 'Elytra', price: 1200 },
  { id: 'totem-of-undying', name: 'Totem of Undying', price: 100 },
  { id: 'shulker-box', name: 'Shulker Box', price: 100 },
  { id: 'ender-chest', name: 'Ender Chest', price: 250 },
  { id: 'dragon-egg', name: 'Dragon Egg', price: 5000 },
  { id: 'dragon-head', name: 'Dragon Head', price: 1000 },
  { id: 'nether-star', name: 'Nether Star', price: 1000 },
  { id: 'beacon', name: 'Beacon', price: 1500 },
  { id: 'enchanted-golden-apple', name: 'Enchanted Golden Apple', price: 300 },
  { id: 'golden-apple', name: 'Golden Apple', price: 30 },
  
  // Consumables
  { id: 'golden-carrots', name: 'Golden Carrots x64', price: 150 },
  { id: 'xp-bottles', name: 'Bottles o\' Enchanting x64', price: 300 },
  { id: 'fireworks', name: 'Firework Rockets x64', price: 100 },

  // Minerals
  { id: 'diamond', name: 'Diamond x16', price: 160 },
  { id: 'emerald', name: 'Emerald x16', price: 100 },
  { id: 'gold-ingot', name: 'Gold Ingot x32', price: 80 },
  { id: 'iron-ingot', name: 'Iron Ingot x64', price: 60 },
  { id: 'netherite-ingot', name: 'Netherite Ingot', price: 200 },
  { id: 'netherite-scrap', name: 'Netherite Scrap', price: 50 },

  // Mineral Blocks
  { id: 'diamond-block', name: 'Diamond Block', price: 90 },
  { id: 'emerald-block', name: 'Emerald Block', price: 60 },
  { id: 'gold-block', name: 'Gold Block', price: 45 },
  { id: 'iron-block', name: 'Iron Block', price: 30 },
  { id: 'netherite-block', name: 'Netherite Block', price: 1800 },
  { id: 'lapis-lazuli-block', name: 'Lapis Lazuli Block', price: 20 },
  { id: 'redstone-block', name: 'Redstone Block', price: 10 },
  { id: 'coal-block', name: 'Coal Block', price: 10 },
  { id: 'quartz-block', name: 'Block of Quartz', price: 15 },
  { id: 'amethyst-shard', name: 'Amethyst Shard x16', price: 40 },
  

  // Mob Drops
  { id: 'gunpowder', name: 'Gunpowder x64', price: 50 },
  { id: 'ender-pearl', name: 'Ender Pearl x16', price: 40 },
  { id: 'blaze-rod', name: 'Blaze Rod x16', price: 60 },
  { id: 'ghast-tear', name: 'Ghast Tear x8', price: 80 },
  { id: 'dragon-breath', name: 'Dragon\'s Breath', price: 50 },
  { id: 'phantom-membrane', name: 'Phantom Membrane x16', price: 40 },
  { id: 'string', name: 'String x64', price: 20 },
  { id: 'bone', name: 'Bone x64', price: 20 },
  { id: 'slime-ball', name: 'Slimeball x32', price: 30 },
  { id: 'wither-skeleton-skull', name: 'Wither Skeleton Skull', price: 250 },
  { id: 'nautilus-shell', name: 'Nautilus Shell', price: 30 },
  { id: 'heart-of-the-sea', name: 'Heart of the Sea', price: 500 },


  // Potions
  { id: 'potion-of-healing', name: 'Potion of Healing II', price: 20 },
  { id: 'potion-of-strength', name: 'Potion of Strength II (8:00)', price: 30 },
  { id: 'potion-of-swiftness', name: 'Potion of Swiftness II (8:00)', price: 25 },
  { id: 'potion-of-fire-resistance', name: 'Potion of Fire Resistance (8:00)', price: 25 },
  { id: 'potion-of-the-turtle-master', name: 'Potion of the Turtle Master (3:00)', price: 40 },
  { id: 'potion-of-slow-falling', name: 'Potion of Slow Falling (4:00)', price: 30 },
  { id: 'potion-of-regeneration', name: 'Potion of Regeneration II (1:30)', price: 35 },
  { id: 'potion-of-water-breathing', name: 'Potion of Water Breathing (8:00)', price: 25 },
  { id: 'potion-of-invisibility', name: 'Potion of Invisibility (8:00)', price: 35 },


  // Food
  { id: 'steak', name: 'Steak x64', price: 40 },
  { id: 'cooked-porkchop', name: 'Cooked Porkchop x64', price: 40 },
  { id: 'cooked-chicken', name: 'Cooked Chicken x64', price: 35 },
  { id: 'cooked-mutton', name: 'Cooked Mutton x64', price: 35 },
  { id: 'bread', name: 'Bread x64', price: 30 },
  { id: 'baked-potato', name: 'Baked Potato x64', price: 30 },
  { id: 'pumpkin-pie', name: 'Pumpkin Pie x16', price: 20 },
  { id: 'cake', name: 'Cake', price: 15 },
  { id: 'honey-bottle', name: 'Honey Bottle x16', price: 20 },

  // Redstone Components
  { id: 'redstone', name: 'Redstone Dust x64', price: 20 },
  { id: 'redstone-torch', name: 'Redstone Torch x16', price: 10 },
  { id: 'repeater', name: 'Redstone Repeater x16', price: 20 },
  { id: 'comparator', name: 'Redstone Comparator x16', price: 25 },
  { id: 'piston', name: 'Piston x16', price: 30 },
  { id: 'sticky-piston', name: 'Sticky Piston x16', price: 40 },
  { id: 'observer', name: 'Observer x16', price: 40 },
  { id: 'dispenser', name: 'Dispenser x8', price: 30 },
  { id: 'dropper', name: 'Dropper x8', price: 25 },
  { id: 'hopper', name: 'Hopper x8', price: 50 },
  { id: 'tnt', name: 'TNT x16', price: 80 },
  { id: 'slime-block', name: 'Slime Block x16', price: 40 },
  { id: 'honey-block', name: 'Honey Block x16', price: 40 },
  
  // Transportation
  { id: 'rail', name: 'Rail x64', price: 20 },
  { id: 'powered-rail', name: 'Powered Rail x32', price: 100 },
  { id: 'detector-rail', name: 'Detector Rail x32', price: 80 },
  { id: 'activator-rail', name: 'Activator Rail x32', price: 90 },
  { id: 'minecart', name: 'Minecart', price: 30 },
  { id: 'chest-minecart', name: 'Minecart with Chest', price: 50 },
  { id: 'furnace-minecart', name: 'Minecart with Furnace', price: 50 },
  { id: 'tnt-minecart', name: 'Minecart with TNT', price: 100 },
  { id: 'hopper-minecart', name: 'Minecart with Hopper', price: 70 },
  { id: 'oak-boat', name: 'Oak Boat', price: 10 },

  // Brewing
  { id: 'brewing-stand', name: 'Brewing Stand', price: 50 },
  { id: 'cauldron', name: 'Cauldron', price: 20 },
  { id: 'nether-wart', name: 'Nether Wart x32', price: 30 },
  { id: 'blaze-powder', name: 'Blaze Powder x32', price: 40 },
  { id: 'fermented-spider-eye', name: 'Fermented Spider Eye x16', price: 20 },
  { id: 'magma-cream', name: 'Magma Cream x16', price: 30 },
  { id: 'glistering-melon-slice', name: 'Glistering Melon Slice x16', price: 25 },
  { id: 'rabbit-foot', name: 'Rabbit\'s Foot', price: 50 },
  { id: 'pufferfish', name: 'Pufferfish', price: 20 },

  // Building Blocks
  { id: 'cobblestone', name: 'Cobblestone x64', price: 5 },
  { id: 'stone', name: 'Stone x64', price: 10 },
  { id: 'glass', name: 'Glass x64', price: 15 },
  { id: 'sand', name: 'Sand x64', price: 10 },
  { id: 'gravel', name: 'Gravel x64', price: 10 },
  { id: 'obsidian', name: 'Obsidian x16', price: 50 },
  { id: 'oak-log', name: 'Oak Log x64', price: 15 },
  { id: 'spruce-log', name: 'Spruce Log x64', price: 15 },
  { id: 'birch-log', name: 'Birch Log x64', price: 15 },
  { id: 'jungle-log', name: 'Jungle Log x64', price: 15 },
  { id: 'acacia-log', name: 'Acacia Log x64', price: 15 },
  { id: 'dark-oak-log', name: 'Dark Oak Log x64', price: 15 },
  { id: 'mangrove-log', name: 'Mangrove Log x64', price: 15 },
  { id: 'cherry-log', name: 'Cherry Log x64', price: 15 },
  { id: 'crimson-stem', name: 'Crimson Stem x64', price: 20 },
  { id: 'warped-stem', name: 'Warped Stem x64', price: 20 },
  { id: 'granite', name: 'Granite x64', price: 10 },
  { id: 'diorite', name: 'Diorite x64', price: 10 },
  { id: 'andesite', name: 'Andesite x64', price: 10 },
  { id: 'deepslate', name: 'Deepslate x64', price: 15 },
  { id: 'calcite', name: 'Calcite x64', price: 20 },
  { id: 'tuff', name: 'Tuff x64', price: 15 },
  { id: 'sandstone', name: 'Sandstone x64', price: 12 },
  { id: 'red-sandstone', name: 'Red Sandstone x64', price: 12 },
  { id: 'netherrack', name: 'Netherrack x64', price: 5 },
  { id: 'soul-sand', name: 'Soul Sand x64', price: 15 },
  { id: 'soul-soil', name: 'Soul Soil x64', price: 15 },
  { id: 'end-stone', name: 'End Stone x64', price: 10 },
  { id: 'purpur-block', name: 'Purpur Block x64', price: 20 },
  { id: 'clay-ball', name: 'Clay Ball x64', price: 15 },
  { id: 'terracotta', name: 'Terracotta x64', price: 20 },
  { id: 'sea-lantern', name: 'Sea Lantern x16', price: 40 },
  { id: 'glowstone', name: 'Glowstone x16', price: 30 },
  
  // Farming
  { id: 'wheat-seeds', name: 'Wheat Seeds x16', price: 5 },
  { id: 'pumpkin-seeds', name: 'Pumpkin Seeds x16', price: 5 },
  { id: 'melon-seeds', name: 'Melon Seeds x16', price: 5 },
  { id: 'beetroot-seeds', name: 'Beetroot Seeds x16', price: 5 },
  { id: 'carrot', name: 'Carrot x64', price: 10 },
  { id: 'potato', name: 'Potato x64', price: 10 },
  { id: 'sugar-cane', name: 'Sugar Cane x64', price: 15 },
  { id: 'cactus', name: 'Cactus x32', price: 10 },
  { id: 'cocoa-beans', name: 'Cocoa Beans x32', price: 20 },
];


function createItem(
  baseItem: Omit<Item, 'description' | 'image' | 'imageHint' | 'enchantments'>
): Item {
  const placeholder = PlaceHolderImages.find(p => p.id === baseItem.id);
  const enchantments = Object.keys(enchantmentData).find(type => baseItem.id.includes(type))
    ? enchantmentData[Object.keys(enchantmentData).find(type => baseItem.id.includes(type))!]
    : [];

  return {
    ...baseItem,
    description: placeholder?.description || `A ${baseItem.name.toLowerCase()}.`,
    image: placeholder?.imageUrl || 'https://placehold.co/64x64/201a29/9f7aea?text=?',
    imageHint: placeholder?.imageHint || 'minecraft item',
    enchantments,
  };
}

export const items: Item[] = itemData.map(createItem);

    