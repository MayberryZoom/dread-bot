import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

import { Modal } from "../../lib/modal";


const topicInput = new TextInputBuilder()
    .setCustomId("channelTopicTopic")
    .setLabel("Please write the new channel topic below.")
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1024)
    .setRequired(true);

const topicActionRow = new ActionRowBuilder().addComponents(topicInput);

export default new Modal({
    name: "channelTopic",
    builder: (id) => new ModalBuilder()
        .setCustomId("channelTopic_" + id)
        .setTitle("New Channel Topic")
        .addComponents(topicActionRow),
    execute: async (interaction) => {
        const id = interaction.customId.slice(13);
        const newTopic = interaction.fields.getTextInputValue("channelTopicTopic");
        const res = await interaction.guild.channels.cache.get(id).setTopic(newTopic, `Channel topic set to ${newTopic} by ${interaction.user.username}.`);
        if (res) interaction.reply({ content: "Channel updated successfully.", ephemeral: true });
    }
});
