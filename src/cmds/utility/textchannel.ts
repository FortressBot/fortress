import ConstructEmbed from "../../functions/embedconstructor";
import getFortressEmoji from "../../functions/getfortressemoji";
import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

export default new Command({
    name: 'textchannel',
    description: 'Text channel management commands',
    userPermissions: ["ManageChannels"],
    options: [
        {
            name: 'lock',
            description: 'Lock/unlock a channel to prevent members from sending messages',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'lock',
                    description: 'Lock status!',
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: 'Lock Channel', value: `lockchannel` },
                        { name: 'Unlock Channel', value: `unlockchannel` }
                    ],
                    required: true
                },
                {
                    name: 'channel',
                    description: 'The channel you want to lock!',
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ]
        },
        {
            name: 'clear',
            description: 'Clear all messages from a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to clear all messages from',
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ]
        },
        {
            name: 'slowmode',
            description: 'Set a slowmode for a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'duration',
                    description: 'The duration you want to lock the channel for (in seconds)',
                    type: ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'channel',
                    description: 'The channel you want to set the slowmode for',
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ]
        },
        {
            name: 'purge',
            description: 'Delete a specified amount of messages from a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    description: 'The amount of messages you want to delete',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    max_value: 100,
                    min_value: 1,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const amount = opts.getInteger('amount');
        const channel = opts.getChannel('channel') || interaction.channel;
        const duration = opts.getInteger('duration');
        const lock = opts.getString('lock');

        const lockemoji = await getFortressEmoji(client, 'lock');
        const unlock = await getFortressEmoji(client, 'unlock');
        const mod = await getFortressEmoji(client, 'mod');
        const announcement = await getFortressEmoji(client, 'announcement');
        const wait = await getFortressEmoji(client, 'wait');
        const del = await getFortressEmoji(client, 'delete');

        const validch = await guild.channels.cache.get(channel.id);
        if(!validch) throw "That is not a valid channel in this server.";

        switch(sub) {
            case 'lock': {
                const noadminroles = await guild.roles.cache.filter((roles) => !roles.permissions.has('Administrator'));

                if(!noadminroles.size) throw "All roles in the server have Administrator, so I am unable to lock this channel.";
                
                if(lock === 'lockchannel') {
                    noadminroles.forEach((role) => {
                        validch.permissionsFor(role.id).remove('SendMessages');
                    });

                    const e = await ConstructEmbed(interaction, `${lockemoji} This channel has been locked!\n**${mod} Moderator: <@${interaction.member.id}>**`)

                    interaction.channel.send({
                        embeds: [
                            e.embed
                        ]
                    });

                    return interaction.reply({
                        content: `:white_check_mark: Locked channel!`,
                        ephemeral: true,
                    });
                } else if(lock === 'unlockchannel') {
                    noadminroles.forEach((role) => {
                        validch.permissionsFor(role.id).add('SendMessages');
                    });

                    const e = await ConstructEmbed(interaction, `${unlock} This channel has been unlocked!\n**${mod} Moderator: <@${interaction.member.id}>**`)

                    interaction.channel.send({
                        embeds: [
                            e.embed
                        ]
                    });

                    return interaction.reply({
                        content: `:white_check_mark: Unlocked channel!`,
                        ephemeral: true,
                    });
                }
            }
            break;

            case 'clear': {
                if(validch.type === ChannelType.GuildText) {
                    const newch = await validch.clone();
                    const ogpos = validch.position;

                    validch.delete();
                    newch.setPosition(ogpos);

                    const e = await ConstructEmbed(interaction, `${announcement} This channel has been cleared.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                    return newch.send({
                        embeds: [e.embed]
                    });
                } else throw "Uh oh, this channel isn't a text channel.";
            }
            break;

            case 'slowmode': {
                const ms = duration * 1000;

                if(validch.type === ChannelType.GuildText) {
                    validch.setRateLimitPerUser(ms);

                    const e = await ConstructEmbed(interaction, `${wait} Slowmode has been set for this channel.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                    validch.send({
                        embeds: [e.embed]
                    });

                    return interaction.reply({
                        content: `Successfully set slowmode.`,
                        ephemeral: true
                    });
                } else throw "Uh oh, this channel isn't a text channel.";
            }
            break;

            case 'purge': {
                if(validch.type === ChannelType.GuildText) {
                    const messages = await validch.messages.fetch({ limit: amount + 1 });
                    await validch.bulkDelete(messages);

                    const e = await ConstructEmbed(interaction, `${del} This channel has been purged of ${messages.size} messages.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                    validch.send({
                        embeds: [e.embed]
                    });

                    return interaction.reply({
                        content: `Successfully purged.`,
                        ephemeral: true,
                    });
                } else throw "Uh oh, this channel isn't text-based.";
            }
            break;
        }
    }
})