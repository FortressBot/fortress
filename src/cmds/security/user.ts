import { ApplicationCommandOptionType, AuditLogEvent, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import Reply from "../../functions/reply";
import Punishment from "../../models/Punishment";
import ConstructEmbed from "../../functions/embedconstructor";
import getFortressEmoji from "../../functions/getfortressemoji";

export default new Command({
    name: 'user',
    description: 'User management commands.',
    userPermissions: ['ModerateMembers', 'ViewAuditLog', 'BanMembers', 'KickMembers'],
    clientPermissions: ['ViewAuditLog', 'KickMembers'],
    options: [
        {
            name: 'ban',
            description: 'Ban a user and any IP their account belongs to from the server',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to ban from the server',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason for banning the user',
                    type: ApplicationCommandOptionType.String,
                    max_length: 1024
                }
            ],
        },
        {
            name: 'kick',
            description: 'Kick a user from the server',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to kick from the server',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason for kicking the user',
                    type: ApplicationCommandOptionType.String,
                    max_length: 1024
                }
            ],
        },
        {
            name: 'warn',
            description: 'Warn a user for their actions!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to warn!',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason for warning the user!',
                    type: ApplicationCommandOptionType.String,
                    max_length: 1024,
                }
            ]
        },
        {
            name: 'status',
            description: 'Get the VC status & online status of a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to inspect!',
                    type: ApplicationCommandOptionType.User
                }
            ]
        },
        {
            name: 'recentpunishments',
            description: 'Get a user\'s recent punishments!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to inspect!',
                    required: true,
                    type: ApplicationCommandOptionType.User
                }
            ]
        },
        {
            name: 'unban',
            description: 'Unban a user using their ID!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'userid',
                    description: 'The ID of the user.',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    max_length: 18,
                }
            ]
        },
        {
            name: 'excuse',
            description: 'Excuse a member of their timeout',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to timeout',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const user = opts.getUser('user');
        const userid = opts.getString('userid');

        const unban = await getFortressEmoji(client, 'unban');
        const mod = await getFortressEmoji(client, 'mod');
        const mem = await getFortressEmoji(client, 'member');

        switch(sub) {
            case 'ban': {
                const reason = opts.getString('reason') || "No Reason. | Banned by Fortress";
        
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That user is not in this server.";

                if(member.id === interaction.user.id) throw "You cannot ban yourself.";
        
                if(member.roles.highest.position >= interaction.member.roles.highest.position)
                    throw "That user has a higher role position than you.";
        
                if(!member.bannable) return;
                else {
                    await Punishment.create({
                        Guild: guild.id,
                        Moderator: interaction.user.id,
                        Reason: reason,
                        Type: 'Ban',
                        User: member.id
                    });

                    await member.ban({
                        reason: reason,
                    });
        
                    return Reply(interaction, `${member.user.tag} has successfully been banned.`, '✅', 'Blurple', false);
                }
            }
            break;
            
            case 'kick': {
                const reason = opts.getString('reason') || "No Reason. | Kicked by Fortress";
        
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That user is not in this server.";

                if(member.id === interaction.user.id) throw "You cannot kick yourself.";
        
                if(member.roles.highest.position >= interaction.member.roles.highest.position)
                    throw "That user has a higher role position than you.";
        
                if(!member.kickable) return;
                else {
                    await Punishment.create({
                        Guild: guild.id,
                        Moderator: interaction.user.id,
                        Reason: reason,
                        Type: 'Kick',
                        User: member.id
                    });

                    await member.kick(reason);
        
                    return Reply(interaction, `${member.user.tag} has successfully been kicked.`, '✅', 'Blurple', false);
                }
            }
            break;

            case 'warn': {
                const reason = opts.getString('reason') || `Warned by Fortress - ${interaction.user.tag}`;

                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That user is not in this server.";
        
                if(member.roles.highest.position >= interaction.member.roles.highest.position)
                    throw "That user has a higher role position than you.";

                if(member.id === interaction.user.id) throw "You cannot warn yourself.";

                await Punishment.create({
                    Guild: guild.id,
                    Moderator: interaction.user.id,
                    Reason: reason,
                    Type: 'Warn',
                    User: member.id
                });

                const msg = await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<@${member.id}> You have been warned!`)
                        .setDescription(`A warning has been given to you by <@${interaction.user.id}>.\n**Reason: ${reason}**\n\n*This message will be deleted in 30 seconds.*`)
                        .setColor('Blue')
                        .setAuthor({ name: `${interaction.member.nickname}`, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
                    ]
                });

                Reply(interaction, `Successfully warned <@${member.id}>`, `✅`, 'Blurple', true);

                setTimeout(() => {
                    msg.delete();
                }, 30000);
            }
            break;

            case 'status': {
                const user = opts.getUser('user') || interaction.user;
                const member = await guild.members.cache.get(user.id);

                if(!member) throw "That member is not in this server.";

                const userjoined = `<t:${Math.round(member.joinedTimestamp / 1000)}> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`;
                const usercreated = `<t:${Math.round(user.createdTimestamp / 1000)}> (<t:${Math.round(user.createdTimestamp / 1000)}:R>)`;

                let vcstatus;

                if(!member.voice.channel) vcstatus = `User is not connected to voice.`;
                else if(member.voice.channel) vcstatus = `User is connected to voice (<#${member.voice.channel.id}>).\nConnected with ${member.voice.channel.members.size - 1} other members.`;

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`User Status - <@${member.id}>`)
                        .setFields(
                            { name: 'User Joined', value: `${userjoined}`, inline: true },
                            { name: 'User Created', value: `${usercreated}`, inline: true },
                            { name: `VC Status`, value: `${vcstatus}`, inline: true }
                        )
                    ]
                });
            }
            break;

            case 'recentpunishments': {
                const user = opts.getUser('user') || interaction.user;
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That member is not in this server.";
                const mutes = await guild.fetchAuditLogs({ user: member.id, type: AuditLogEvent.MemberUpdate });
                const bans = await guild.fetchAuditLogs({ user: member.id, type: AuditLogEvent.MemberBanAdd });
                const kicks = await guild.fetchAuditLogs({ user: member.id, type: AuditLogEvent.MemberKick });
                const roleupdates = await guild.fetchAuditLogs({ user: member.id, type: AuditLogEvent.MemberRoleUpdate });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`User's Recent Infractions - <@${member.id}>`)
                        .setDescription(`Below are the punishments/infractions that this user has received.`)
                        .setFields(
                            { name: 'Mutes (may not be accurate)', value: `${mutes.entries.size}`, inline: true },
                            { name: 'Bans', value: `${bans.entries.size}`, inline: true },
                            { name: 'Kicks', value: `${kicks.entries.size}`, inline: true },
                            { name: 'Role Updates', value: `${roleupdates.entries.size}`, inline: true }
                        )
                        .setColor('Blurple')
                    ]
                });
            }
            break;

            case 'unban': {
                await guild.bans.fetch();

                const bannedmember = await guild.bans.cache.find((b) => b.user.id === userid);
                if(!bannedmember) throw "That member is not banned in this server.";

                await guild.bans.remove(userid);

                const e = await ConstructEmbed(interaction, `${unban} Member unbanned.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${mem} Member unbanned: <@${userid}>**`);

                return interaction.reply({
                    embeds: [e.embed]
                });
            }
            break;

            case 'excuse': {
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That member is not in this server.";

                if(member.isCommunicationDisabled() === true) {
                    member.timeout(null);
                    return interaction.reply({
                        content: `Successfully excused <@${member.id}> of their timeout.`
                    });
                } else throw "That user isn't timed out!";
            }
            break;
        }
    }
});