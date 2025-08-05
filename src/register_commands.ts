import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { REST } from "@discordjs/rest";

import { clientId } from "../config.json";
import { discordToken } from "../tokens.json";


const rest = new REST().setToken(discordToken);

export default async (commands: RESTPostAPIApplicationCommandsJSONBody[]) => {
    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const res = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${res.length} application (/) commands.`);
    }
    catch (error) {
        console.error(error);
    }
};
