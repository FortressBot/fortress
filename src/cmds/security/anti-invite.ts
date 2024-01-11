import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'anti-invite',
    description: 'Stop members from inviting people to your server.',
    clientPermissions: ['ManageRoles', 'ManageGuild'],
    userPermissions: ['ManageRoles'],
    options: [
        {
            name: 'enable',
            description: 'Enable anti-invite.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'disable',
            description: 'Disable anti-invite',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();

        const mod = await getFortressEmoji(client, 'mod');
        const anti_inv = await getFortressEmoji(client, 'anti-invite');

        const e1 = await ConstructEmbed(interaction, `${anti_inv} Anti-Invite enabled.\n**${mod} Moderator: <@${interaction.member.id}>**`);
        const e2 = await ConstructEmbed(interaction, `${anti_inv} Anti-Invite disabled.\n**${mod} Moderator: <@${interaction.member.id}>**`);

        switch(sub) {
            case 'enable': {
                const validroles = await guild.roles.cache.filter((r) => r.position < guild.members.me.roles.highest.position && !r.managed)

                if(!validroles || validroles.size <= 0) throw "There are no valid roles for me to change permissions for.";

                validroles.forEach((vr) => {
                    vr.permissions.remove('CreateInstantInvite');
                });

                if(guild.invites.cache.size <= 0) {
                    return interaction.reply({
                        embeds: [e1.embed],
                        components: [e1.row]
                    });
                } else {
                    guild.invites.cache.forEach((inv) => inv.delete());

                    return interaction.reply({
                        embeds: [e1.embed],
                        components: [e1.row]
                    });
                }
            }
            break;

            case 'disable': {
                const validroles = await guild.roles.cache.filter((r) => r.position < guild.members.me.roles.highest.position && !r.managed)

                if(!validroles || validroles.size <= 0) throw "There are no valid roles for me to change permissions for.";

                validroles.forEach((vr) => {
                    vr.permissions.add('CreateInstantInvite');
                });

                return interaction.reply({
                    embeds: [e1.embed],
                    components: [e1.row]
                });
            }
            break;
        }
    }
})