import { SlashCommandBuilder } from "discord.js";

import { Command } from "../../lib/command";


export default new Command({
    name: "ping",
    builder: new SlashCommandBuilder().setDescription("Checks the bot's ping"),
    execute: async (interaction) => {
        const sent = await interaction.reply({ content: "Pinging...", withResponse: true });
        const responseTime = sent.resource?.message?.createdTimestamp;
        if (responseTime) interaction.editReply(`Ping: ${responseTime - interaction.createdTimestamp}ms`);
        else interaction.editReply("There was an error while processing that interaction.")
    }
});
