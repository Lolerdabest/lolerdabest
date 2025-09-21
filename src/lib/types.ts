export interface Enchantment {
  name: string;
  level: number;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHint: string;
  enchantments: string[];
}

export interface CartItem extends Item {
  cartId: string;
  quantity: number;
  selectedEnchantments: Enchantment[];
}
