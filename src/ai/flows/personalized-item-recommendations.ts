'use server';

/**
 * @fileOverview Provides personalized item recommendations based on the items in the user's cart and order history.
 *
 * - getItemRecommendations - A function that generates item recommendations.
 * - ItemRecommendationsInput - The input type for the getItemRecommendations function.
 * - ItemRecommendationsOutput - The return type for the getItemRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItemRecommendationsInputSchema = z.object({
  cartItems: z.array(
    z.string().describe('The names of the items currently in the cart.')
  ).describe('The list of items currently in the user cart.'),
  orderHistory: z.array(
    z.string().describe('The names of the items previously ordered.')
  ).describe('The list of items the user has previously ordered.'),
});
export type ItemRecommendationsInput = z.infer<typeof ItemRecommendationsInputSchema>;

const ItemRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('Recommended item name.')
  ).describe('A list of personalized item recommendations.'),
});
export type ItemRecommendationsOutput = z.infer<typeof ItemRecommendationsOutputSchema>;

export async function getItemRecommendations(input: ItemRecommendationsInput): Promise<ItemRecommendationsOutput> {
  return itemRecommendationsFlow(input);
}

const itemRecommendationPrompt = ai.definePrompt({
  name: 'itemRecommendationPrompt',
  input: {schema: ItemRecommendationsInputSchema},
  output: {schema: ItemRecommendationsOutputSchema},
  prompt: `You are a recommendation engine for a Minecraft marketplace.
  Given the items in the user's cart and their past order history, suggest additional items they might be interested in.
  Return a maximum of 5 recommendations.

  Cart Items: {{cartItems}}
  Order History: {{orderHistory}}
  `,
});

const itemRecommendationsFlow = ai.defineFlow(
  {
    name: 'itemRecommendationsFlow',
    inputSchema: ItemRecommendationsInputSchema,
    outputSchema: ItemRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await itemRecommendationPrompt(input);
    return output!;
  }
);
