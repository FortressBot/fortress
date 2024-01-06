import { Event } from "../structures/Event";
import log from "../functions/logger";
import { ActivityType } from "discord.js";

export default new Event("ready", async(client) => {
    client.user.setActivity({
        name: `watching over your server.`,
        type: ActivityType.Custom,
    });

    log(`Fortress is ready to protect your server!`, false);
    return log(`Logged in as ${client.user.tag}`, false);
});