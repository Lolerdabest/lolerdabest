
'use server';

import { z } from 'zod';

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

export async function placeBetAction(
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
          title: "New Bet Submitted!",
          description: "Awaiting payment and confirmation from the house.",
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
      const errorBody = await response.text();
      console.error('Discord webhook error:', errorBody);
      throw new Error(`Failed to send bet to Discord. Status: ${response.status}`);
    }

    return { message: `Bet submitted! Please pay in-game now. The house will confirm and roll for you.`, success: true };
  } catch (error) {
    console.error('Bet submission failed:', error);
    return { message: 'Something went wrong. Please try again.', success: false };
  }
}
