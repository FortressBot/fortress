import { Event } from "../structures/Event";
import log from "../functions/logger";
import { ActivityType } from "discord.js";

export default new Event("ready", async(client) => {
    const statuses = [
        "github.com/FortressBot",
        "version 0.1.0",
        "over your server.",
        "security protocols"
    ];

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    client.user.setActivity({
        name: `${status}`,
        type: ActivityType.Watching,
    });

    setInterval(() => {
        const s = statuses[Math.floor(Math.random() * statuses.length)];

        client.user.setActivity({
            name: `${s}`,
            type: ActivityType.Watching,
        });
    }, 10000)

    log(`Fortress is ready to protect your server!`, false);
    return log(`Logged in as ${client.user.tag}`, false);
});