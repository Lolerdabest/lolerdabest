
import type { Enchantment } from './types';
import { exclusiveEnchantmentGroups } from './enchantments';
import { romanToNumber } from './roman-utils';
import { numberToRoman } from './roman-utils';

export const parseEnchantment = (enchantmentString: string): Enchantment | null => {
    if (enchantmentString.startsWith('Full') || enchantmentString.startsWith('All items')) {
      return null;
    }
    const parts = enchantmentString.split(' ');
    const levelRoman = parts.pop() || 'I';
    const level = romanToNumber(levelRoman);
    const name = parts.join(' ');
    return { name, level, cost: 180 }; // Example cost
};

export const processEnchantments = (allEnchantmentOptions: Enchantment[]) => {
    const exclusive: { groupName: string; enchantments: Enchantment[] }[] = Object.entries(exclusiveEnchantmentGroups).map(([groupName, enchantmentsInGroup]) => {
        const groupEnchantments = allEnchantmentOptions.filter(opt =>
            enchantmentsInGroup.some(enchantmentString => {
                const parts = enchantmentString.split(' ');
                parts.pop(); // remove level
                const name = parts.join(' ');
                return opt.name === name;
            })
        ).filter(opt => enchantmentsInGroup.includes(`${opt.name} ${numberToRoman(opt.level)}`));

        return { groupName, enchantments: groupEnchantments };
    }).filter(g => g.enchantments.length > 0);

    const allExclusiveEnchantmentStrings = Object.values(exclusiveEnchantmentGroups).flat();
    const nonExclusive = allEnchantmentOptions.filter(opt =>
        !allExclusiveEnchantmentStrings.includes(`${opt.name} ${numberToRoman(opt.level)}`)
    );

    return { exclusiveGroups: exclusive, nonExclusiveEnchantments: nonExclusive };
};

    