
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
  { id: 'spyglass', name: 'Spyglass', price: 50 },
  { id: 'compass', name: 'Compass', price: 30 },
  { id: 'clock', name: 'Clock', price: 30 },
  { id: 'lead', name: 'Lead x4', price: 40 },
  { id: 'name-tag', name: 'Name Tag', price: 100 },

  // Special Items
  { id: 'elytra', name: 'Elytra', price: 1200 },
  { id: 'totem-of-undying', name: 'Totem of Undying', price: 100 },
  { id: 'shulker-box', name: 'Shulker Box', price: 100 },
  { id: 'ender-chest', name: 'Ender Chest', price: 250 },
  { id: 'nether-star', name: 'Nether Star', price: 5000 },
  { id: 'beacon', name: 'Beacon', price: 6000 },
  { id: 'dragon-egg', name: 'Dragon Egg', price: 20000 },
  { id: 'dragon-head', name: 'Dragon Head', price: 2500 },
  
  // Food
  { id: 'golden-carrots', name: 'Golden Carrots x64', price: 200 },
  { id: 'golden-apple', name: 'Golden Apple', price: 50 },
  { id: 'enchanted-golden-apple', name: 'Enchanted Golden Apple', price: 1500 },
  { id: 'steak', name: 'Steak x64', price: 100 },
  { id: 'cooked-porkchop', name: 'Cooked Porkchop x64', price: 100 },
  { id: 'cooked-chicken', name: 'Cooked Chicken x64', price: 90 },
  { id: 'cooked-mutton', name: 'Cooked Mutton x64', price: 90 },
  { id: 'bread', name: 'Bread x64', price: 80 },
  { id: 'baked-potato', name: 'Baked Potato x64', price: 80 },
  { id: 'pumpkin-pie', name: 'Pumpkin Pie x16', price: 50 },
  { id: 'cake', name: 'Cake', price: 60 },
  { id: 'honey-bottle', name: 'Honey Bottle x16', price: 70 },

  // Potions
  { id: 'potion-of-healing', name: 'Potion of Healing II', price: 75 },
  { id: 'potion-of-strength', name: 'Potion of Strength II (8:00)', price: 150 },
  { id: 'potion-of-swiftness', name: 'Potion of Swiftness II (8:00)', price: 100 },
  { id: 'potion-of-fire-resistance', name: 'Potion of Fire Resistance (8:00)', price: 120 },
  { id: 'potion-of-the-turtle-master', name: 'Potion of the Turtle Master (0:40)', price: 200 },
  { id: 'potion-of-slow-falling', name: 'Potion of Slow Falling (4:00)', price: 100 },
  { id: 'potion-of-regeneration', name: 'Potion of Regeneration II (1:30)', price: 180 },
  { id: 'potion-of-water-breathing', name: 'Potion of Water Breathing (8:00)', price: 130 },
  { id: 'potion-of-invisibility', name: 'Potion of Invisibility (8:00)', price: 160 },
  
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
  { id: 'nautilus-shell', name: 'Nautilus Shell', price: 80 },
  { id: 'heart-of-the-sea', name: 'Heart of the Sea', price: 1000 },
  { id: 'wither-skeleton-skull', name: 'Wither Skeleton Skull', price: 1200 },
  
  // Minerals & Ores
  { id: 'diamond-block', name: 'Diamond Block x16', price: 2160 },
  { id: 'emerald-block', name: 'Emerald Block x16', price: 2880 },
  { id: 'iron-block', name: 'Iron Block x64', price: 1620 },
  { id: 'gold-block', name: 'Gold Block x64', price: 1800 },
  { id: 'netherite-block', name: 'Netherite Block', price: 1800 },
  { id: 'diamond', name: 'Diamond x16', price: 240 },
  { id: 'emerald', name: 'Emerald x16', price: 320 },
  { id: 'iron-ingot', name: 'Iron Ingot x64', price: 180 },
  { id: 'gold-ingot', name: 'Gold Ingot x64', price: 200 },
  { id: 'netherite-ingot', name: 'Netherite Ingot', price: 200 },
  { id: 'netherite-scrap', name: 'Netherite Scrap', price: 40 },
  { id: 'lapis-lazuli-block', name: 'Lapis Lazuli Block x64', price: 100 },
  { id: 'redstone-block', name: 'Redstone Block x64', price: 120 },
  { id: 'coal-block', name: 'Coal Block x64', price: 80 },
  { id: 'quartz-block', name: 'Quartz Block x64', price: 70 },
  { id: 'amethyst-shard', name: 'Amethyst Shard x16', price: 50 },
  
  // Building Blocks - Wood
  { id: 'oak-log', name: 'Oak Logs x64', price: 30 },
  { id: 'spruce-log', name: 'Spruce Logs x64', price: 30 },
  { id: 'birch-log', name: 'Birch Logs x64', price: 30 },
  { id: 'jungle-log', name: 'Jungle Logs x64', price: 40 },
  { id: 'acacia-log', name: 'Acacia Logs x64', price: 40 },
  { id: 'dark-oak-log', name: 'Dark Oak Logs x64', price: 40 },
  { id: 'mangrove-log', name: 'Mangrove Logs x64', price: 40 },
  { id: 'cherry-log', name: 'Cherry Logs x64', price: 45 },
  { id: 'crimson-stem', name: 'Crimson Stems x64', price: 35 },
  { id: 'warped-stem', name: 'Warped Stems x64', price: 35 },

  // Building Blocks - Stone
  { id: 'cobblestone', name: 'Cobblestone x64', price: 10 },
  { id: 'stone', name: 'Stone x64', price: 20 },
  { id: 'granite', name: 'Granite x64', price: 20 },
  { id: 'diorite', name: 'Diorite x64', price: 20 },
  { id: 'andesite', name: 'Andesite x64', price: 20 },
  { id: 'deepslate', name: 'Deepslate x64', price: 25 },
  { id: 'calcite', name: 'Calcite x64', price: 30 },
  { id: 'tuff', name: 'Tuff x64', price: 25 },
  { id: 'sandstone', name: 'Sandstone x64', price: 20 },
  { id: 'red-sandstone', name: 'Red Sandstone x64', price: 20 },

  // Building Blocks - Nether & End
  { id: 'netherrack', name: 'Netherrack x64', price: 10 },
  { id: 'soul-sand', name: 'Soul Sand x64', price: 30 },
  { id: 'soul-soil', name: 'Soul Soil x64', price: 30 },
  { id: 'end-stone', name: 'End Stone x64', price: 25 },
  { id: 'purpur-block', name: 'Purpur Block x64', price: 40 },
  { id: 'obsidian', name: 'Obsidian x16', price: 100 },

  // Building Blocks - Other
  { id: 'glass', name: 'Glass x64', price: 40 },
  { id: 'sand', name: 'Sand x64', price: 15 },
  { id: 'gravel', name: 'Gravel x64', price: 15 },
  { id: 'clay-ball', name: 'Clay Balls x64', price: 30 },
  { id: 'terracotta', name: 'Terracotta x64', price: 40 },
  { id: 'sea-lantern', name: 'Sea Lantern x16', price: 80 },
  { id: 'glowstone', name: 'Glowstone x16', price: 60 },
  
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
  { id: 'slime-block', name: 'Slime Block x16', price: 100 },
  { id: 'honey-block', name: 'Honey Block x16', price: 120 },

  // Brewing & Farming
  { id: 'brewing-stand', name: 'Brewing Stand', price: 80 },
  { id: 'cauldron', name: 'Cauldron', price: 40 },
  { id: 'nether-wart', name: 'Nether Wart x16', price: 50 },
  { id: 'blaze-powder', name: 'Blaze Powder x16', price: 60 },
  { id: 'fermented-spider-eye', name: 'Fermented Spider Eye x16', price: 70 },
  { id: 'magma-cream', name: 'Magma Cream x16', price: 60 },
  { id: 'glistering-melon-slice', name: 'Glistering Melon Slice x16', price: 80 },
  { id: 'rabbit-foot', name: 'Rabbit\'s Foot', price: 90 },
  { id: 'pufferfish', name: 'Pufferfish', price: 70 },

  // Farming
  { id: 'wheat-seeds', name: 'Wheat Seeds x64', price: 20 },
  { id: 'pumpkin-seeds', name: 'Pumpkin Seeds x64', price: 20 },
  { id: 'melon-seeds', name: 'Melon Seeds x64', price: 20 },
  { id: 'beetroot-seeds', name: 'Beetroot Seeds x64', price: 20 },
  { id: 'carrot', name: 'Carrot x64', price: 30 },
  { id: 'potato', name: 'Potato x64', price: 30 },
  { id: 'sugar-cane', name: 'Sugar Cane x64', price: 25 },
  { id: 'cactus', name: 'Cactus x64', price: 25 },
  { id: 'cocoa-beans', name: 'Cocoa Beans x64', price: 30 },

  // Transportation
  { id: 'rail', name: 'Rail x64', price: 50 },
  { id: 'powered-rail', name: 'Powered Rail x32', price: 100 },
  { id: 'detector-rail', name: 'Detector Rail x32', price: 80 },
  { id: 'activator-rail', name: 'Activator Rail x32', price: 90 },
  { id: 'minecart', name: 'Minecart', price: 30 },
  { id: 'chest-minecart', name: 'Minecart with Chest', price: 50 },
  { id: 'furnace-minecart', name: 'Minecart with Furnace', price: 50 },
  { id: 'tnt-minecart', name: 'Minecart with TNT', price: 100 },
  { id: 'hopper-minecart', name: 'Minecart with Hopper', price: 150 },
  { id: 'oak-boat', name: 'Oak Boat', price: 20 },
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

    

    