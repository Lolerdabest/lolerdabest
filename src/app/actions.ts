
'use server';

import { z } from 'zod';

const betSchema = z.object({
  minecraftUsername: z.string().min(3, { message: "Username must be at least 3 characters." }),
  discordTag: z.string().min(2, { message: "Please enter your Discord username." }),
  betDetails: z.string().min(1, { message: "Bet details are missing." }),
  totalBetAmount: z.string(),
  paymentProof: z.instanceof(File).refine(file => file.size > 0, "Payment proof is required."),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function placeBetAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    minecraftUsername: formData.get('minecraftUsername'),
    discordTag: formData.get('discordTag'),
    betDetails: formData.get('betDetails'),
    totalBetAmount: formData.get('totalBetAmount'),
    paymentProof: formData.get('paymentProof'),
  };
  
  const validatedFields = betSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
      success: false,
    };
  }

  const { minecraftUsername, discordTag, betDetails, totalBetAmount, paymentProof } = validatedFields.data;
  
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
          title: "New Bet Placed!",
          color: 16763904, // Gold color
          timestamp: new Date().toISOString(),
          fields: [
            { name: "Minecraft Username", value: minecraftUsername, inline: true },
            { name: "Discord Tag", value: discordTag, inline: true },
            { name: "Total Bet Amount", value: `$${totalBetAmount}`, inline: true },
            { name: "Bet Details", value: betDetails },
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
      throw new Error(`Failed to send bet to Discord. Status: ${response.status}`);
    }

    return { message: `Bet placed successfully! We'll confirm your payment and notify you on Discord. Good luck!`, success: true };
  } catch (error) {
    console.error('Bet placement failed:', error);
    return { message: 'Something went wrong. Please try again.', success: false };
  }
}
