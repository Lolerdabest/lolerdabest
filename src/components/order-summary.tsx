
'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { placeOrderAction, type FormState } from '@/app/actions';
import { useEffect, useRef, useState, useActionState, ChangeEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatEnchantment } from '@/lib/enchantment-utils';
import { ScrollArea } from './ui/scroll-area';

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
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofName, setPaymentProofName] = useState<string>('');

  const discountedTotal = totalPrice - totalPrice * discount;

  const handleApplyCoupon = () => {
    setDiscount(0);
    toast({
      title: 'Info',
      description: 'Coupon codes are not available at this time.',
    });
  };

  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(placeOrderAction, initialState);
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        formRef.current?.reset();
        clearCart();
        setCoupon('');
        setDiscount(0);
        setPaymentProof(null);
        setPaymentProofName('');
      }
    }
  }, [state, toast, clearCart]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      setPaymentProofName(file.name);
    }
  };

  return (
    <ScrollArea className="h-full max-h-[calc(100vh-8rem)]">
      <Card className="border-primary/50 border-2 shadow-lg shadow-primary/20 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2 animate-text-glow">
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
                <div key={item.cartId} className="flex items-start gap-4">
                  <div className="relative w-10 h-10 animated-gradient overflow-hidden flex items-center justify-center p-1 rounded-md">
                      <p className="font-headline text-[10px] text-primary text-center animate-text-glow break-words leading-tight">
                          {item.name}
                      </p>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold leading-tight">{item.name}</p>
                    {item.selectedEnchantments.length > 0 && (
                      <ul className="text-xs text-primary/80 list-disc list-inside">
                        {item.selectedEnchantments.map(e => (
                          <li key={e.name}>{formatEnchantment(e)}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.cartId, item.quantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.cartId, item.quantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold">R${((item.price + item.selectedEnchantments.reduce((acc, e) => acc + e.cost, 0)) * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.cartId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && <Separator className="mt-4" />}
          {cart.length > 0 && (
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>R${totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span>-R${(totalPrice * discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R${discountedTotal.toFixed(2)}</span>
                </div>
              </div>
          )}
        </CardContent>

        {cart.length > 0 && (
          <CardFooter className="flex-col !items-start gap-6 pt-6">
            <Separator />
              <div className="w-full space-y-2">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    name="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full"
                    placeholder="No coupons available"
                    disabled
                  />
                  <Button onClick={handleApplyCoupon} disabled>Apply</Button>
                </div>
              </div>
            <Separator />

            <form action={formAction} ref={formRef} className="w-full space-y-6" encType="multipart/form-data">
              <input type="hidden" name="cart" value={JSON.stringify(cart.map(({image, imageHint, description, enchantments, ...rest}) => rest))} />
              <input type="hidden" name="finalPrice" value={discountedTotal.toFixed(2)} />

              <div className="space-y-2">
                <Label htmlFor="minecraftUsername">Minecraft Username</Label>
                <Input id="minecraftUsername" name="minecraftUsername" placeholder="Steve" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discordTag">Discord Tag</Label>
                <Input id="discordTag" name="discordTag" placeholder="yourname" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Optional Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Any special requests or details?" />
              </div>
              
              <div className="space-y-2">
                  <Label>Payment Instructions</Label>
                  <div className="p-3 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    <p>Please send the total amount in-game using the command below and upload a screenshot of the payment confirmation.</p>
                    <code className="block bg-background/50 p-2 rounded-md mt-2 text-center text-foreground break-all">
                      /pay lolerdabest69 {discountedTotal.toFixed(2)}
                    </code>
                  </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentProof">Payment Proof</Label>
                <Input 
                  id="paymentProof" 
                  name="paymentProof" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                <Button asChild variant="outline">
                  <label htmlFor="paymentProof" className="cursor-pointer w-full">
                    {paymentProofName ? 'Change Proof' : 'Upload Screenshot'}
                  </label>
                </Button>
                {paymentProofName && <p className="text-xs text-muted-foreground">Selected: {paymentProofName}</p>}
              </div>

              <SubmitButton />
            </form>
          </CardFooter>
        )}
      </Card>
    </ScrollArea>
  );
}
