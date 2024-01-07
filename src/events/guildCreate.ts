import { Event } from "../structures/Event";
import RaidProtection from "../models/RaidProtection";

export default new Event("guildCreate", async(g) => {
    const r = await RaidProtection.findOne({ Guild: g.id });
    
    if(!r) {
        await RaidProtection.create({
            Guild: g.id,
            ChannelCreateLimit: 3,
            ChannelDeleteLimit: 3,
            Exceptions: [],
            GuildBanAddLimit: 3,
            RoleCreateLimit: 3,
            RoleDeleteLimit: 3,
        });
    } else return;
});