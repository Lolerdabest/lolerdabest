
import type { Item, Enchantment } from './types';
import { romanToNumber, numberToRoman } from './roman-utils';

export const enchantmentData: { [key: string]: string[] } = {
    sword: ["Sharpness V", "Smite V", "Bane of Arthropods V", "Knockback II", "Fire Aspect II", "Looting III", "Sweeping Edge III", "Unbreaking III", "Mending", "Curse of Vanishing"],
    pickaxe: ["Efficiency V", "Silk Touch", "Fortune III", "Unbreaking III", "Mending", "Curse of Vanishing"],
    axe: ["Sharpness V", "Smite V", "Bane of Arthropods V", "Efficiency V", "Silk Touch", "Fortune III", "Unbreaking III", "Mending", "Curse of Vanishing"],
    shovel: ["Efficiency V", "Silk Touch", "Fortune III", "Unbreaking III", "Mending", "Curse of Vanishing"],
    helmet: ["Protection IV", "Fire Protection IV", "Blast Protection IV", "Projectile Protection IV", "Respiration III", "Aqua Affinity", "Thorns III", "Unbreaking III", "Mending", "Curse of Binding", "Curse of Vanishing"],
    chestplate: ["Protection IV", "Fire Protection IV", "Blast Protection IV", "Projectile Protection IV", "Thorns III", "Unbreaking III", "Mending", "Curse of Binding", "Curse of Vanishing"],
    leggings: ["Protection IV", "Fire Protection IV", "Blast Protection IV", "Projectile Protection IV", "Swift Sneak III", "Thorns III", "Unbreaking III", "Mending", "Curse of Binding", "Curse of Vanishing"],
    boots: ["Protection IV", "Fire Protection IV", "Blast Protection IV", "Projectile Protection IV", "Feather Falling IV", "Depth Strider III", "Soul Speed III", "Unbreaking III", "Mending", "Curse of Binding", "Curse of Vanishing"],
    bow: ["Power V", "Punch II", "Flame", "Infinity", "Unbreaking III", "Mending", "Curse of Vanishing"],
    crossbow: ["Quick Charge III", "Multishot", "Piercing IV", "Unbreaking III", "Mending", "Curse of Vanishing"]
};

export const exclusiveEnchantments: { [key: string]: string[][] } = {
    sword: [["Sharpness", "Smite", "Bane of Arthropods"]],
    pickaxe: [["Silk Touch", "Fortune"]],
    axe: [["Sharpness", "Smite", "Bane of Arthropods"], ["Silk Touch", "Fortune"]],
    shovel: [["Silk Touch", "Fortune"]],
    helmet: [["Protection", "Fire Protection", "Blast Protection", "Projectile Protection"]],
    chestplate: [["Protection", "Fire Protection", "Blast Protection", "Projectile Protection"]],
    leggings: [["Protection", "Fire Protection", "Blast Protection", "Projectile Protection"]],
    boots: [["Protection", "Fire Protection", "Blast Protection", "Projectile Protection"], ["Depth Strider", "Frost Walker"]],
    bow: [["Infinity", "Mending"]],
    crossbow: [["Multishot", "Piercing"]],
};

const ENCHANTMENT_COST = 200;

export const getApplicableEnchantments = (item: Item): string[] => {
    const itemType = Object.keys(enchantmentData).find(type => item.id.includes(type));
    return itemType ? enchantmentData[itemType] : [];
};

export const getExclusiveGroups = (item: Item): string[][] => {
    const itemType = Object.keys(exclusiveEnchantments).find(type => item.id.includes(type));
    return itemType ? exclusiveEnchantments[itemType] : [];
};

export const parseEnchantment = (enchantmentString: string): Enchantment | null => {
    const parts = enchantmentString.split(' ');
    const levelRoman = parts.length > 1 && ["I", "II", "III", "IV", "V"].includes(parts[parts.length - 1]) ? parts.pop()! : null;
    const name = parts.join(' ');
    const level = levelRoman ? romanToNumber(levelRoman) : 1;
  
    if (!name) return null;

    return {
      name,
      level,
      cost: ENCHANTMENT_COST,
    };
  };

export const formatEnchantment = (enchantment: Enchantment): string => {
    return enchantment.level > 1 ? `${enchantment.name} ${numberToRoman(enchantment.level)}` : enchantment.name;
};
