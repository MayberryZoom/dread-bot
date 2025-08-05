import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { StreamBlacklist } from "../../databases/db_objects";
import { Command, Subcommand } from "../../lib/command";


export default new Command({
    name: "streams",
    builder: new SlashCommandBuilder().setDescription("Commands related to stream notifications"),
    subcommands: [
        new Subcommand({
            name: "toggle",
            builder: new SlashCommandSubcommandBuilder().setDescription("Opt-out/in from having your streams posted"),
            execute: async (interaction) => {
                const user = await StreamBlacklist.findOne({ where: { userId: interaction.user.id } });

                if (user) await user.destroy();
                else await StreamBlacklist.create({ userId: interaction.user.id });

                interaction.reply({ content: "Your streams will " + (user ? "now" : "no longer") + " be posted.", ephemeral: true });
            }
        }),
        new Subcommand({
            name: "status",
            builder: new SlashCommandSubcommandBuilder().setDescription("Check the status of your stream notifications"),
            execute: async (interaction) => {
                const user = await StreamBlacklist.findOne({ where: { userId: interaction.user.id } });

                interaction.reply({ content: "Your streams are currently " + (user ? "not " : "") + "being posted.", ephemeral: true });
            }
        }),
    ],
});
