import { Command } from "../../structures/Command";
import Antiswear from "../../models/Antiswear";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Reply from "../../functions/reply";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'antiswear',
    description: 'Toggle the antiswear system!',
    userPermissions: ['ManageMessages'],
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

    run: async({ interaction, guild, opts, client }) => {
        const as = await Antiswear.findOne({ Guild: guild.id });

        const sub = opts.getSubcommand();
        const user = opts.getUser('user') || interaction.user;

        const asemoji = await getFortressEmoji(client, 'antiswear');
        const mod = await getFortressEmoji(client, 'mod');
        const config = await getFortressEmoji(client, 'config');
        const adduser = await getFortressEmoji(client, 'adduser');
        const removeuser = await getFortressEmoji(client, 'removeuser');

        let userid;

        const embed1 = await ConstructEmbed(interaction, `${asemoji} Anti-Swear system enabled!\n**${mod} Moderator: <@${interaction.member.id}>**\n**${config} Config: Enabled**`);
        const embed2 = await ConstructEmbed(interaction, `${asemoji} Anti-Swear system disabled!\n**${mod} Moderator: <@${interaction.member.id}>**\n**${config} Config: Disabled**`);
        const embed3 = await ConstructEmbed(interaction, `${asemoji} Anti-Swear exception added!\n**${mod} Moderator: <@${interaction.member.id}>**\n**${adduser} User Added: <@${userid}>**`);
        const embed4 = await ConstructEmbed(interaction, `${asemoji} Anti-Swear exception removed!\n**${mod} Moderator: <@${interaction.member.id}>**\n**${removeuser} User Removed: <@${userid}>**`);

        switch(sub) {
            case 'add-exception': {
                if(!as) throw "The antiswear system is not enabled!";

                userid = user.id;

                if(as.Exceptions.includes(user.id)) throw "That user is already exempt!";

                as.Exceptions.push(user.id);
                as.save();

                return interaction.reply({
                    embeds: [embed3]
                });
            }
            break;

            case 'remove-exception': {
                if(!as) throw "The antiswear system is not enabled!";

                if(!as.Exceptions.includes(user.id)) throw "That user is already not exempt!";

                userid = user.id;

                const index = as.Exceptions.indexOf(user.id);

                as.Exceptions.splice(index, 1);
                as.save();

                return interaction.reply({
                    embeds: [embed4]
                })
            }
            break;

            case 'toggle': {
                if(!as) {
                    await Antiswear.create({
                        Guild: guild.id
                    });
                    
                    return interaction.reply({
                        embeds: [embed1]
                    })
                } else {
                    await as.deleteOne({ new: true });
        
                    return interaction.reply({
                        embeds: [embed2]
                    })
                }
            }
            break;
        }
    }
})