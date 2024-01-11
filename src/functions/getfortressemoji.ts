import { ExtendedClient } from "../structures/Client";
import emojis from '../json/emojis.json';

export default async function getFortressEmoji(client: ExtendedClient, emoji: string) {
    let e;
    if(emoji === 'announcement') {
        e = await client.emojis.cache.get(emojis.announcement);
    } else if (emoji === 'code') {
        e = await client.emojis.cache.get(emojis.code)
    } else if (emoji === 'crown') {
        e = await client.emojis.cache.get(emojis.crown)
    } else if (emoji === 'deafen') {
        e = await client.emojis.cache.get(emojis.deafen)
    } else if (emoji === 'delete') {
        e = await client.emojis.cache.get(emojis.delete)
    } else if (emoji === 'info') {
        e = await client.emojis.cache.get(emojis.info)
    } else if (emoji === 'lock') {
        e = await client.emojis.cache.get(emojis.lock)
    } else if (emoji === 'member') {
        e = await client.emojis.cache.get(emojis.member)
    } else if (emoji === 'members') {
        e = await client.emojis.cache.get(emojis.members)
    } else if (emoji === 'mod') {
        e = await client.emojis.cache.get(emojis.mod)
    } else if (emoji === 'mute') {
        e = await client.emojis.cache.get(emojis.mute)
    } else if (emoji === 'search') {
        e = await client.emojis.cache.get(emojis.search)
    } else if (emoji === 'shield') {
        e = await client.emojis.cache.get(emojis.shield)
    } else if (emoji === 'ts') {
        e = await client.emojis.cache.get(emojis.ts)
    } else if (emoji === 'undeafen') {
        e = await client.emojis.cache.get(emojis.undeafen)
    } else if (emoji === 'unlock') {
        e = await client.emojis.cache.get(emojis.unlock)
    } else if (emoji === 'unmute') {
        e = await client.emojis.cache.get(emojis.unmute)
    } else if (emoji === 'wait') {
        e = await client.emojis.cache.get(emojis.wait)
    } else if (emoji === 'modtick') {
        e = await client.emojis.cache.get(emojis.modtick)
    } else if (emoji === 'tick') {
        e = await client.emojis.cache.get(emojis.tick)
    } else if (emoji === 'ticket') {
        e = await client.emojis.cache.get(emojis.ticket)
    } else if (emoji === 'config') {
        e = await client.emojis.cache.get(emojis.config)
    } else if (emoji === 'msg') {
        e = await client.emojis.cache.get(emojis.msg)
    } else if (emoji === 'spark') {
        e = await client.emojis.cache.get(emojis.spark)
    } else if (emoji === 'flame') {
        e = await client.emojis.cache.get(emojis.flame)
    } else if (emoji === 'ping') {
        e = await client.emojis.cache.get(emojis.ping)
    } else if (emoji === 'link') {
        e = await client.emojis.cache.get(emojis.link)
    } else if (emoji === 'antiswear') {
        e = await client.emojis.cache.get(emojis.antiswear)
    } else if (emoji === 'adduser') {
        e = await client.emojis.cache.get(emojis.adduser)
    } else if (emoji === 'removeuser') {
        e = await client.emojis.cache.get(emojis.removeuser)
    } else if (emoji === 'idle') {
        e = await client.emojis.cache.get(emojis.idle)
    } else if (emoji === 'offline') {
        e = await client.emojis.cache.get(emojis.offline)
    } else if (emoji === 'online') {
        e = await client.emojis.cache.get(emojis.online)
    } else if (emoji === 'dnd') {
        e = await client.emojis.cache.get(emojis.dnd)
    } else if (emoji === 'emoji') {
        e = await client.emojis.cache.get(emojis.emoji)
    } else if (emoji === 'addemoji') {
        e = await client.emojis.cache.get(emojis.addemoji)
    } else if (emoji === 'removeemoji') {
        e = await client.emojis.cache.get(emojis.removeemoji)
    } else if (emoji === 'unban') {
        e = await client.emojis.cache.get(emojis.unban)
    } else if (emoji === 'antilink') {
        e = await client.emojis.cache.get(emojis.antilink)
    } else if (emoji === 'anti-invite') {
        e = await client.emojis.cache.get(emojis.anti_invite);
    }

    return e;
}