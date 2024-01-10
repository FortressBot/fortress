import { Command } from "../../structures/Command";
import AttachmentSpam from "../../models/AttachmentSpam";
import { ApplicationCommandOptionType } from "discord.js";
import getFortressEmoji from "../../functions/getfortressemoji";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'attachmentspam',
    description: 'Stop attachments from being spammed in your server',
    userPermissions: ['ManageMessages'],
    clientPermissions: ['ManageMessages'],
    options: [
        {
            name: 'limit',
            description: 'Set a limit for attachment spam',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'limit',
                    description: 'The limit of attachments per message',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1,
                }
            ]
        },
        {
            name: 'punishment',
            description: 'Edit the punishment for putting too many attachments in one message',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'punishment',
                    description: 'The punishment for putting too many attachments',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Kick', value: 'kick' },
                        { name: 'Temporarily Mute', value: 'mute' }
                    ]
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable attachment spam',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'enable',
            description: 'Enable attachment spam',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'limit',
                    description: 'The limit of attachments per message',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1,
                },
                {
                    name: 'punishment',
                    description: 'The punishment for putting too many attachments',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Kick', value: 'kick' },
                        { name: 'Temporarily Mute', value: 'mute' }
                    ]
                }
            ]
        }
    ],
    
    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const limit = opts.getInteger('limit');
        const punishment = opts.getString('punishment');

        const al = await getFortressEmoji(client, 'antilink');
        const mod = await getFortressEmoji(client, 'mod');
        const info = await getFortressEmoji(client, 'info');

        const as = await AttachmentSpam.findOne({ Guild: guild.id });

        switch(sub) {
            case 'limit': {
                if(!as) throw "The attachment spam system is disabled.";

                as.Limit = limit;
                as.save();

                const { embed } = await ConstructEmbed(interaction, `${al} Attachment spam system edited.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${info} New Limit: ${limit}**`);

                return interaction.reply({
                    embeds: [embed]
                });
            }
            break;

            case 'punishment': {
                if(!as) throw "The attachment spam system is disabled.";

                as.Punishment = punishment;
                as.save();

                const { embed } = await ConstructEmbed(interaction, `${al} Attachment spam system edited.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${info} New Punishment: ${punishment}**`);

                return interaction.reply({
                    embeds: [embed]
                });
            }
            break;

            case 'disable': {
                if(!as) throw "The attachment spam system is already disabled.";

                await as.deleteOne({ new: true });

                const { embed } = await ConstructEmbed(interaction, `${al} Attachment spam system disabled.\n**${mod} Moderator: <@${interaction.member.id}>**`);

                return interaction.reply({
                    embeds: [embed]
                });
            }
            break;

            case 'enable': {
                if(as) throw "The attachment spam system is already enabled.";

                await AttachmentSpam.create({
                    Guild: guild.id,
                    Limit: limit,
                    Punishment: punishment,
                });

                const { embed } = await ConstructEmbed(interaction, `${al} Attachment spam system enabled.\n**${mod} Moderator: <@${interaction.member.id}>**\n**${info} Limit: ${limit}**\n**${info} Punishment: ${punishment}**`);

                return interaction.reply({
                    embeds: [embed]
                });
            }
            break;
        }
    }
});