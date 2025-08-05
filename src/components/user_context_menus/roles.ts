import { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, ActionRowBuilder, MessageFlags } from "discord.js";

import { UserContextMenu } from "../../lib/context_menu";

import { moderatorRole } from "../../../config.json";


export default new UserContextMenu({
    name: "Add/Remove Roles",
    builder: new ContextMenuCommandBuilder()
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
        .setDMPermission(false),
    moderatorOnly: true,
    execute: async (interaction, manager) => {
        if (!interaction.member?.roles.cache.has(moderatorRole)) {
            interaction.reply({ content: "You don't have permission to execute this command!", flags: MessageFlags.Ephemeral });
            return;
        }

        const addRoleSelection = new ActionRowBuilder().addComponents(manager.createSelectMenu("addUserRolesSelection", interaction.targetUser.id));
        const removeRoleSelection = new ActionRowBuilder().addComponents(manager.createSelectMenu("removeUserRolesSelection", interaction.targetUser.id));

        await interaction.reply({ content: `Select ${interaction.targetUser.toString()}'s roles.` , components: [addRoleSelection, removeRoleSelection], flags: MessageFlags.Ephemeral });
    },
});
