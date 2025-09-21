'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/cart-provider';
import { getRecommendationsAction } from '@/app/actions';
import type { Item } from '@/lib/types';
import { ItemList } from './item-list';
import { Skeleton } from './ui/skeleton';

export default function Recommendations() {
  const { cart } = useCart();
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (cart.length > 0) {
        setLoading(true);
        const cartItemNames = cart.map((item) => item.name);
        try {
          const result = await getRecommendationsAction(cartItemNames);
          // @ts-ignore
          setRecommendations(result);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      } else {
        setRecommendations([]);
      }
    };

    const timeoutId = setTimeout(fetchRecommendations, 500); // Debounce to avoid rapid calls
    return () => clearTimeout(timeoutId);
  }, [cart]);

  if (cart.length === 0) {
    return null;
  }
  
  if (loading) {
    return (
        <div>
            <h2 className="text-3xl font-headline font-bold mb-6 text-accent">Recommended For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[420px] w-full" />)}
            </div>
        </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl font-headline font-bold mb-6 text-accent">Recommended For You</h2>
      <ItemList items={recommendations} />
    </div>
  );
}
