import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import axios from 'axios';
import Reply from "../../functions/reply";
import ConstructEmbed from "../../functions/embedconstructor";
import getFortressEmoji from "../../functions/getfortressemoji";

export default new Command({
    name: 'steal-emoji',
    description: 'Steal an emoji from another server!',
    userPermissions: ["ManageGuildExpressions", 'ManageEmojisAndStickers'],
    clientPermissions: ["ManageGuildExpressions", "ManageEmojisAndStickers"],
    options: [
        {
            name: 'emoji',
            description: 'The emoji you want to steal!',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'name',
            description: 'The name you want to give to the stolen emoji!',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        let emoji = opts.getString('emoji')?.trim();
        const name = opts.getString('name');

        if(emoji.startsWith('<') && emoji.endsWith('>')) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
                if(image) return "gif";
                else return "png";
            }).catch(err => {
                return "png";
            });

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }
        
        if (emoji.startsWith('<a') && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
                if(image) return "gif";
                else return "png";
            }).catch(err => {
                return "png";
            });

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }

        if(!emoji.startsWith("http")) throw "You cannot steal Discord default emojis.";
        if(!emoji.startsWith("https")) throw "You cannot steal Discord default emojis.";

        const e = await guild.emojis.create({ attachment: `${emoji}`, name: `${name}` });

        const addemoji = await getFortressEmoji(client, 'addemoji');
        const emo = await getFortressEmoji(client, 'emoji');
        const mod = await getFortressEmoji(client, 'mod');
        const search = await getFortressEmoji(client, 'search');

        const embed = await ConstructEmbed(interaction, `${addemoji} An emoji has been stolen.\n**${mod} User: <@${interaction.member.id}>**\n**${emo} Emoji: ${e}**\n**${search} Emoji Name: ${name}**`);

        return interaction.reply({
            embeds: [embed.embed]
        });
    }
});