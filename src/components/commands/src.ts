import { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command, Subcommand } from "../../lib/command";

import { srcRole } from "../../../config.json";


const apiKeyWarning = `When you press the button below, you will be prompted by a window to provide your API key from SRC.
Please ensure you are logged into your SRC account, then follow [this link](<https://www.speedrun.com/settings/api>) and show/copy your key.

Note that anyone who gains access to this key will gain full access to your SRC account, so only post it in the pop-up window!

The bot will only use your key to check that your SRC account exists; your key is never saved. This can be verified by checking the source code [here](<https://github.com/MayberryZoom/dread-bot/blob/main/src/components/modals/src_api_key.ts>).
If you still don't feel comfortable sharing your API key, feel free to dismiss this message.`;

export default new Command({
    name: "src",
    builder: new SlashCommandBuilder().setDescription("Verify your accounts on external services"),
    subcommands: [
        new Subcommand({
            name: "verify",
            builder: new SlashCommandSubcommandBuilder().setDescription("Verify your speedrun.com account"),
            execute: async (interaction, manager) => {
                await interaction.guild.roles.fetch();
                if (interaction.member.roles.cache.has(srcRole)) {
                    interaction.reply({ content: "You already have the SRC Verified role.", ephemeral: true });
                    return;
                }

                const buttonRow = new ActionRowBuilder().addComponents(manager.createButton("showModalConfirm", "srcApiKey"));
                interaction.reply({ content: apiKeyWarning, components: [buttonRow], ephemeral: true });
            }
        })
    ],
});
