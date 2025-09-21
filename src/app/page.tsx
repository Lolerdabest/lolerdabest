import { Header } from '@/components/header';
import { ItemList } from '@/components/item-list';
import { OrderSummary } from '@/components/order-summary';
import Recommendations from '@/components/recommendations';
import { CartProvider } from '@/context/cart-provider';
import { items } from '@/lib/items';

export default function Home() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen relative">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <ItemList items={items} />
              </section>
              <section>
                <Recommendations />
              </section>
            </div>
            <div className="lg:col-span-1 lg:sticky top-8">
              <OrderSummary />
            </div>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
