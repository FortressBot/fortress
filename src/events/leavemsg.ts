import { Event } from "../structures/Event";
import LeaveMessage from "../models/LeaveMessage";
import { ChannelType } from "discord.js";

export default new Event("guildMemberRemove", async(m) => {
    const { guild } = m;

    const lm = await LeaveMessage.findOne({ Guild: guild.id });
    if(!lm) return;
    else {
        const channel = await guild.channels.cache.get(lm.Channel);
        if(!channel) return;
        if(channel.type !== ChannelType.GuildText) return;

        channel.send({
            content: `<@${m.id}> has left the server!\n**${lm.Message}**`
        });
    }
});