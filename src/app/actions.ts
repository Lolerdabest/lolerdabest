
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
  gameType: z.string(), // Added gameType to the schema
});

export type FormState = {
  message: string;
  success: boolean;
};

// --- Database Functions ---
const dbPath = path.join(process.cwd(), 'src', 'lib', 'bets.json');

async function readBets(): Promise<Bet[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.bets || [];
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeBets([]); // Create the file if it doesn't exist
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
    gameType: formData.get('gameType'),
  };
  
  const validatedFields = betSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
      success: false,
    };
  }

  const { minecraftUsername, discordTag, betDetails, totalBetAmount, gameType } = validatedFields.data;
  
  const newBet: Bet = {
    id: `bet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    game: gameType,
    details: betDetails,
    wager: parseFloat(totalBetAmount),
    minecraftUsername,
    discordTag,
    status: 'pending',
    createdAt: new Date().toISOString(),
    multiplier: 1, 
    payout: 0, 
  };

  try {
    const allBets = await readBets();
    allBets.unshift(newBet);
    await writeBets(allBets);
  } catch (error) {
     console.error('Failed to save bet:', error);
     return { message: 'Failed to save bet data. Please try again.', success: false };
  }


  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
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
              { name: "Game", value: gameType, inline: true },
              { name: "Minecraft Username", value: minecraftUsername, inline: true },
              { name: "Discord Tag", value: discordTag, inline: true },
              { name: "Total Bet Amount", value: `$${totalBetAmount}`, inline: true },
              { name: "Bet Details", value: `\`\`\`${betDetails.replace(/\\n/g, '\n')}\`\`\`` },
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
    } catch (error) {
       console.error('Bet submission to Discord failed:', error);
       // Non-fatal, so we don't return an error to the user
    }
  } else {
     console.warn('Discord webhook URL is not configured.');
  }
    
  revalidatePath('/admin');
  return { message: `Bet submitted! Please pay in-game now. The house will confirm and grant you access to play.`, success: true };
}

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
    revalidatePath('/'); // Important: Refresh player page too
    return { message: 'Bet confirmed! The player can now play.', success: true };
  } catch (error) {
    console.error('Failed to confirm bet:', error);
    return { message: 'Failed to update bet status.', success: false };
  }
}

export async function playCoinflipAction(betId: string, choice: 'Heads' | 'Tails'): Promise<{ message: string; result: 'win' | 'loss' }> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }

    const bet = allBets[betIndex];
    const outcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const result = choice === outcome ? 'win' : 'loss';
    const payout = result === 'win' ? bet.wager * 1.90 : 0; // House edge is 5%

    bet.status = 'completed';
    bet.result = result;
    bet.payout = payout;
    bet.details = `${bet.details}. Result: ${outcome}. Player ${result === 'win' ? 'won' : 'lost'}.`;

    await writeBets(allBets);
    revalidatePath('/admin');

    // Notify Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if(webhookUrl) {
         const discordPayload = {
            username: "Loler's Gambling House",
            avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
            embeds: [
                {
                    title: `Coinflip Result: ${bet.minecraftUsername} ${result === 'win' ? 'Won!' : 'Lost.'}`,
                    description: `Bet ID: ${bet.id}`,
                    color: result === 'win' ? 65340 : 16711680, // Green for win, Red for loss
                    timestamp: new Date().toISOString(),
                    fields: [
                        { name: "Player's Choice", value: choice, inline: true },
                        { name: "Actual Outcome", value: outcome, inline: true },
                        { name: "Wager", value: `$${bet.wager.toFixed(2)}`, inline: true },
                        { name: "Payout", value: `$${payout.toFixed(2)}`, inline: true },
                    ],
                }
            ]
        };
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
        });
    }

    return { message: `The coin landed on ${outcome}. You ${result}!`, result };
}

export async function playMinesAction(betId: string, tileIndex: number): Promise<{ message: string; result: 'win' | 'loss' | 'continue', mineHit: boolean, newMultiplier: number }> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }
    
    const bet = allBets[betIndex];
    const mineCountMatch = bet.details.match(/(\d+) mines/);
    const mineCount = mineCountMatch ? parseInt(mineCountMatch[1], 10) : 3;
    // Increased chance of hitting a mine for house edge
    const isMine = Math.random() < ((mineCount / 25) * 1.05); 

    if (isMine) {
        bet.status = 'completed';
        bet.result = 'loss';
        bet.payout = 0;
        await writeBets(allBets);
        revalidatePath('/admin');
        return { message: 'You hit a mine! Game over.', result: 'loss', mineHit: true, newMultiplier: 0 };
    }

    const currentMultiplier = bet.multiplier || 1;
    const newMultiplier = parseFloat((currentMultiplier * 1.05).toFixed(2));
    bet.multiplier = newMultiplier;

    await writeBets(allBets);

    return {
        message: 'Safe! Multiplier increased.',
        result: 'continue',
        mineHit: false,
        newMultiplier: newMultiplier
    };
}


export async function cashOutMinesAction(betId: string): Promise<{message: string; payout: number}> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }

    const bet = allBets[betIndex];
    const payout = bet.wager * (bet.multiplier || 1);

    bet.status = 'completed';
    bet.result = 'win';
    bet.payout = payout;

    await writeBets(allBets);
    revalidatePath('/admin');

     // Notify Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if(webhookUrl) {
         const discordPayload = {
            username: "Loler's Gambling House",
            avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
            embeds: [
                {
                    title: `Mines Payout: ${bet.minecraftUsername} Cashed Out!`,
                    description: `Bet ID: ${bet.id}`,
                    color: 65340, // Green
                    timestamp: new Date().toISOString(),
                    fields: [
                        { name: "Wager", value: `$${bet.wager.toFixed(2)}`, inline: true },
                        { name: "Final Multiplier", value: `${bet.multiplier}x`, inline: true },
                        { name: "Total Payout", value: `$${payout.toFixed(2)}`, inline: true },
                    ],
                }
            ]
        };
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
        });
    }


    return { message: `You cashed out successfully! You won $${payout.toFixed(2)}`, payout };
}

export async function playLimboAction(betId: string): Promise<{ message: string; result: 'win' | 'loss'; finalMultiplier: number, payout: number }> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }

    const bet = allBets[betIndex];
    const targetMultiplierMatch = bet.details.match(/Target: ([\d.]+)x/);
    const targetMultiplier = targetMultiplierMatch ? parseFloat(targetMultiplierMatch[1]) : 1.01;

    // Simulate Limbo result generation
    // House edge: 1% of outcomes are busts (instant loss).
    const isBust = Math.random() < 0.01;
    if (isBust) {
         const finalMultiplier = 0;
         bet.status = 'completed';
         bet.result = 'loss';
         bet.payout = 0;
         await writeBets(allBets);
         revalidatePath('/admin');
         return { message: 'Busted! You lost.', result: 'loss', finalMultiplier, payout: 0 };
    }

    // This is a simplified distribution. A real Limbo game uses more complex math.
    // This creates a distribution where lower multipliers are much more common.
    const finalMultiplier = parseFloat((1 / (1 - Math.random())).toFixed(2));
    
    const hasWon = finalMultiplier >= targetMultiplier;
    const payout = hasWon ? bet.wager * targetMultiplier : 0;

    bet.status = 'completed';
    bet.result = hasWon ? 'win' : 'loss';
    bet.payout = payout;

    await writeBets(allBets);
    revalidatePath('/admin');

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
        const discordPayload = {
            username: "Loler's Gambling House",
            avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
            embeds: [
                {
                    title: `Limbo Result: ${bet.minecraftUsername} ${hasWon ? 'Won!' : 'Lost.'}`,
                    description: `Bet ID: ${bet.id}`,
                    color: hasWon ? 65340 : 16711680,
                    timestamp: new Date().toISOString(),
                    fields: [
                        { name: "Target Multiplier", value: `${targetMultiplier}x`, inline: true },
                        { name: "Result Multiplier", value: `${finalMultiplier}x`, inline: true },
                        { name: "Wager", value: `$${bet.wager.toFixed(2)}`, inline: true },
                        { name: "Payout", value: `$${payout.toFixed(2)}`, inline: true },
                    ],
                }
            ]
        };
         await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
        });
    }

    return {
        message: hasWon ? `You won $${payout.toFixed(2)}!` : `You lost. The multiplier was ${finalMultiplier}x.`,
        result: hasWon ? 'win' : 'loss',
        finalMultiplier,
        payout
    };
}


export async function playDragonTowersAction(betId: string, row: number, choice: number): Promise<{ message: string; result: 'win' | 'loss' | 'continue', newMultiplier: number }> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }

    const bet = allBets[betIndex];
    const difficultyMatch = bet.details.match(/Difficulty: (\w+)/);
    const difficulty = difficultyMatch ? difficultyMatch[1] : 'easy';

    const tilesPerRow = difficulty === 'hard' ? 2 : 4;
    const losingTiles = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 1;
    
    // Slightly rigged probability
    const isBadTile = Math.random() < ((losingTiles / tilesPerRow) * 1.05);

    if (isBadTile) {
        bet.status = 'completed';
        bet.result = 'loss';
        bet.payout = 0;
        await writeBets(allBets);
        revalidatePath('/admin');
        return { message: 'You hit a skull! Game over.', result: 'loss', newMultiplier: 0 };
    }

    const currentMultiplier = bet.multiplier || 1;
    const multiplierMap = { easy: 1.15, medium: 1.33, hard: 1.5 };
    const newMultiplier = parseFloat((currentMultiplier * (multiplierMap[difficulty as keyof typeof multiplierMap])).toFixed(2));
    bet.multiplier = newMultiplier;

    await writeBets(allBets);

    return {
        message: 'Safe! Advanced to the next level.',
        result: 'continue',
        newMultiplier: newMultiplier
    };
}

export async function cashOutDragonTowersAction(betId: string): Promise<{message: string; payout: number}> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }

    const bet = allBets[betIndex];
    const payout = bet.wager * (bet.multiplier || 1);

    bet.status = 'completed';
    bet.result = 'win';
    bet.payout = payout;

    await writeBets(allBets);
    revalidatePath('/admin');

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if(webhookUrl) {
         const discordPayload = {
            username: "Loler's Gambling House",
            avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
            embeds: [
                {
                    title: `Dragon Towers Payout: ${bet.minecraftUsername} Cashed Out!`,
                    description: `Bet ID: ${bet.id}`,
                    color: 65340, // Green
                    timestamp: new Date().toISOString(),
                    fields: [
                        { name: "Wager", value: `$${bet.wager.toFixed(2)}`, inline: true },
                        { name: "Final Multiplier", value: `${bet.multiplier}x`, inline: true },
                        { name: "Total Payout", value: `$${payout.toFixed(2)}`, inline: true },
                    ],
                }
            ]
        };
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
        });
    }

    return { message: `You cashed out successfully! You won $${payout.toFixed(2)}`, payout };
}
