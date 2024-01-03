import { Command } from "../../structures/Command";
import Antilink from "../../models/Antilink";
import Reply from "../../functions/reply";
import { ApplicationCommandOptionType } from "discord.js";

export default new Command({
    name: 'antilink',
    description: 'Stop links from being shown in your server!',
    options: [
        {
            name: 'mode',
            description: 'Antilink mode!',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'Block Discord server invites ONLY', value: 'invitesonly' },
                { name: 'Block ALL links', value: 'blockall' }
            ],
            required: true
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const al = await Antilink.findOne({ Guild: guild.id });
        const mode = opts.getString('mode');

        if(mode === 'invitesonly') {
            if(!al) {
                await Antilink.create({
                    Guild: guild.id,
                    Mode: 'invites'
                });
    
                return Reply(interaction, `Antilink has been enabled.`, `✅`, 'Blurple', true);
            } else {
                await al.deleteOne({ new: true });
    
                return Reply(interaction, `Antilink has been disabled.`, '✅', 'Blurple', true);
            }
        } else if (mode === 'blockall') {
            if(!al) {
                await Antilink.create({
                    Guild: guild.id,
                    Mode: 'all'
                });
    
                return Reply(interaction, `Antilink has been enabled.`, `✅`, 'Blurple', true);
            } else {
                await al.deleteOne({ new: true });
    
                return Reply(interaction, `Antilink has been disabled.`, '✅', 'Blurple', true);
            }
        }
    }
})