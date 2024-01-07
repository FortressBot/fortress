import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";
import Reply from "../../functions/reply";

export default new Command({
    name: 'role',
    description: 'Grant/remove/check roles',
    options: [
        {
            name: 'grant',
            description: 'Grant someone a role',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to give',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                },
                {
                    name: 'user',
                    description: 'The user you want to give the role to',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a role from a user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to remove',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                },
                {
                    name: 'user',
                    description: 'The user you want to remove the role from',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'check',
            description: 'Check if someone has a role',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to check',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role you want to check',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const user = opts.getUser('user');
        const role = opts.getRole('role');

        const member = await guild.members.cache.get(user.id);
        const validrole = await guild.roles.cache.get(role.id);

        const role_emoji = await getFortressEmoji(client, 'members');
        const memberemoji = await getFortressEmoji(client, 'member');
        const mod = await getFortressEmoji(client, 'mod');
        const addrole = await getFortressEmoji(client, 'adduser');
        const removerole = await getFortressEmoji(client, 'removeuser');

        if(!member) throw "That is not a valid member in this server.";
        if(!validrole) throw "That is not a valid role in this server.";

        switch(sub) {
            case 'grant': {
                if(validrole.position > guild.members.me.roles.highest.position)
                    throw "That role is higher than my highest position.";

                if(member.roles.highest.position > guild.members.me.roles.highest.position)
                    throw "That member has a higher role position than my highest.";

                if(member.roles.cache.has(validrole.id)) throw "That member already has that role.";

                member.roles.add(validrole.id);

                const e = await ConstructEmbed(interaction, `${addrole} A role has been added to a user.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${memberemoji} Member: <@${member.id}>**\n**${role_emoji} Role: <@&${role.id}>**`);

                return interaction.reply({
                    embeds: [e]
                });
            }
            break;

            case 'remove': {
                if(validrole.position > guild.members.me.roles.highest.position)
                throw "That role is higher than my highest position.";

                if(member.roles.highest.position > guild.members.me.roles.highest.position)
                throw "That member has a higher role position than my highest.";

                if(!member.roles.cache.has(validrole.id)) throw "That member already doesn't have that role.";

                member.roles.remove(validrole.id);

                const e = await ConstructEmbed(interaction, `${removerole} A role has been removed from a user.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${memberemoji} Member: <@${member.id}>**\n**${role_emoji} Role: <@&${role.id}>**`);

                return interaction.reply({
                    embeds: [e]
                });
            }
            break;

            case 'check': {
                if(member.roles.cache.has(validrole.id)) {
                    return Reply(interaction, `<@${member.id}> does have the role <@&${validrole.id}>`, `✅`, ``, true);
                } else {
                    return Reply(interaction, `<@${member.id}> does not have the role <@&${validrole.id}>`, `✅`, ``, true);
                }
            }
            break;
        }
    }
})