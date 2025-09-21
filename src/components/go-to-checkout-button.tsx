
'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GoToCheckoutButton() {
  const { totalItems } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(totalItems > 0);
  }, [totalItems]);

  const handleScroll = () => {
    const element = document.getElementById('order-summary');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <Button
        size="icon"
        className="rounded-full shadow-lg shadow-primary/40 animate-bounce w-16 h-16"
        onClick={handleScroll}
        aria-label="Go to Checkout"
      >
        <ShoppingCart className="h-8 w-8" />
      </Button>
    </div>
  );
}
