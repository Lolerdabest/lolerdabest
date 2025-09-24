
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { Bet } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const betSchema = z.object({
  minecraftUsername: z.string().min(3, { message: "Username must be at least 3 characters." }),
  discordTag: z.string().min(2, { message: "Please enter your Discord username." }),
  betDetails: z.string().min(1, { message: "Bet details are missing." }),
  totalBetAmount: z.string(),
});

export type FormState = {
  message: string;
  success: boolean;
};

// --- New Database Functions ---
const dbPath = path.join(process.cwd(), 'src', 'lib', 'bets.json');

async function readBets(): Promise<Bet[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.bets || [];
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Failed to read bets.json:', error);
    return [];
  }
}

async function writeBets(bets: Bet[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify({ bets }, null, 2), 'utf-8');
}
// --- End Database Functions ---


export async function placeBetAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    minecraftUsername: formData.get('minecraftUsername'),
    discordTag: formData.get('discordTag'),
    betDetails: formData.get('betDetails'),
    totalBetAmount: formData.get('totalBetAmount'),
  };
  
  const validatedFields = betSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
      success: false,
    };
  }

  const { minecraftUsername, discordTag, betDetails, totalBetAmount } = validatedFields.data;
  
  // Create a new Bet object and save it to our "database"
  const newBet: Bet = {
    id: `bet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    game: 'Combined', // We can refine this later
    details: betDetails,
    wager: parseFloat(totalBetAmount),
    minecraftUsername,
    discordTag,
    status: 'pending',
    createdAt: new Date().toISOString(),
    multiplier: 0, // Not relevant for combined bet slip
    payout: 0, // Not relevant for combined bet slip
  };

  try {
    const allBets = await readBets();
    allBets.unshift(newBet); // Add new bet to the beginning of the list
    await writeBets(allBets);
  } catch (error) {
     console.error('Failed to save bet:', error);
     return { message: 'Failed to save bet data. Please try again.', success: false };
  }


  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured.');
    return { message: 'Server configuration error: Webhook not set up.', success: false };
  }

  try {
    const discordPayload = {
      username: "Loler's Gambling House",
      avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
      embeds: [
        {
          title: "New Bet Submitted (Pending Payment)!",
          description: `Waiting for payment confirmation from the house. Bet ID: ${newBet.id}`,
          color: 16763904, // Gold color
          timestamp: new Date().toISOString(),
          fields: [
            { name: "Minecraft Username", value: minecraftUsername, inline: true },
            { name: "Discord Tag", value: discordTag, inline: true },
            { name: "Total Bet Amount", value: `$${totalBetAmount}`, inline: true },
            { name: "Bet Details", value: betDetails },
          ],
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send bet to Discord. Status: ${response.status}`);
    }
    
    revalidatePath('/admin'); // Important: This tells Next.js to refresh the admin page data
    return { message: `Bet submitted! Please pay in-game now. The house will confirm and grant you access to play.`, success: true };
  } catch (error) {
    console.error('Bet submission failed:', error);
    return { message: 'Something went wrong. Please try again.', success: false };
  }
}

// New action for the admin to confirm a bet
export async function confirmBetAction(betId: string): Promise<FormState> {
  try {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1) {
      return { message: 'Bet not found.', success: false };
    }

    if (allBets[betIndex].status !== 'pending') {
      return { message: 'This bet has already been actioned.', success: false };
    }
    
    allBets[betIndex].status = 'active';
    await writeBets(allBets);

    revalidatePath('/admin');
    revalidatePath('/'); // Refresh player page too
    return { message: 'Bet confirmed! The player can now play.', success: true };
  } catch (error) {
    console.error('Failed to confirm bet:', error);
    return { message: 'Failed to update bet status.', success: false };
  }
}
