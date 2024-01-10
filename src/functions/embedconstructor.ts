import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import { ExtendedInteraction } from "../typings/Command"

export default async function ConstructEmbed(interaction: ExtendedInteraction, msg: string) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL({ size: 1024 })}` })
        .setFooter({ text: `Fortress`, iconURL: `${interaction.guild.members.me.displayAvatarURL({ size: 1024 })}` })
        .setDescription(`${msg}`)
    
    const button = new ButtonBuilder()
        .setCustomId('dismiss')
        .setEmoji('🗑️')
        .setLabel('Dismiss')
        .setStyle(ButtonStyle.Danger)
    
    const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(button)
    
    return { embed, row };
}