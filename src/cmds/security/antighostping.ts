import { Command } from "../../structures/Command";
import AntiGhostPing from "../../models/AntiGhostPing";
import Reply from "../../functions/reply";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'antighostping',
    description: 'Toggle the anti ghost ping system!',
    userPermissions: ['ManageGuild'],

    run: async({ interaction, guild, client }) => {
        const agp = await AntiGhostPing.findOne({ Guild: guild.id });
        const mod = await getFortressEmoji(client, 'mod');
        const ping = await getFortressEmoji(client, 'ping');

        const embed1 = await ConstructEmbed(interaction, `${ping} The anti-ghost system has been set up!\n**${mod}** Moderator: <@${interaction.member.id}>`);
        const embed2 = await ConstructEmbed(interaction, `${ping} The anti-ghost system has been disabled!\n**${mod}** Moderator: <@${interaction.member.id}>`);

        if(!agp) {
            await AntiGhostPing.create({
                Guild: guild.id,
            });

            return interaction.reply({
                embeds: [embed1]
            });
        } else {
            await agp.deleteOne({ new: true });

            return interaction.reply({
                embeds: [embed2]
            });
        }
    }
})