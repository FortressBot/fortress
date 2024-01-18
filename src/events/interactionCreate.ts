import { CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedGuild, ExtendedInteraction } from "../typings/Command";
import ConstructEmbed from '../functions/embedconstructor';

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if(command.userPermissions) {
            command.userPermissions.forEach((cmdperm) => {
                if(!interaction.memberPermissions.has(cmdperm)) throw "You do not have the appropriate permissions to run this command!";
            });
        }

        if (!command)
            return interaction.reply({ content: "You have used a non existent command" });

        try {
            await command.run({
                opts: interaction.options as CommandInteractionOptionResolver,
                client,
                guild: interaction.guild as ExtendedGuild,
                interaction: interaction as ExtendedInteraction
            });
        } catch (err) {
            console.log(err);
            const e = await ConstructEmbed(interaction, `**❌ Error**\n*An error has occurred:*\n${err}`);

            return interaction.reply({
                embeds: [e]
            });
        }
    }
});
