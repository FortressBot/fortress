import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";
import Lockdown from '../../models/Lockdown';

export default new Command({
    name: 'server',
    description: `Fortress' server management commands.`,
    userPermissions: ['ManageGuild', 'ManageChannels'],
    clientPermissions: ['ManageChannels', 'ManageGuild', 'ManageRoles'],
    options: [
        {
            name: 'lockdown',
            description: 'Activate a server-wide lockdown.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'on',
                    description: 'Activate lockdown for the server.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'announcementchannel',
                            description: 'The channel you want the lockdown message to be sent to.',
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                            channel_types: [ChannelType.GuildText]
                        }
                    ]
                },
                {
                    name: 'off',
                    description: 'Deactivate lockdown for the server.',
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ]
        },
    ],

    run: async({ interaction, guild, opts, client }) => {
        const subgroup = opts.getSubcommandGroup();
        const sub = opts.getSubcommand();

        const ld = await Lockdown.findOne({ Guild: guild.id });
        const clientMember = guild.members.me;

        const lock = await getFortressEmoji(client, 'lock');
        const unlock = await getFortressEmoji(client, 'unlock');
        const mod = await getFortressEmoji(client, 'mod');

        switch(subgroup) {
            case 'lockdown': {
                switch(sub) {
                    case 'on': {
                        if(ld) throw "This server already has a lockdown active.";
                        const announcementchannel = opts.getChannel('announcementchannel');

                        const validch = await guild.channels.cache.get(announcementchannel.id);
                        if(!validch) throw "That channel is not in this server.";

                        if(validch.type !== ChannelType.GuildText) throw "That channel isn't a text channel.";

                        const allvalidchannels = await guild.channels.cache.filter(
                            (ch) => ch.type === ChannelType.GuildText
                            && ch.permissionsFor(client.user).has('SendMessages')
                            && ch.manageable
                        );

                        let lockedchannels = [];

                        if(!allvalidchannels || allvalidchannels.size <= 0) throw "There are no valid channels to lock.\nPlease check my permissions.";

                        const allvalidroles = await guild.roles.cache.filter(
                            (r) => r.position < clientMember.roles.highest.position
                            && !r.managed
                            && r.permissions.has('SendMessages')
                        );

                        if(!allvalidroles || allvalidroles.size <= 0) throw "There are no valid roles for me to change permissions of.";

                        allvalidroles.forEach((role) => {
                            role.permissions.remove('SendMessages');
                        });

                        const e = await ConstructEmbed(interaction, `${lock} A server-wide lockdown has been triggered.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                        validch.send({
                            embeds: [e]
                        });

                        interaction.reply({
                            embeds: [e],
                            ephemeral: true,
                        });

                        await Lockdown.create({
                            Guild: guild.id,
                            AnncChannel: validch.id,
                        });
                        return;
                    }
                    break;

                    case 'off': {
                        if(!ld) throw "This server does not have a lockdown active.";
                        const announcementchannel = ld.AnncChannel;

                        const validch = await guild.channels.cache.get(announcementchannel);
                        if(!validch) throw "That channel is not in this server.";

                        if(validch.type !== ChannelType.GuildText) throw "That channel isn't a text channel.";

                        const allvalidroles = await guild.roles.cache.filter(
                            (r) => r.position < clientMember.roles.highest.position
                            && !r.managed
                        );

                        if(!allvalidroles || allvalidroles.size <= 0) throw "There are no valid roles for me to change permissions of.";

                        allvalidroles.forEach(async (role) => { 
                            role.permissions.remove('SendMessages');
                        });

                        const e = await ConstructEmbed(interaction, `${unlock} The server-wide lockdown has been lifted.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                        validch.send({
                            embeds: [e]
                        });

                        interaction.reply({
                            embeds: [e],
                            ephemeral: true,
                        });

                        return ld.deleteOne({ new: true });
                    }
                    break;
                }
            }
        }
    }
});