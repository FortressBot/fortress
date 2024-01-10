import AntiGhostPing from "../models/AntiGhostPing";
import { Event } from "../structures/Event";

export default new Event("messageDelete", async(msg) => {
    if(msg.author.bot) return;

    const agp = await AntiGhostPing.findOne({ Guild: msg.guild.id });

    if(!agp) return;

    else {
        if(msg.mentions.members.first()) {
            const ms = await msg.channel.send({ content: `<@${msg.member.id}>, you cannot ghost ping!` });

            setTimeout(() => { ms.delete() }, 3000);
        } else return;
    }
});