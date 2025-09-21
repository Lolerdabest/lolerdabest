'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { placeOrderAction, type FormState } from '@/app/actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-bold text-lg py-6" disabled={pending}>
      {pending ? 'Placing Order...' : 'Place Order'}
    </Button>
  );
}

export function OrderSummary() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useFormState(placeOrderAction, initialState);
  
  useEffect(() => {
    if(state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        formRef.current?.reset();
        clearCart();
      }
    }
  }, [state, toast, clearCart]);

  return (
    <Card className="border-accent border-2 shadow-lg shadow-accent/10 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <ShoppingCart />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const enchantmentCost = item.selectedEnchantments.reduce((cost, ench) => cost + 0.5 * ench.level, 0);
              const itemTotalPrice = (item.price + enchantmentCost) * item.quantity;

              return (
              <div key={item.cartId} className="flex items-start gap-4">
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                   {item.selectedEnchantments.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedEnchantments.map(e => (
                        <Badge key={e.name} variant="secondary" className="text-xs">
                          {e.name} {e.level}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.cartId, item.quantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.cartId, item.quantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold">${itemTotalPrice.toFixed(2)}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.cartId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )})}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>

      {cart.length > 0 && (
        <CardFooter className="flex-col !items-start gap-6">
          <Separator />
          <form action={formAction} ref={formRef} className="w-full space-y-6">
            <input type="hidden" name="cart" value={JSON.stringify(cart.map(({image, imageHint, description, ...rest}) => rest))} />
            
            <div className="space-y-2">
              <Label htmlFor="minecraftUsername">Minecraft Username</Label>
              <Input id="minecraftUsername" name="minecraftUsername" placeholder="Steve" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discordTag">Discord Tag</Label>
              <Input id="discordTag" name="discordTag" placeholder="yourname#1234" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Optional Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Any special requests?" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="screenshot">Payment Screenshot</Label>
              <Input id="screenshot" name="screenshot" type="file" required className="file:text-primary-foreground file:font-bold"/>
            </div>
            
            <SubmitButton />
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
