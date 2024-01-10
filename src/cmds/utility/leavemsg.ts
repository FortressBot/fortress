import { Command } from "../../structures/Command";
import LeaveMessage from "../../models/LeaveMessage";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'leavemsg',
    description: 'Send a message to a channel when a user leaves the server!',
    options: [
        {
            name: 'enable',
            description: 'Enable the leavemsg system.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want the message to be sent to',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: 'message',
                    description: 'The message you want to be displayed when a user leaves!',
                    type: ApplicationCommandOptionType.String,
                    max_length: 1024,
                    required: true,
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable the leavemsg system.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'edit-channel',
            description: 'Edit the channel that the message will be sent to.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The new channel to send messages to.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildText]
                }
            ]
        },
        {
            name: 'edit-message',
            description: 'Edit the message you want to be sent to the channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message',
                    description: 'The new message you want to be sent to the channel.',
                    type: ApplicationCommandOptionType.String,
                    max_length: 1024,
                    required: true,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const message = opts.getString('message');
        const channel = opts.getChannel('channel');

        const lm = await LeaveMessage.findOne({ Guild: guild.id });

        const mod = await getFortressEmoji(client, 'mod');
        const msg = await getFortressEmoji(client, 'msg');
        const tick = await getFortressEmoji(client, 'tick');
        const ping = await getFortressEmoji(client, 'ping');

        switch(sub) {
            case 'enable': {
                if(lm) throw "The LeaveMessage system is already enabled.";

                const validch = await guild.channels.cache.get(channel.id);
                if(!validch) throw "That channel is not in this server.";

                if(validch.type !== ChannelType.GuildText) throw "That channel is not a text channel.";

                await LeaveMessage.create({
                    Guild: guild.id,
                    Channel: validch.id,
                    Message: message,
                });

                const e = await ConstructEmbed(interaction, `${tick} LeaveMessage enabled.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${msg} Message: "${message}"**\n**${ping} Channel: <#${validch.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'disable': {
                if(!lm) throw "The LeaveMessage system is already disabled.";

                await lm.deleteOne({ new: true });

                const e = await ConstructEmbed(interaction, `${tick} LeaveMessage disabled.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'edit-channel': {
                if(!lm) throw "The LeaveMessage system is not enabled.";

                const validch = await guild.channels.cache.get(channel.id);
                if(!validch) throw "That channel is not in this server.";

                if(validch.type !== ChannelType.GuildText) throw "That channel is not a text channel.";

                lm.Channel = validch.id;
                lm.save();

                const e = await ConstructEmbed(interaction, `${tick} LeaveMessage changed.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${ping} New Channel: <#${validch.id}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'edit-message': {
                if(!lm) throw "The LeaveMessage system is not enabled.";

                lm.Message = message;
                lm.save();

                const e = await ConstructEmbed(interaction, `${tick} LeaveMessage changed.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${ping} New Message: "${message}"**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;
        }
    }
})