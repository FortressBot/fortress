import { AuditLogEvent, ChannelType, EmbedBuilder, GuildBasedChannel } from "discord.js";
import { Event } from "../structures/Event";
import { client } from "..";
import RaidProtection from "../models/RaidProtection";
import RPUser from "../models/RP-User";

export default new Event("guildBanAdd", async(c) => {
    const { guild } = c;

    const rp = await RaidProtection.findOne({ Guild: guild.id }); // fetch db data

    const log = await guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd
    }).then(audit => audit.entries.first());

    const user = log.executor;

    if(user.id === client.user.id) return;

    if(rp.Exceptions.includes(user.id)) return;

    const ru = await RPUser.findOne({ Guild: guild.id, User: user.id });

    if(!ru) {
        const rpu = await RPUser.create({
            Guild: guild.id,
            User: user.id,
            ChannelCreate: 0,
            ChannelDelete: 0,
            GuildBanAdd: 0,
            RoleCreate: 0,
            RoleDelete: 0,
        });

        rpu.GuildBanAdd + 1;
        rpu.save();
        return;
    }

    if(ru.GuildBanAdd > rp.GuildBanAddLimit) {
        const member = await guild.members.cache.get(ru.User);
        if(!member) return;

        const banEmbed = new EmbedBuilder()
        .setTitle(`fortress anti-raid`)
        .setColor('Green')
        .setDescription(`The user below attempted to raid and was successfully banned.`)
        .setFields(
            { name: 'User', value: `<@${member.id}>` },
            { name: 'Case', value: `Attempted to raid | Breaking the member ban limits` },
            { name: 'Punishment', value: `Banned` },
        )
        .setThumbnail(member.displayAvatarURL({ size: 1024 }))

        await member.ban();

        const sendableChannel = await guild.channels.cache.filter((ch) => ch.permissionsFor(client.user).has('SendMessages') && ch.type === ChannelType.GuildText).first();

        if(!sendableChannel) return;

        if(sendableChannel.type !== ChannelType.GuildText) return;
        else {
            sendableChannel.send({
                embeds: [banEmbed]
            });
        }
    } else {
        ru.GuildBanAdd + 1;
        ru.save();

        setTimeout(() => {
            ru.GuildBanAdd = 0;
            ru.save();
        }, 15000)
    }
});