export interface Enchantment {
  name: string;
  level: number;
  cost: number;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHint: string;
  description: string;
  enchantments: string[];
  icon?: string;
  canUpgradeToNetherite?: boolean;
}

export interface CartItem extends Item {
  cartId: string;
  quantity: number;
  selectedEnchantments: Enchantment[];
}
