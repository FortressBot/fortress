import { Command } from "../../structures/Command";
import RaidProtection from "../../models/RaidProtection";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'raidprotection',
    description: 'Change raid protection settings',
    userPermissions: ["ManageGuild"],
    options: [
        {
            name: 'add-exception',
            description: 'Add an exception to triggering the raid protection',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to add as an exception',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ]
        },
        {
            name: 'remove-exception',
            description: 'Remove an exception from triggering the raid protection',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to remove as an exception',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ]
        },
        {
            name: 'check-exceptions',
            description: 'Check all of the exceptions in the raid protection system',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    
    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const user = opts.getUser('user') || interaction.user;
        const member = await guild.members.cache.get(user.id);
        if(!member) throw "That is not a valid member in this server.";

        const config = await getFortressEmoji(client, 'config');
        const adduser = await getFortressEmoji(client, 'adduser');
        const removeuser = await getFortressEmoji(client, 'removeuser');
        const mod = await getFortressEmoji(client, 'mod');
        
        let rp = await RaidProtection.findOne({ Guild: guild.id });

        switch(sub) {
            case 'add-exception': {
                if(rp.Exceptions.includes(member.id)) throw "That member is already an exception.";

                rp.Exceptions.push(member.id);
                rp.save();

                const e = await ConstructEmbed(interaction, `${config} Raid Protection Exception Added.\n**${adduser} Exception Added: <@${member.id}>**\n**${mod} Moderator: <@${interaction.member.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'remove-exception': {
                if(!rp.Exceptions.includes(member.id)) throw "That member is already an exception.";

                const index = rp.Exceptions.indexOf(member.id);

                rp.Exceptions.splice(index, 1);
                rp.save();

                const e = await ConstructEmbed(interaction, `${config} Raid Protection Exception Removed.\n**${removeuser} Exception Removed: <@${member.id}>**\n**${mod} Moderator: <@${interaction.member.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'check-exceptions': {
                if(rp.Exceptions.length <= 0) throw "There are no exceptions to the raid protection system.";

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Raid Protection - Exceptions (IDs)`)
                        .setDescription(`${rp.Exceptions.join(`, `)}`)
                    ]
                });
            }
            break;
        }
    }
})