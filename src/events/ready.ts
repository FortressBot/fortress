import { Event } from "../structures/Event";
import log from "../functions/logger";

export default new Event("ready", async(client) => {
    log(`Fortress is ready to protect your server!`, false);
    return log(`Logged in as ${client.user.tag}`, false);
});