import { Command } from "../../structures/Command";
import Welcome from "../../models/Welcome";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

export default new Command({
    name: 'welcome',
    description: 'Setup the welcome system',
    options: [
        {
            name: 'setup',
            description: 'Setup the welcome system',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want welcome messages to be sent to',
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: 'ruleschannel',
                    description: 'The rules channel for your server',
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: 'chatchannel',
                    description: 'Give a chat channel here',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: 'news',
                    description: 'The channel where you usually send announcements',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement]
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable the welcome system',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();

        const tick = await getFortressEmoji(client, 'tick');
        const mod = await getFortressEmoji(client, 'mod');
        const ping = await getFortressEmoji(client, 'ping');

        switch(sub) {
            case 'setup': {
                const channel = opts.getChannel('channel');
                const news = opts.getChannel('news');
                const rules = opts.getChannel('ruleschannel');
                const chat = opts.getChannel('chatchannel');

                const validch1 = await guild.channels.cache.get(channel.id);
                const validch2 = await guild.channels.cache.get(news.id);
                const validch3 = await guild.channels.cache.get(rules.id);
                const validch4 = await guild.channels.cache.get(chat.id);

                if(!validch1) throw "The welcome system channel is not valid.";
                if(!validch2) throw "The news channel provided is not valid.";
                if(!validch3) throw "The rules channel provided is not valid.";
                if(!validch4) throw "The chat channel provided is not valid.";

                const wel = await Welcome.findOne({ Guild: guild.id });
                if(wel) throw "The welcome system is already set up.";

                await Welcome.create({
                    Guild: guild.id,
                    AnnouncementsChannel: validch2.id,
                    ChatChannel: validch4.id,
                    RulesChannel: validch3.id,
                    WelcomeChannel: validch1.id
                });

                const e = await ConstructEmbed(interaction, `${tick} Welcome system has been set up.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${ping} Welcome Channel: <#${validch1.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'disable': {
                const wel = await Welcome.findOne({ Guild: guild.id });
                if(!wel) throw "You do not have the welcome system enabled.";

                await wel.deleteOne({ new: true });

                const e = await ConstructEmbed(interaction, `${tick} Welcome system has been disabled.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;
        }
    }
})