
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
  // In a Vercel environment, the filesystem is read-only after build.
  // We should not expect to read dynamically updated bets.
  // If the file doesn't exist at build time, return empty.
  if (process.env.VERCEL) {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      return JSON.parse(data).bets || [];
    } catch (error) {
      // If file doesn't exist or is empty on Vercel, it's not an error.
      // Return an empty array.
      return [];
    }
  }

  // Local development logic
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data).bets || [];
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      // If file doesn't exist locally, create it.
      await writeBets([]);
      return [];
    }
    console.error('Failed to read bets.json:', error);
    return [];
  }
}

async function writeBets(bets: Bet[]): Promise<void> {
  // Vercel has a read-only filesystem, so we must not write in production.
  // This check prevents the app from crashing on Vercel.
  if (process.env.VERCEL) {
    console.warn('Skipping writeBets in Vercel environment.');
    return;
  }
  
  // Ensure the directory exists before writing the file for local dev.
  const dir = path.dirname(dbPath);
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
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

  // Enforce minimum bet for Roulette
  const wagerAmount = parseFloat(totalBetAmount);
  if (gameType === 'Roulette' && wagerAmount < 250) {
      return {
          message: 'The minimum bet for Roulette is $250.',
          success: false,
      };
  }
  
  const newBet: Bet = {
    id: `bet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    game: gameType,
    details: betDetails,
    wager: wagerAmount,
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
            author: {
                name: minecraftUsername,
                icon_url: `https://mc-heads.net/avatar/${minecraftUsername}`
            }
          }
        ]
      };

      const discordFormData = new FormData();
      discordFormData.append('payload_json', JSON.stringify(discordPayload));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: discordFormData,
      });


      if (!response.ok) {
        console.error(await response.json());
        throw new Error(`Failed to send bet to Discord. Status: ${response.status}`);
      }
    } catch (error) {
       console.error('Bet submission to Discord failed:', error);
       // Non-fatal, so we don't return an error to the user
    }
  } else {
     console.warn('Discord webhook URL is not configured.');
  }
    
  // Because the filesystem is read-only on Vercel, revalidating paths that read
  // from bets.json won't show new bets. We only revalidate for local dev.
  if (!process.env.VERCEL) {
    revalidatePath('/admin');
    revalidatePath('/');
  }

  // On Vercel, even though we can't save the bet, we can still show a success message.
  // The Discord notification (if configured) will still work.
  if (process.env.VERCEL) {
    return { message: 'Bet submitted! The house has been notified on Discord.', success: true };
  }

  return { message: `Bet submitted! Please pay in-game now. The house will confirm and grant you access to play.`, success: true };
}

export async function confirmBetAction(betId: string): Promise<FormState> {
  if (process.env.VERCEL) {
    return { message: 'This action is not available in this hosting environment.', success: false };
  }
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
    if (!process.env.VERCEL) revalidatePath('/admin');
    
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
        if (!process.env.VERCEL) revalidatePath('/admin');
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
    if (!process.env.VERCEL) revalidatePath('/admin');

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
        if (!process.env.VERCEL) revalidatePath('/admin');
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
    if (!process.env.VERCEL) revalidatePath('/admin');
    
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


// --- Roulette Game Logic ---
const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

interface RouletteBet {
  type: string;
  value: string | number;
  wager: number;
}

function calculatePayout(bet: RouletteBet, winningNumber: number): number {
  const isRed = RED_NUMBERS.includes(winningNumber);
  const isBlack = winningNumber !== 0 && !isRed;
  const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
  const isOdd = winningNumber !== 0 && winningNumber % 2 !== 0;

  switch (bet.type) {
    case 'straight':
      return parseInt(bet.value as string, 10) === winningNumber ? bet.wager * 36 : 0;
    case 'color':
      if (bet.value === 'red' && isRed) return bet.wager * 2;
      if (bet.value === 'black' && isBlack) return bet.wager * 2;
      return 0;
    case 'parity':
      if (bet.value === 'even' && isEven) return bet.wager * 2;
      if (bet.value === 'odd' && isOdd) return bet.wager * 2;
      return 0;
    case 'range':
      if (bet.value === '1-18' && winningNumber >= 1 && winningNumber <= 18) return bet.wager * 2;
      if (bet.value === '19-36' && winningNumber >= 19 && winningNumber <= 36) return bet.wager * 2;
      return 0;
    case 'dozen':
      if (bet.value === '1st 12' && winningNumber >= 1 && winningNumber <= 12) return bet.wager * 3;
      if (bet.value === '2nd 12' && winningNumber >= 13 && winningNumber <= 24) return bet.wager * 3;
      if (bet.value === '3rd 12' && winningNumber >= 25 && winningNumber <= 36) return bet.wager * 3;
      return 0;
    case 'column':
        const col1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
        const col2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
        const col3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
        if (bet.value === 'col1' && col1.includes(winningNumber)) return bet.wager * 3;
        if (bet.value === 'col2' && col2.includes(winningNumber)) return bet.wager * 3;
        if (bet.value === 'col3' && col3.includes(winningNumber)) return bet.wager * 3;
        return 0;
    default:
      return 0;
  }
}

export async function playRouletteAction(betId: string): Promise<{
    winningNumber: number;
    totalPayout: number;
    message: string;
}> {
    const allBets = await readBets();
    const betIndex = allBets.findIndex(b => b.id === betId);

    if (betIndex === -1 || allBets[betIndex].status !== 'active') {
        throw new Error('Active bet not found.');
    }

    const bet = allBets[betIndex];

    // House edge: slightly increase chance of 0
    const random = Math.random();
    const winningNumber = random < 0.028 ? 0 : ROULETTE_NUMBERS[Math.floor(Math.random() * (ROULETTE_NUMBERS.length -1)) + 1];

    const placedBets: RouletteBet[] = JSON.parse(bet.details);
    let totalPayout = 0;
    placedBets.forEach(placedBet => {
        totalPayout += calculatePayout(placedBet, winningNumber);
    });
    
    bet.status = 'completed';
    bet.result = totalPayout > bet.wager ? 'win' : 'loss';
    bet.payout = totalPayout;
    
    await writeBets(allBets);
    if (!process.env.VERCEL) revalidatePath('/admin');
    
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
        const discordPayload = {
            username: "Loler's Gambling House",
            avatar_url: "https://raw.githubusercontent.com/Minecraft-Dot-NET/minecraft-assets/master/java-edition/1.20.2/assets/minecraft/textures/item/diamond.png",
            embeds: [
                {
                    title: `Roulette Result: ${bet.minecraftUsername} ${totalPayout > bet.wager ? 'Won!' : 'Lost.'}`,
                    description: `Bet ID: ${bet.id}`,
                    color: totalPayout > bet.wager ? 65340 : 16711680,
                    timestamp: new Date().toISOString(),
                    fields: [
                        { name: "Winning Number", value: `${winningNumber}`, inline: true },
                        { name: "Total Wager", value: `$${bet.wager.toFixed(2)}`, inline: true },
                        { name: "Total Payout", value: `$${totalPayout.toFixed(2)}`, inline: true },
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
        winningNumber,
        totalPayout,
        message: totalPayout > 0 ? `Congratulations! You won $${totalPayout.toFixed(2)}` : 'Better luck next time.'
    };
}
