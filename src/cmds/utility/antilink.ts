import { Command } from "../../structures/Command";
import Antilink from "../../models/Antilink";
import Reply from "../../functions/reply";
import { ApplicationCommandOptionType } from "discord.js";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'antilink',
    description: 'Stop links from being shown in your server!',
    userPermissions: ['ManageMessages'],
    options: [
        {
            name: 'mode',
            description: 'Antilink mode!',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'Block Discord server invites ONLY', value: 'invitesonly' },
                { name: 'Block ALL links', value: 'blockall' }
            ],
            required: true
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const al = await Antilink.findOne({ Guild: guild.id });
        const mode = opts.getString('mode');

        const link = await getFortressEmoji(client, 'link');
        const mod = await getFortressEmoji(client, 'mod');
        const config = await getFortressEmoji(client, 'config');

        const embed1 = await ConstructEmbed(interaction, `${link} Antilink has been enabled.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${config} Config: Block Discord server invites**`);
        const embed2 = await ConstructEmbed(interaction, `${link} Antilink has been enabled.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${config} Config: Block All Links**`);
        const embed3 = await ConstructEmbed(interaction, `${link} Antilink has been disabled.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${config} Config: Off**`)

        if(mode === 'invitesonly') {
            if(!al) {
                await Antilink.create({
                    Guild: guild.id,
                    Mode: 'invites'
                });
            
                return interaction.reply({
                    embeds: [embed1]
                });
            } else {
                await al.deleteOne({ new: true });
    
                return interaction.reply({
                    embeds: [embed3]
                });
            }
        } else if (mode === 'blockall') {
            if(!al) {
                await Antilink.create({
                    Guild: guild.id,
                    Mode: 'all'
                });
    
                return interaction.reply({
                    embeds: [embed2]
                })
            } else {
                await al.deleteOne({ new: true });
    
                return interaction.reply({
                    embeds: [embed3]
                });
            }
        }
    }
})