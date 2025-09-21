'use server';

import { z } from 'zod';
import { getItemRecommendations } from '@/ai/flows/personalized-item-recommendations';
import { items } from '@/lib/items';
import type { CartItem } from '@/lib/types';
import {ai} from '@/ai/genkit';

const orderSchema = z.object({
  minecraftUsername: z.string().min(3, { message: "Username must be at least 3 characters." }),
  discordTag: z.string().min(2, { message: "Please enter your Discord username." }),
  notes: z.string().optional(),
  cart: z.string(),
  finalPrice: z.string(),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function placeOrderAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = orderSchema.safeParse({
      minecraftUsername: formData.get('minecraftUsername'),
      discordTag: formData.get('discordTag'),
      notes: formData.get('notes'),
      cart: formData.get('cart'),
      finalPrice: formData.get('finalPrice'),
    });

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.errors.map((e) => e.message).join(', '),
        success: false,
      };
    }
    
    const { minecraftUsername, discordTag, notes, cart, finalPrice } = validatedFields.data;
    const cartItems: CartItem[] = JSON.parse(cart);

    // Webhook logic has been removed as requested.
    // Order details will be logged to the console.
    console.log('--- New Order Placed ---');
    console.log('Minecraft Username:', minecraftUsername);
    console.log('Discord Tag:', discordTag);
    console.log('Final Price:', `R$${finalPrice}`);
    console.log('Items:', cartItems.map(item => `${item.name} x${item.quantity}`).join('\n'));
    if (notes) {
      console.log('Notes:', notes);
    }
    console.log('------------------------');


    return { message: `Order placed successfully! We'll be in touch on Discord.`, success: true };
  } catch (error) {
    console.error('Order placement failed:', error);
    return { message: 'Something went wrong. Please try again.', success: false };
  }
}


export async function getRecommendationsAction(cartItems: string[]) {
  if (cartItems.length === 0) {
    return [];
  }

  try {
    const result = await getItemRecommendations({
      cartItems: cartItems,
      orderHistory: [], // Using empty order history for simplicity
    });

    const recommendedItems = result.recommendations
      .map(name => items.find(item => item.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean); // Filter out any unfound items

    return recommendedItems;
  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    return [];
  }
}
