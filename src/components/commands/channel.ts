import { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } from "discord.js";

import { Command, Subcommand } from "../../lib/command";

import { moderatorRole } from "../../../config.json";


const channelOption = (option) => option.setName("channel").setDescription("The channel to update");

export default new Command({
    name: "channel",
    builder: new SlashCommandBuilder().setDescription("Modifies a channel").setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog).setDMPermission(false),
    subcommands: [
        new Subcommand({
            name: "slowmode",
            builder: new SlashCommandSubcommandBuilder()
                .setDescription("Sets the channel's slowmode")
                .addNumberOption(option => option
                    .setName("cooldown")
                    .setDescription("How long users must wait between messages, in seconds")
                    .setMinValue(0)
                    .setMaxValue(216000)
                    .setRequired(true))
                .addChannelOption(channelOption),
            execute: async (interaction) => {
                if (!interaction.member?.roles.cache.has(moderatorRole)) {
                    interaction.reply({ content: "You don't have permission to execute this command!", ephemeral: true });
                    return;
                }

                let channel = interaction.options.getChannel("channel");
                if (!channel) channel = interaction.channel;

                const cd = interaction.options.getNumber("cooldown");
                const res = await channel.setRateLimitPerUser(cd, "Slowmode set to " + cd + " seconds by " + interaction.user.username + ".");
                if (res) interaction.reply({ content: "Channel updated successfully.", ephemeral: true });
            },
        }),
        new Subcommand({
            name: "rename",
            builder: new SlashCommandSubcommandBuilder()
                .setDescription("Changes the channel's name")
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("The new channel name")
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setRequired(true))
                .addChannelOption(channelOption),
            execute: async (interaction) => {
                if (!interaction.member.roles.cache.has(moderatorRole)) {
                    interaction.reply({ content: "You don't have permission to execute this command!", ephemeral: true });
                    return;
                }

                let channel = interaction.options.getChannel("channel");
                if (!channel) channel = interaction.channel;

                const newName = interaction.options.getString("name");
                const res = await channel.setName(newName, "Channel name changed to #" + newName + " by " + interaction.user.username + ".");
                if (res) interaction.reply({ content: "Channel updated successfully.", ephemeral: true });
            },
        }),
        new Subcommand({
            name: "topic",
            builder: new SlashCommandSubcommandBuilder()
                .setDescription("Sets the channel's description")
                .addChannelOption(channelOption),
            execute: async (interaction, manager) => {
                if (!interaction.member.roles.cache.has(moderatorRole)) {
                    interaction.reply({ content: "You don't have permission to execute this command!", ephemeral: true });
                    return;
                }

                let channel = interaction.options.getChannel("channel");
                if (!channel) channel = interaction.channel;

                interaction.showModal(manager.createModal("channelTopic", channel.id));
            },
        }),
    ]
});
