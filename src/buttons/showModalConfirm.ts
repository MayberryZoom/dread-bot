import { ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    button: (modal) => new ButtonBuilder()
        .setCustomId('showModalConfirm_' + modal)
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Primary),
    component: 'functionality',
    onPressed: (interaction) => new Promise(async (resolve, reject) => {
        await interaction.showModal(client.modals.get(interaction.customId.slice(17)).modal());
    })
};
