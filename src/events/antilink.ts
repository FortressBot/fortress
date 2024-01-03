import Antilink from "../models/Antilink";
import { Event } from "../structures/Event";
import all_links from '../json/all-links.json';
import invitelinks from '../json/invite-links.json';

export default new Event("messageCreate", async(msg) => {
    const al = await Antilink.findOne({ Guild: msg.guildId });

    if(!al) return;
    else {
        if(al.Mode === 'all') {
            for (let i in all_links) {
                if(msg.content.includes(all_links[i])) {
                    msg.delete();
                    try {
                        return msg.author.send({ content: `You cannot send links in this server!` });
                    } catch (err) {
                        return;
                    }
                }
            }
        } else if (al.Mode === 'invites') {
            for (let i in invitelinks) {
                if(msg.content.includes(invitelinks[i])) {
                    msg.delete();
                    try {
                        return msg.author.send({ content: `You cannot promote your server in this server!` });
                    } catch (err) {
                        return;
                    }
                }
            }
        }
    }
});