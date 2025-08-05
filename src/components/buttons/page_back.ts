import { ButtonBuilder, ButtonStyle, ActionRowBuilder, InteractionUpdateOptions } from "discord.js";

import { Button } from "../../lib/button";
import { pageSectionEmbed } from "../../lib/utils";


export default new Button({
    name: "pageBack",
    builder: (id) => new ButtonBuilder()
        .setCustomId("pageBack_" + id)
        .setLabel("Previous Section")
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction, manager) => {
        const pageId = parseInt(interaction.customId.slice(9));

        const page = manager.getCachedPage(pageId).content;
        const currentPage = page.find(x => x.header === interaction.message.embeds[0].title);
        if (!currentPage) throw Error();
        const currentIndex = page.indexOf(currentPage);

        const toSend: InteractionUpdateOptions = { embeds: [pageSectionEmbed(page[currentIndex - 1])] };
        const row = new ActionRowBuilder().addComponents(
            manager.createButton("pageBack", pageId).setDisabled(true),
            manager.createButton("pageForward", pageId),
        )
        if (currentIndex - 1 === 0) toSend.components = [row];
        else if (interaction.message.components[0].components[1].disabled) toSend.components = [new ActionRowBuilder().addComponents(
            manager.createButton("pageBack", pageId),
            manager.createButton("pageForward", pageId),
        )];

        interaction.update(toSend);
    }
});
