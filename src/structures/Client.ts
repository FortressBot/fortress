import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    IntentsBitField
} from "discord.js";
import { CommandType, ExtendedInteraction } from "../typings/Command";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import glob from 'glob';
import log from '../functions/logger';
import config from '../../config.json';
import mongoose from "mongoose";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: [
            IntentsBitField.Flags.AutoModerationConfiguration,
            IntentsBitField.Flags.AutoModerationExecution,
            IntentsBitField.Flags.GuildEmojisAndStickers,
            IntentsBitField.Flags.GuildInvites,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildModeration,
            IntentsBitField.Flags.GuildMessageReactions,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildVoiceStates,
            IntentsBitField.Flags.Guilds
        ] });
    }

    start() {
        this.registerModules();
        if(config.mongoEnabled === true) {
            this.mongoConnect(config.mongoURI);
        }
        this.login(config.token);
    }

    reply(interaction: ExtendedInteraction, message: string) {
        interaction.reply({
            content: `${message}`
        });
    };

    editreply(interaction: ExtendedInteraction, message: string) {
        interaction.editReply({
            content: `${message}`
        })
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            log(`Registering commands to ${guildId}`, false);
        } else {
            this.application?.commands.set(commands);
            log(`Registering global commands`, false);
        }
    }

    async mongoConnect(uri) {
        const connection = await mongoose.connect(uri);
        if(connection) {
            return log(`Connected to FortressDB.`, false);
        } else {
            return log(`Error connecting to FortressDB.`, true);
        }
    }

    async registerModules() {
        // Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(`${__dirname}/../cmds/*/*{.ts,.js}`);
        commandFiles.forEach(async (filePath: string) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: config.guildId
            });
        });

        // Events
        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath: string) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });
    }
}
