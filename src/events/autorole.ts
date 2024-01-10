import Autorole from "../models/Autorole";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", async(m) => {
    const ar = await Autorole.findOne({ Guild: m.guild.id });
    if(!ar) return;

    const role = await m.guild.roles.cache.get(ar.Role);
    if(!role) return;

    await m.roles.add(role.id);
});