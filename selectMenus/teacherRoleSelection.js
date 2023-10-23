const { SelectMenuBuilder } = require('discord.js');
const { positions } = require('../config.json');

const getRolesOptions = () => positions.map(role => ({ label: role.label, description: role.description, value: role.value }));

module.exports = {
    selectMenu: () => new SelectMenuBuilder()
        .setCustomId('teacherRoleSelection')
        .setPlaceholder('No roles selected')
        .addOptions(getRolesOptions())
        .setMinValues(1)
        .setMaxValues(8),
    component: 'bootcamp',
    onSelection: (interaction) => new Promise(async (resolve, reject) => {
        addWipForm({ id: interaction.user.id, positions: interaction.values });

        await interaction.showModal(client.modals.get('teacherApp1').modal());
    })
};
