import { Event } from "../structures/Event";
import Antiswear from "../models/Antiswear";
import swears from '../json/swears.json';

export default new Event("messageCreate", async(msg) => {
    if(msg.author.bot) return;
    
    const as = await Antiswear.findOne({ Guild: msg.guildId });
    if(!as) return;
    else {
        for (let i in swears) {
            if(msg.content.includes(swears[i])) {
                if(as.Exceptions.includes(msg.author.id)) return;
                else {
                    msg.delete();
                    try {
                        return msg.author.send({ content: `You cannot say "${swears[i]}" in this server!` });
                    } catch (err) {
                        return;
                    }
                }
            }
        }
    }
});