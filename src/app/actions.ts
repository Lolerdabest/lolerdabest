'use server';

import { z } from 'zod';
import { getItemRecommendations } from '@/ai/flows/personalized-item-recommendations';
import { items } from '@/lib/items';
import type { CartItem } from '@/lib/types';
import { formatEnchantment } from '@/lib/enchantment-utils';

const orderSchema = z.object({
  minecraftUsername: z.string().min(3, { message: "Username must be at least 3 characters." }),
  discordTag: z.string().min(2, { message: "Please enter your Discord username." }),
  notes: z.string().optional(),
  cart: z.string(),
  finalPrice: z.string(),
  paymentProof: z.instanceof(File).refine(file => file.size > 0, "Payment proof is required."),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function placeOrderAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    minecraftUsername: formData.get('minecraftUsername'),
    discordTag: formData.get('discordTag'),
    notes: formData.get('notes'),
    cart: formData.get('cart'),
    finalPrice: formData.get('finalPrice'),
    paymentProof: formData.get('paymentProof'),
  };
  
  const validatedFields = orderSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
      success: false,
    };
  }

  const { minecraftUsername, discordTag, notes, cart, finalPrice, paymentProof } = validatedFields.data;
  const cartItems: CartItem[] = JSON.parse(cart);
  
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured.');
    return { message: 'Server configuration error: Webhook not set up.', success: false };
  }

  try {
    const discordPayload = {
      username: "Loler's Hustle Orders",
      avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
      embeds: [
        {
          title: "New Order Placed!",
          color: 9520895, // A nice purple color
          timestamp: new Date().toISOString(),
          fields: [
            { name: "Minecraft Username", value: minecraftUsername, inline: true },
            { name: "Discord Tag", value: discordTag, inline: true },
            { name: "Final Price", value: `R$${finalPrice}`, inline: true },
            ...cartItems.map((item, index) => {
              const enchantmentText = item.selectedEnchantments.length > 0
                ? '\n' + item.selectedEnchantments.map(e => `> ${formatEnchantment(e)}`).join('\n')
                : '';
              return {
                name: `Item #${index + 1}: ${item.name} x${item.quantity}`,
                value: `**Total:** R$${((item.price + item.selectedEnchantments.reduce((acc, ench) => acc + ench.cost, 0)) * item.quantity).toFixed(2)}${enchantmentText}`
              };
            }),
            ...(notes ? [{ name: "Notes", value: notes }] : []),
          ],
          image: {
            url: `attachment://${paymentProof.name}`
          }
        }
      ]
    };

    const webhookFormData = new FormData();
    webhookFormData.append('payload_json', JSON.stringify(discordPayload));
    webhookFormData.append('file', paymentProof, paymentProof.name);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: webhookFormData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Discord webhook error:', errorBody);
      throw new Error(`Failed to send order to Discord. Status: ${response.status}`);
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
      // @ts-ignore
      .map(name => items.find(item => item.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean); // Filter out any unfound items

    return recommendedItems;
  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    return [];
  }
}
