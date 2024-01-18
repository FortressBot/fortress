import { Event } from "../structures/Event";
import Welcome from "../models/Welcome";
import { ChannelType, EmbedBuilder } from "discord.js";
import { client } from "..";
import getFortressEmoji from "../functions/getfortressemoji";

export default new Event("guildMemberAdd", async(m) => {
    const { guild } = m;

    const wel = await Welcome.findOne({ Guild: guild.id });

    const modtick = await getFortressEmoji(client, 'modtick');
    const msg = await getFortressEmoji(client, 'msg');
    const anc = await getFortressEmoji(client, 'announcement');

    if(!wel) return;
    else {
        const welcomechannel = await guild.channels.cache.get(wel.WelcomeChannel);
        if(!welcomechannel) return;

        if(welcomechannel.type === ChannelType.GuildText) {
            return welcomechannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL({ size: 1024 })}` })
                    .setImage(guild.bannerURL({ size: 2048 }))
                    .setTitle(`New Member Joined!`)
                    .setDescription(`<@${m.id}>, welcome to the server!\n\n**${modtick} Check out our rules/guidelines: <#${wel.RulesChannel}>**\n**${anc} Get notified when new things happen: <#${wel.AnnouncementsChannel}>**\n**${msg} Chat with other members of the server: <#${wel.ChatChannel}>**`)
                    .setFields(
                        { name: 'User Created', value: `<t:${Math.round(m.user.createdTimestamp / 1000)}> (<t:${Math.round(m.user.createdTimestamp / 1000)}:R>)`, inline: true },
                        { name: 'User Joined', value: `<t:${Math.round(m.joinedTimestamp / 1000)}> (<t:${Math.round(m.joinedTimestamp / 1000)}:R>)`, inline: true }
                    )
                    .setThumbnail(m.displayAvatarURL({ size: 2048 }))
                ]
            });
        } else return;
    }
});