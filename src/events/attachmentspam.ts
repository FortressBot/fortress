import { Event } from "../structures/Event";
import AttachmentSpam from "../models/AttachmentSpam";

export default new Event("messageCreate", async(msg) => {
    if(msg.author.bot) return;

    const as = await AttachmentSpam.findOne({ Guild: msg.guildId });
    if(!as) return;

    if(msg.attachments.size <= 0) return;

    if(msg.attachments.size > as.Limit) {
        if(as.Punishment === 'kick') {
            msg.delete();
            return msg.member.kick(`Attachment spam system | Kicked by Fortress`);
        } else if (as.Punishment === 'mute') {
            msg.delete();
            msg.channel.send({
                content: `<@${msg.author.id}>, you have been muted for 10 minutes for including more than ${as.Limit} attachments in your message.`
            });

            return msg.member.timeout(30 * 1000, `Excessive attachment spam | Muted by Fortress`);
        }
    }
});