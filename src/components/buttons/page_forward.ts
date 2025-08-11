import { ButtonBuilder, ButtonStyle, ActionRowBuilder, InteractionUpdateOptions } from "discord.js";

import { Button } from "../../lib/button";
import { pageSectionEmbed } from "../../lib/utils";


export default new Button({
    name: "pageForward",
    builder: (id) => new ButtonBuilder()
        .setCustomId("pageForward_" + id)
        .setLabel("Next Section")
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction, manager) => {
        const pageId = parseInt(interaction.customId.slice(12));

        const page = manager.getCachedPage(pageId).content;
        const currentPage = page.find(x => x.header === interaction.message.embeds[0].title);
        if (!currentPage) throw Error();
        const currentIndex = page.indexOf(currentPage);

        const toSend: InteractionUpdateOptions = { embeds: [pageSectionEmbed(page[currentIndex + 1])] };
        if (page.length === currentIndex + 2) toSend.components = [new ActionRowBuilder<ButtonBuilder>().addComponents(
            manager.createButton("pageBack", pageId),
            manager.createButton("pageForward", pageId).setDisabled(true),
        )];
        else if (interaction.message.resolveComponent(`pageBack_${pageId}`)?.disabled) toSend.components = [new ActionRowBuilder<ButtonBuilder>().addComponents(
            manager.createButton("pageBack", pageId),
            manager.createButton("pageForward", pageId),
        )];

        interaction.update(toSend);
    }
});
