export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHint: string;
}

export interface CartItem extends Item {
  quantity: number;
}
