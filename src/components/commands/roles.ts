import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, MessageFlags } from "discord.js";

import { Command } from "../../lib/command";


export default new Command({
    name: "roles",
    builder: new SlashCommandBuilder()
        .setDescription("Sets a user's roles")
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user to update the roles of.")
            .setRequired(true)),
    moderatorOnly: true,
    execute: async (interaction, manager) => {
        const user = interaction.options.getUser("user");
        const addRoleSelection = new ActionRowBuilder().addComponents(manager.createSelectMenu("addUserRolesSelection", user.id));
        const removeRoleSelection = new ActionRowBuilder().addComponents(manager.createSelectMenu("removeUserRolesSelection", user.id));

        await interaction.reply({ content: "Select " + user.toString() + "'s roles." , components: [addRoleSelection, removeRoleSelection], flags: MessageFlags.Ephemeral });
    },
});
