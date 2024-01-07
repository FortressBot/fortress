import { Command } from "../../structures/Command";
import EveryoneDisable from "../../models/EveryoneDisable";
import { ApplicationCommandOptionType } from "discord.js";
import Reply from "../../functions/reply";

export default new Command({
    name: 'everyonedisable',
    description: 'Stop people from pinging @everyone!',
    userPermissions: ["MentionEveryone"],
    options: [
        {
            name: 'add-exception',
            description: 'Add an exception to the EveryoneDisable system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to exempt!',
                    required: true,
                    type: ApplicationCommandOptionType.User
                }
            ]
        },
        {
            name: 'remove-exception',
            description: 'Remove an exception from the EveryoneDisable system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to remove!',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'toggle',
            description: 'Toggle the EveryoneDisable system! (on/off)',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const user = opts.getUser('user') || interaction.user;
        const member = await guild.members.cache.get(user.id);
        if(!member) throw "That member is not in this server.";

        const ed = await EveryoneDisable.findOne({ Guild: guild.id });

        switch(sub) {
            case 'add-exception': {
                if(!ed) throw "The EveryoneDisable system is not enabled!";

                if(ed.Exceptions.includes(member.id)) throw "That user is already exempt!";

                ed.Exceptions.push(member.id);
                ed.save();

                return Reply(interaction, `Added <@${member.id}> as an exemption to the EveryoneDisable system!`, `✅`, 'Blurple', false);
            }
            break;

            case 'remove-exception': {
                if(!ed) throw "The EveryoneDisable system is not enabled!";

                if(!ed.Exceptions.includes(member.id)) throw "That user is already not exempt!";

                const index = ed.Exceptions.indexOf(member.id);
                if(!index) throw "That member is already not exempt!";

                ed.Exceptions.splice(index, 1);
                ed.save();

                return Reply(interaction, `Removed <@${member.id}> as an exemption to the EveryoneDisable system!`, `✅`, 'Blurple', false);
            }
            break;

            case 'toggle': {
                if(!ed) {
                    await EveryoneDisable.create({
                        Guild: guild.id
                    });

                    return Reply(interaction, `Enabled the EveryoneDisable system. No one will be able to ping @everyone.`, `✅`, `Blurple`, true);
                } else {
                    await ed.deleteOne({ new: true });

                    return Reply(interaction, `Disabled the EveryoneDisable system.`, `✅`, 'Blurple', true);
                }
            }
            break;
        }
    }
})