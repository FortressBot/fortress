import { EmbedBuilder } from "discord.js";
import { ExtendedInteraction } from "../typings/Command";

export default async function Reply(interaction: ExtendedInteraction, message: string, emoji: string, color, ephemeral: boolean) {
    return interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setDescription(`${emoji} | ${message}`)
            .setColor(color)
        ], ephemeral: ephemeral
    })
}