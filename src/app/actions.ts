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
  screenshot: z.instanceof(File),
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
      screenshot: formData.get('screenshot'),
    });

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.errors.map((e) => e.message).join(', '),
        success: false,
      };
    }
    
    const { minecraftUsername, discordTag, notes, cart, finalPrice, screenshot } = validatedFields.data;
    const cartItems: CartItem[] = JSON.parse(cart);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (webhookUrl) {
      const embed = {
        title: 'New Order Placed!',
        color: 0x9b59b6, // A nice purple color
        fields: [
          { name: 'Minecraft Username', value: minecraftUsername, inline: true },
          { name: 'Discord Tag', value: discordTag, inline: true },
          { name: 'Total Price', value: `R$${finalPrice}`, inline: true },
          { name: 'Items', value: cartItems.map(item => `${item.name} x${item.quantity}`).join('\n') },
        ],
        footer: {
          text: `Loler's Hustle | ${new Date().toLocaleString()}`,
        },
      };

      if (notes) {
        embed.fields.push({ name: 'Notes', value: notes });
      }
      
      const webhookFormData = new FormData();
      const webhookPayload = {
          username: "Loler's Hustle Bot",
          avatar_url: 'https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png',
          embeds: [embed],
      };

      webhookFormData.append('payload_json', JSON.stringify(webhookPayload));
      webhookFormData.append('file1', screenshot, screenshot.name);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: webhookFormData,
      });
      
      if (!response.ok) {
        const responseBody = await response.text();
        console.error('Failed to send Discord webhook:', response.status, responseBody);
        return { message: 'There was an error sending the order to Discord. Please contact support.', success: false };
      }

    } else {
        console.log('New Order Placed (Discord Webhook URL not configured):');
        console.log('Username:', minecraftUsername);
        console.log('Discord:', discordTag);
        console.log('Notes:', notes);
        console.log('Cart:', cartItems);
    }

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
