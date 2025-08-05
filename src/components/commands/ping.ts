import { SlashCommandBuilder } from "discord.js";

import { Command } from "../../lib/command";


export default new Command({
    name: "ping",
    builder: new SlashCommandBuilder().setDescription("Checks the bot's ping"),
    execute: async (interaction) => {
        const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
        interaction.editReply("Ping: " + (sent.createdTimestamp - interaction.createdTimestamp + "ms"));
    }
});
