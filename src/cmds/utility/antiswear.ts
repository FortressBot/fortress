import { Command } from "../../structures/Command";
import Antiswear from "../../models/Antiswear";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Reply from "../../functions/reply";

export default new Command({
    name: 'antiswear',
    description: 'Toggle the antiswear system!',
    options: [
        {
            name: 'add-exception',
            description: 'Add an exception to the antiswear system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to exempt!',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'toggle',
            description: 'Toggle the antiswear system! (on/off)',
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'remove-exception',
            description: 'Remove an exception from the antiswear system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to remove!',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const as = await Antiswear.findOne({ Guild: guild.id });

        const sub = opts.getSubcommand();
        const user = opts.getUser('user') || interaction.user;

        switch(sub) {
            case 'add-exception': {
                if(!as) throw "The antiswear system is not enabled!";

                if(as.Exceptions.includes(user.id)) throw "That user is already exempt!";

                as.Exceptions.push(user.id);
                as.save();

                return Reply(interaction, `Added <@${user.id}> as an exception to the antiswear system.`, '✅', 'Blurple', false);
            }
            break;

            case 'remove-exception': {
                if(!as) throw "The antiswear system is not enabled!";

                if(!as.Exceptions.includes(user.id)) throw "That user is already not exempt!";

                const index = as.Exceptions.indexOf(user.id);

                as.Exceptions.splice(index, 1);
                as.save();

                return Reply(interaction, `Removed <@${user.id}> as an exception to the antiswear system.`, '✅', 'Blurple', false);   
            }
            break;

            case 'toggle': {
                if(!as) {
                    await Antiswear.create({
                        Guild: guild.id
                    });
                    
                    return Reply(interaction, `Antiswear has been enabled.`, `✅`, 'Blurple', true);
                } else {
                    await as.deleteOne({ new: true });
        
                    return Reply(interaction, `Antiswear has been disabled.`, `✅`, 'Blurple', true);
                }
            }
            break;
        }
    }
})