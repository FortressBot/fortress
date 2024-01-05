import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";

export default new Command({
    name: 'textchannel',
    description: 'Text channel management commands',
    userPermissions: ["ManageChannels"],
    options: [
        {
            name: 'lockdown',
            description: 'Lockdown control commands!',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'enable',
                    description: 'Enable the lockdown for a channel!',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'disable',
                    description: 'Disable the lockdown for a channel!',
                    type: ApplicationCommandOptionType.Subcommand
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts }) => {
        
    }
})