'use server';

import { z } from 'zod';
import { getItemRecommendations } from '@/ai/flows/personalized-item-recommendations';
import { items } from '@/lib/items';

const orderSchema = z.object({
  minecraftUsername: z.string().min(3, { message: "Username must be at least 3 characters." }),
  discordTag: z.string().regex(/^.{3,32}#[0-9]{4}$/, { message: "Invalid Discord tag format (e.g., user#1234)." }),
  notes: z.string().optional(),
  cart: z.string(),
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
    });

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.errors.map((e) => e.message).join(', '),
        success: false,
      };
    }
    
    // In a real app, you would process the order here:
    // - Save order details to a database
    // - Handle the screenshot upload (e.g., to cloud storage)
    // - Notify admins
    console.log('New Order Placed:');
    console.log('Username:', validatedFields.data.minecraftUsername);
    console.log('Discord:', validatedFields.data.discordTag);
    console.log('Notes:', validatedFields.data.notes);
    console.log('Cart:', JSON.parse(validatedFields.data.cart));
    // console.log('Screenshot:', formData.get('screenshot'));

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
