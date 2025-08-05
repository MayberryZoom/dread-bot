import { ButtonBuilder, ButtonStyle } from "discord.js";

import { Button } from "../../lib/button";


export default new Button({
    name: "showModalConfirm",
    builder: (modal) => new ButtonBuilder()
        .setCustomId("showModalConfirm_" + modal)
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction, manager) => {
        await interaction.showModal(manager.createModal(interaction.customId.slice(17)));
    }
});
