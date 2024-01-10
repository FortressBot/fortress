import EveryoneDisable from "../models/EveryoneDisable";
import { Event } from "../structures/Event";

export default new Event("messageCreate", async(msg) => {
    const ed = await EveryoneDisable.findOne({ Guild: msg.guild.id });
    
    if(!ed) return;
    else {
        if(ed.Exceptions.includes(msg.author.id)) return;
        else {
            msg.delete();
            const m = await msg.channel.send({ content: `<@${msg.author.id}>, no pinging everyone!` });

            setTimeout(() => { m.delete(); }, 3000)
        }
    }
});