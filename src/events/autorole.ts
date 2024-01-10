import Autorole from "../models/Autorole";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", async(m) => {
    const ar = await Autorole.findOne({ Guild: m.guild.id });
    if(!ar) return;

    if(!Array.isArray(ar.Role)) {
        let roleArray = [];
        roleArray.push(ar.Role);

        ar.deleteOne({ new: true });

        await Autorole.create({
            Guild: m.guild.id,
            Role: [roleArray]
        });

        const role = await m.guild.roles.cache.get(ar.Role);
        if(!role) return;

        return m.roles.add(role.id);
    } else {
        ar.Role.forEach(async(role) => {
            await m.roles.add(role);
        });
    }
});