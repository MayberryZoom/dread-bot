import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, InteractionContextType, PermissionFlagsBits } from "discord.js";

import { BotConfig } from "../../databases/db_models";
import { Command, Subcommand, SubcommandGroup } from "../../lib/command";


export default new Command({
    name: "config",
    builder: new SlashCommandBuilder()
        .setDescription("Configure the bot")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    moderatorOnly: true,
    ownerOnly: true,
    subcommandGroups: [
        new SubcommandGroup({
            name: "streams",
            builder: new SlashCommandSubcommandGroupBuilder().setDescription("Configure stream-posting functionality"),
            moderatorOnly: true,
            ownerOnly: true,
            subcommands: [
                new Subcommand({
                    name: "role",
                    builder: new SlashCommandSubcommandBuilder()
                        .setDescription("Configure the role to grant users streaming")
                        .addRoleOption(option => option
                            .setName("role")
                            .setDescription("The role to grant when a user is streaming")
                            .setRequired(true)
                        ),
                    moderatorOnly: true,
                    ownerOnly: true,
                    execute: async (interaction) => {
                        if (!interaction.inCachedGuild()) throw Error("Guild not cached.");

                        const role = interaction.options.getRole("role", true);
                        await BotConfig.upsert({
                            id: "streamingRole",
                            value: role.id,
                            guild: interaction.guild.id,
                        });
                        await interaction.reply(`Successfully updated config for streaming role to ${role}.`);
                    },
                }),
                new Subcommand({
                    name: "channel",
                    builder: new SlashCommandSubcommandBuilder()
                        .setDescription("Configure the channel to post streams in")
                        .addChannelOption(option => option
                            .setName("channel")
                            .setDescription("The channel to post streams in")
                            .setRequired(true)
                        ),
                    moderatorOnly: true,
                    ownerOnly: true,
                    execute: async (interaction) => {
                        if (!interaction.inCachedGuild()) throw Error("Guild not cached.");

                        const channel = interaction.options.getChannel("channel", true);
                        await BotConfig.upsert({
                            id: "streamsChannel",
                            value: channel.id,
                            guild: interaction.guild.id,
                        });
                        await interaction.reply(`Successfully updated config for streams channel to ${channel}.`);
                    },
                }),
            ],
        }),
        new SubcommandGroup({
            name: "moderation",
            builder: new SlashCommandSubcommandGroupBuilder().setDescription("Configure moderation functionality"),
            moderatorOnly: true,
            ownerOnly: true,
            subcommands: [
                new Subcommand({
                    name: "role",
                    builder: new SlashCommandSubcommandBuilder()
                        .setDescription("Configure the role to check before executing moderator commands")
                        .addRoleOption(option => option
                            .setName("role")
                            .setDescription("The role to check before executing moderator commands")
                            .setRequired(true)
                        ),
                    moderatorOnly: true,
                    ownerOnly: true,
                    execute: async (interaction) => {
                        if (!interaction.inCachedGuild()) throw Error("Guild not cached.");

                        const role = interaction.options.getRole("role", true);
                        await BotConfig.upsert({
                            id: "moderatorRole",
                            value: role.id,
                            guild: interaction.guild.id,
                        });
                        await interaction.reply(`Successfully updated config for moderator role to ${role}.`);
                    },
                }),
            ],
        }),
        new SubcommandGroup({
            name: "wiki",
            builder: new SlashCommandSubcommandGroupBuilder().setDescription("Configure wiki functionality"),
            moderatorOnly: true,
            ownerOnly: true,
            subcommands: [
                new Subcommand({
                    name: "role",
                    builder: new SlashCommandSubcommandBuilder()
                        .setDescription("Configure the role to grant wiki contributors")
                        .addRoleOption(option => option
                            .setName("role")
                            .setDescription("The role to grant wiki contributors")
                            .setRequired(true)
                        ),
                    moderatorOnly: true,
                    ownerOnly: true,
                    execute: async (interaction) => {
                        if (!interaction.inCachedGuild()) throw Error("Guild not cached.");

                        const role = interaction.options.getRole("role", true);
                        await BotConfig.upsert({
                            id: "contributorRole",
                            value: role.id,
                            guild: interaction.guild.id,
                        });
                        await interaction.reply(`Successfully updated config for wiki contributor role to ${role}.`);
                    },
                }),
            ],
        }),
        new SubcommandGroup({
            name: "src",
            builder: new SlashCommandSubcommandGroupBuilder().setDescription("Configure speedrun.com functionality"),
            moderatorOnly: true,
            ownerOnly: true,
            subcommands: [
                new Subcommand({
                    name: "role",
                    builder: new SlashCommandSubcommandBuilder()
                        .setDescription("Configure the role to grant verified runners")
                        .addRoleOption(option => option
                            .setName("role")
                            .setDescription("The role to grant verified runners")
                            .setRequired(true)
                        ),
                    moderatorOnly: true,
                    ownerOnly: true,
                    execute: async (interaction) => {
                        if (!interaction.inCachedGuild()) throw Error("Guild not cached.");

                        const role = interaction.options.getRole("role", true);
                        await BotConfig.upsert({
                            id: "srcRole",
                            value: role.id,
                            guild: interaction.guild.id,
                        });
                        await interaction.reply(`Successfully updated config for SRC role to ${role}.`);
                    },
                }),
            ],
        }),
    ],
});
