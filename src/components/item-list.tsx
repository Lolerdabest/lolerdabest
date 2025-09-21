import type { Item } from '@/lib/types';
import { ItemCard } from './item-card';

interface ItemListProps {
  items: Item[];
}

export function ItemList({ items }: ItemListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
