const { RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
    selectMenu: (id) => new RoleSelectMenuBuilder()
        .setCustomId('removeUserRolesSelection_' + id)
        .setPlaceholder('Roles to remove')
        .setMinValues(0)
        .setMaxValues(10),
    component: 'moderation',
    onSelection: (interaction) => {
        return new Promise(async (resolve, reject) => {
            const highestRole = interaction.guild.members.me.roles.highest;
            const higherRole = interaction.roles.find(r => r.position >= highestRole.position);
            if (higherRole) return interaction.reply({ content: 'The ' + higherRole.toString() + ' role is not lower than my highest role. Please de-select it.', ephemeral: true }).then(resolve()).catch(e => reject(e));

            const member = await interaction.guild.members.fetch(interaction.customId.slice(25)).catch(e => reject(e));
            const oldRoles = member.roles.cache;

            if (!oldRoles.find(r => interaction.roles.has(r.id))) return interaction.reply({ content: 'No changes made, as no existing roles were selected.', ephemeral: true }).then(resolve()).catch(e => reject(e));

            const newMember = await member.roles.remove(interaction.roles).catch(e => reject(e));
            interaction.reply({ content: member.user.toString() + '\'s roles updated successfully.\n\nRoles removed: ' + newMember.roles.cache.difference(oldRoles).map(r => r.toString()), ephemeral: true }).then(resolve()).catch(e => reject(e));
        });
    }
};
