import { InteractionType } from "discord.js";
import { Event } from "../structures/Event";

export default new Event("interactionCreate", async(i) => {
    if(i.user.bot) return;

    if(i.type !== InteractionType.MessageComponent) return;
    if(i.customId !== 'dismiss') return;

    const msg = i.message;

    try {
        msg.delete();
    } catch(err) { return; }
});