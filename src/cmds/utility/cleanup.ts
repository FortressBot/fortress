import { Command } from "../../structures/Command";
import Reply from "../../functions/reply";

export default new Command({
    name: 'cleanup',
    description: 'Clean up Fortress\' messages from the channel.',

    run: async({ interaction, guild, opts }) => {
        const date = new Date();
        const ms = date.getTime();

        const msgs = await interaction.channel.messages.fetch();

        const timefilter = ms - 1.21e+9;

        const botmessages = await msgs.filter((msg) => msg.author.id === guild.members.me.id && msg.createdTimestamp > timefilter);
        if(!botmessages || botmessages.size <= 0) throw "I have sent no messages in this channel.";

        interaction.channel.bulkDelete(botmessages);

        return Reply(interaction, `Successfully deleted all messages sent by me in this channel from less than 2 weeks ago.`, '✅', 'Blurple', true);
    }
})