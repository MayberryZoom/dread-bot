import { ActivityType, Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";

import { BotConfigTable, StreamBlacklistTable } from "./databases/db_objects";
import { Button } from "./lib/button";
import { Command } from "./lib/command";
import { ComponentManager } from "./lib/component_manager";
import { UserContextMenu } from "./lib/context_menu";
import { Modal } from "./lib/modal";
import { SelectMenu } from "./lib/select_menu";
import { buildComponentCollection, objectsArrayEquals, streamEmbed } from "./lib/utils";
import registerCommands from "./register_commands";

import { discordToken } from "../tokens.json";


// Initialize client
const dreadClient = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences ],
    allowedMentions: { parse: ["users"], repliedUser: true },
    rest: { rejectOnRateLimit: ["/channels"] },
});

const manager = new ComponentManager(
    await buildComponentCollection<Command>("commands"),
    await buildComponentCollection<UserContextMenu>("user_context_menus"),
    await buildComponentCollection<Modal>("modals"),
    await buildComponentCollection<Button>("buttons"),
    await buildComponentCollection<SelectMenu>("select_menus"),
    new Collection(),
);

registerCommands([...(manager.commands.map(c => c.builder.toJSON())), ...manager.userContextMenus.map(c => c.builder.toJSON())]);

// Interaction handler
dreadClient.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isAutocomplete()) {
        const command = manager.getCommand(interaction.commandName, interaction.options);
        try {
            await command.autocomplete(interaction);
        }
        catch(error) {
            console.error(error);
        };
    }
    else {
        const component = manager.getComponent(interaction);
        try {
            await component.execute(interaction, manager);
        }
        catch(error) {
            console.error(error);
            interaction.reply({ content: "There was an error while processing that interaction.", flags: MessageFlags.Ephemeral });
        };
    }
});

dreadClient.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
    if (
        !newPresence.guild
        || !newPresence.user
        || !newPresence.member
    ) return;

    const streamsChannel = await BotConfigTable.findOne({ where: { id: "streamsChannel", guild: newPresence.guild.id } }).then(x => x?.get("value"));
    const streamingRole = await BotConfigTable.findOne({ where: { id: "streamingRole", guild: newPresence.guild.id } }).then(x => x?.get("value"));
    if (!streamsChannel || !streamingRole) return;

    const newStreams = newPresence.activities.filter(activity => activity.type === ActivityType.Streaming && activity.state === "Metroid Dread");
    const oldStreams = oldPresence?.activities.filter(activity => activity.type === ActivityType.Streaming && activity.state === "Metroid Dread") || [];
    if (newStreams.length > 0) {
        if (!oldPresence || !objectsArrayEquals(newStreams, oldStreams)) {
            const user = await StreamBlacklistTable.findOne({ where: { userId: newPresence.user.id } });
            if (!user) {
                newStreams.forEach(async (stream) => {
                    const channel = await dreadClient.channels.fetch(streamsChannel);
                    if (channel?.isSendable() && newPresence.user) channel.send({ embeds: [streamEmbed(stream, newPresence.user)] });
                });
                newPresence.member.roles.add(streamingRole);
            }
        }
    }
    else if (oldStreams.length > 0) {
        newPresence.member.roles.remove(streamingRole);
    }
});

// Log on successful login
dreadClient.once(Events.ClientReady, () => {
    console.log("Interaction handling ready.");
});

// Login
dreadClient.login(discordToken);
