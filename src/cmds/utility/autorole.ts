import { Command } from "../../structures/Command";
import Autorole from "../../models/Autorole";
import { ApplicationCommandOptionType } from "discord.js";
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
            name: 'change',
            description: 'Change the role given to new users!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to give to new users!',
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

        switch(sub) {
            case 'enable': {
                const role = await guild.roles.cache.get(ro.id);
                if(!role) throw "That role does not exist in this server.";
                if(role.position >= guild.members.me.roles.highest.position) throw "That role is higher than my highest role position. Please give me a higher ranking role."
                if(autorolesys) throw "The autorole system is already enabled!";

                await Autorole.create({
                    Guild: guild.id,
                    Role: role.id
                });

                return Reply(interaction, `Autorole system has been enabled with the role <@&${role.id}>.`, `✅`, 'Blurple', false);
            }
            break;

            case 'disable': {
                if(!autorolesys) throw "The autorole system is already disabled!";

                await autorolesys.deleteOne({ new: true });

                return Reply(interaction, `Autorole system has been disabled.`, `✅`, 'Blurple', false);
            }
            break;

            case 'change': {
                const role = await guild.roles.cache.get(ro.id);
                if(!role) throw "That role does not exist in this server.";
                if(role.position >= guild.members.me.roles.highest.position) throw "That role is higher than my highest role position. Please give me a higher ranking role."
                if(!autorolesys) throw "The autorole system is disabled.";

                await Autorole.findOneAndUpdate({ Guild: guild.id }, { Role: role.id }, { new: true });

                return Reply(interaction, `Autorole system has been changed.\nNew users will be given the <@&${role.id}> role.`, `✅`, 'Blurple', false);
            }
            break;
        }
    }
});