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

// Helper function to convert a File to a data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}


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
    
    // Convert the screenshot to a data URI
    const screenshotDataUri = await fileToDataUri(screenshot);
    
    // Use a Genkit flow to get a public URL for the image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: screenshotDataUri } },
        { text: 'Give me this image back' },
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    const screenshotUrl = media?.url;

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
        image: {
            url: screenshotUrl,
        }
      };

      if (notes) {
        embed.fields.push({ name: 'Notes', value: notes });
      }
      
      const webhookBody = {
          username: "Loler's Hustle Bot",
          avatar_url: 'https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png',
          embeds: [embed],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody),
      });

    } else {
        console.log('New Order Placed (Discord Webhook URL not configured):');
        console.log('Username:', minecraftUsername);
        console.log('Discord:', discordTag);
        console.log('Notes:', notes);
        console.log('Cart:', cartItems);
        console.log('Screenshot URL:', screenshotUrl);
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
