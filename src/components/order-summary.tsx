'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { MinusCircle, PlusCircle, ShoppingCart, Trash2, Upload } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { placeOrderAction, type FormState } from '@/app/actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

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
    <Card className="border-accent border-2 shadow-lg shadow-accent/10">
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
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover image-rendering-pixelated"
                  data-ai-hint={item.imageHint}
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            
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
