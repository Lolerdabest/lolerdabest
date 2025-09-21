
'use client';

import { useState } from 'react';
import { SearchHeader } from '@/components/search-header';
import { ItemList } from '@/components/item-list';
import { OrderSummary } from '@/components/order-summary';
import Recommendations from '@/components/recommendations';
import { CartProvider } from '@/context/cart-provider';
import { items } from '@/lib/items';
import type { Item } from '@/lib/types';
import GoToCheckoutButton from '@/components/go-to-checkout-button';

export default function Home() {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = items.filter(item =>
      item.name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredItems(results);
  };

  return (
    <CartProvider>
      <SearchHeader onSearch={handleSearch} />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-24">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-12">
              <section>
                <ItemList items={filteredItems} />
              </section>
              <section>
                <Recommendations />
              </section>
            </div>
            <div id="order-summary-container" className="lg:sticky lg:top-24 h-[calc(100vh-7rem)]">
              <OrderSummary />
            </div>
          </div>
        </main>
      </div>
      <GoToCheckoutButton />
    </CartProvider>
  );
}
