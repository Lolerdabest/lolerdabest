
'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle } from 'lucide-react';
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
        size="lg"
        className="text-lg font-bold py-8 px-6 rounded-full shadow-lg shadow-primary/40 animate-bounce"
        onClick={handleScroll}
      >
        <ArrowDownCircle className="mr-2 h-6 w-6" />
        Go to Checkout
      </Button>
    </div>
  );
}
