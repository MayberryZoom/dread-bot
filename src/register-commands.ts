import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

import { clientId } from '../config.json';
import { discordToken } from '../tokens.json';

const rest = new REST({ version: '10' }).setToken(discordToken);

export default async (commands) => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
};
