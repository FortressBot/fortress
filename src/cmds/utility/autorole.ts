import { Command } from "../../structures/Command";
import Autorole from "../../models/Autorole";
import { ActionRowBuilder, ApplicationCommandOptionType } from "discord.js";
import Reply from "../../functions/reply";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'autorole',
    description: 'Give user roles when they join the server!',
    userPermissions: ['ModerateMembers', 'ManageRoles'],
    clientPermissions: ['ManageRoles'],
    options: [
        {
            name: 'enable',
            description: 'Turn on the autorole system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to add to new users!',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable the autorole system!',
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'add',
            description: 'Add a role to the autorole system',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to give to new users',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a role from the autorole system',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to remove from the autorole system',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const ro = opts.getRole('role');
        const autorolesys = await Autorole.findOne({ Guild: guild.id });

        const adduser = await getFortressEmoji(client, 'adduser');
        const removeuser = await getFortressEmoji(client, 'removeuser');
        const mod = await getFortressEmoji(client, 'mod');

        switch(sub) {
            case 'enable': {
                const role = await guild.roles.cache.get(ro.id);
                if(!role) throw "That role does not exist in this server.";
                if(role.position >= guild.members.me.roles.highest.position) throw "That role is higher than my highest role position. Please give me a higher ranking role."
                if(autorolesys) throw "The autorole system is already enabled!";

                await Autorole.create({
                    Guild: guild.id,
                    Role: [role.id]
                });

                const { embed } = await ConstructEmbed(interaction, `${adduser} Autorole system enabled.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${adduser} Role: <@${role.id}>**`);

                return interaction.reply({
                    embeds: [embed]
                });
            }
            break;

            case 'disable': {
                if(!autorolesys) throw "The autorole system is already disabled!";

                await autorolesys.deleteOne({ new: true });

                return Reply(interaction, `Autorole system has been disabled.`, `✅`, 'Blurple', false);
            }
            break;

            case 'add': {
                if(!autorolesys) throw "The autorole system is disabled.";
                const role = await guild.roles.cache.get(ro.id);

                if(!role) throw "That role is not in this server.";

                autorolesys.Role.push(role.id);

                const { embed } = await ConstructEmbed(interaction, `${adduser} Autorole system changed.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${adduser} Role Added: <@${role.id}>**`);

                return interaction.reply({
                    embeds: [embed]
                });
            }
            break;

            case 'remove': {
                if(!autorolesys) throw "The autorole system is disabled.";
                const role = await guild.roles.cache.get(ro.id);

                if(!role) throw "That role is not in this server.";

                if(!autorolesys.Role.includes(role.id))
                    throw "That role is not in the autorole system.";
                
                const index = autorolesys.Role.indexOf(role.id);
                autorolesys.Role.splice(index, 1);
                autorolesys.save();

                const e = await ConstructEmbed(interaction, `${adduser} Autorole system changed.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${removeuser} Role Removed: <@${role.id}>**`);

                return interaction.reply({
                    embeds: [e.embed],
                });
            }
            break;
        }
    }
});