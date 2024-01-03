import { Command } from "../../structures/Command";
import AntiGhostPing from "../../models/AntiGhostPing";
import Reply from "../../functions/reply";

export default new Command({
    name: 'antighostping',
    description: 'Toggle the anti ghost ping system!',

    run: async({ interaction, guild }) => {
        const agp = await AntiGhostPing.findOne({ Guild: guild.id });

        if(!agp) {
            await AntiGhostPing.create({
                Guild: guild.id,
            });

            return Reply(interaction, `Anti Ghost Ping has been enabled.`, '✅', 'Blurple', true);
        } else {
            await agp.deleteOne({ new: true });

            return Reply(interaction, `Anti Ghost Ping has been disabled.`, '✅', 'Blurple', true);
        }
    }
})