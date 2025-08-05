import axios from "axios";
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

import { Modal } from "../../lib/modal";

import { srcRole } from "../../../config.json";


const apiKeyInput = new TextInputBuilder()
    .setCustomId("apiKeyInput")
    .setLabel("Please enter your speedrun.com API key.")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(1024)
    .setRequired(true);

const apiKeyInputRow = new ActionRowBuilder().addComponents(apiKeyInput);

export default new Modal({
    name: "srcApiKey",
    builder: () => new ModalBuilder()
        .setCustomId("srcApiKey")
        .setTitle("API Key Entry")
        .addComponents(apiKeyInputRow),
    execute: async (interaction) => {
        const apiKey = interaction.fields.getTextInputValue("apiKeyInput");

        const profile = await axios.get("https://www.speedrun.com/api/v1/profile", { headers: { "X-API-Key": apiKey } })
        const personalBests = await axios.get(profile.data.data.links.find(x => x.rel === "personal-bests").uri)
        const foundRun = personalBests.data.data.find(run => ["3dxkz0v1", "nd2838rd"].includes(run.run.game) && run.run.status.status === "verified");

        if (foundRun) {
            const res = await interaction.member.roles.add(srcRole);
            if (res) interaction.reply("Account verified. You should now have the SRC Verified role.");
        }
        else interaction.reply({ content: "You must have a verified run of Metroid Dread to receive the SRC Verified role.", ephemeral: true });
    }
});
