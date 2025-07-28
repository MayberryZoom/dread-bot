import { readdirSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
const __dirname = import.meta.dirname;

import { ActivityType, Client, Collection, Events, GatewayIntentBits, InteractionType } from "discord.js";

import registerCommands from "./register-commands";
import { StreamBlacklist } from "./databases/dbObjects";
import { streamEmbed } from "./utils/activityUtils";

import { discordToken } from '../tokens.json';
import { owners, enabledComponents, dreadServer, streamsChannel, streamingRole } from '../config.json';

// Initialize client
let dreadClient = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences ],
    allowedMentions: { parse: ['users'], repliedUser: true },
    rest: { rejectOnRateLimit: ['/channels'] }
});

// Cache for wiki pages
dreadClient.pageCache = new Collection();

// Initialize local commands
dreadClient.commands = new Collection();
const commandFiles = readdirSync(resolvePath(__dirname, './commands'));

// Fill local commands
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    if (command.subcommandGroups) {
        command.subcommandGroups.forEach((v, k) => {
            v.subcommands.forEach((vv, kk) => enabledComponents.includes(vv.component) ? v.data.addSubcommand(vv.data) : v.data.delete(kk));
            enabledComponents.includes(v.component) ? command.data.addSubcommandGroup(v.data) : command.subcommandGroups.delete(k);
        });
    }
    if (command.subcommands) command.subcommands.forEach((v, k) => enabledComponents.includes(v.component) ? command.data.addSubcommand(v.data) : command.subcommands.delete(k));
    if (enabledComponents.includes(command.component)) dreadClient.commands.set(command.data.name, command);
}

// Initialize local context menus
dreadClient.contextMenus = new Collection();
const contextMenus = readdirSync(resolvePath(__dirname, './contextMenus'));

// Fill local context menus
for (const file of contextMenus) {
    const contextMenu = await import(`./contextMenus/${file}`);
    if (enabledComponents.includes(contextMenu.component)) dreadClient.contextMenus.set(contextMenu.data.name, contextMenu);
}

// Initialize local modals
dreadClient.modals = new Collection();
const modalFiles = readdirSync(resolvePath(__dirname, './modals'));

// Fill local modals
for (const file of modalFiles) {
    const modal = await import(`./modals/${file}`);
    if (enabledComponents.includes(modal.component)) dreadClient.modals.set(file.slice(0, -3), modal);
}

// Initialize local buttons
dreadClient.buttons = new Collection();
const buttonFiles = readdirSync(resolvePath(__dirname, './buttons'));

// Fill local buttons
for (const file of buttonFiles) {
    const button = await import(`./buttons/${file}`);
    if (enabledComponents.includes(button.component)) dreadClient.buttons.set(file.slice(0, -3), button);
}

// Initialize local select menus
dreadClient.selectMenus = new Collection();
const selectMenuFiles = readdirSync(resolvePath(__dirname, './selectMenus'));

// Fill local select menus
for (const file of selectMenuFiles) {
    const selectMenu = await import(`./selectMenus/${file}`);
    if (enabledComponents.includes(selectMenu.component)) dreadClient.selectMenus.set(file.slice(0, -3), selectMenu);
}

console.log(dreadClient.commands);
registerCommands(dreadClient.commands.map(c => c.data).concat(dreadClient.contextMenus.map(c => c.data)));

// Interaction handler
dreadClient.on(Events.InteractionCreate, interaction => {
    // Slash commands
    if (interaction.isChatInputCommand()) {
        // Get local equivalent and find subcommand
        let command = dreadClient.commands.get(interaction.commandName);
        if (command.subcommandGroups && interaction.options.getSubcommandGroup(false)) command = command.subcommandGroups.get(interaction.options.getSubcommandGroup()).subcommands.get(interaction.options.getSubcommand());
        else if (command.subcommands && interaction.options.getSubcommand(false)) command = command.subcommands.get(interaction.options.getSubcommand());

        // Restrict owner only commands
        if (command.ownerOnly && !owners.includes(interaction.user.id)) return interaction.reply({ content: 'Only the bot owners can use this command!', ephemeral: true });

        // Execute command
        command.execute(interaction).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        });
    }
    // Autocomplete
    else if (interaction.isAutocomplete()) {
        // Get local equivalent
        let command = dreadClient.commands.get(interaction.commandName);
        if (command.subcommandGroups && interaction.options.getSubcommandGroup(false)) command = command.subcommandGroups.get(interaction.options.getSubcommandGroup()).subcommands.get(interaction.options.getSubcommand());
        else if (command.subcommands && interaction.options.getSubcommand(false)) command = command.subcommands.get(interaction.options.getSubcommand());

        // Autocomplete command
        command.autocomplete(interaction).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        });
    }
    // Context menus
    else if (interaction.isUserContextMenuCommand()) {
        // Get local equivalent
        const contextMenu = dreadClient.contextMenus.get(interaction.commandName);

        // Restrict owner only commands (probably unnecessary feature)
        if (contextMenu.ownerOnly && !owners.includes(interaction.user.id)) return interaction.reply({ content: 'Only the bot owners can use this command!', ephemeral: true });

        // Execute command
        contextMenu.execute(interaction).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        });
    }
    // Modal submits
    else if (interaction.type === InteractionType.ModalSubmit) {
        // Get local equivalent
        const pos = interaction.customId.indexOf('_');
        const modal = dreadClient.modals.get(pos === -1 ? interaction.customId : interaction.customId.slice(0, pos));

        // Execute command
        modal.onSubmit(interaction).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        });
    }
    // Button presses
    else if (interaction.isButton()) {
        // Get local equivalent
        const pos = interaction.customId.indexOf('_');
        const button = dreadClient.buttons.get(pos === -1 ? interaction.customId : interaction.customId.slice(0, pos));

        // Execute command
        button.onPressed(interaction).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        });
    }
    // selectMenu submits
    else if (interaction.isAnySelectMenu()) {
        // Get local equivalent
        const pos = interaction.customId.indexOf('_');
        const selectMenu = dreadClient.selectMenus.get(pos === -1 ? interaction.customId : interaction.customId.slice(0, pos));

        // Execute command
        selectMenu.onSelection(interaction).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        });
    }
});

if (enabledComponents.includes('streams')) {
    const objectsArrayEquals = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        else return arr1.every((x, i) => JSON.stringify(x) === JSON.stringify(arr2[i]));
    };

    dreadClient.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
        if (newPresence.guild.id !== dreadServer) return;
        const streams = newPresence.activities.filter(activity => activity.type === ActivityType.Streaming && activity.state === 'Metroid Dread');
        if (streams.length > 0) {
            if (!oldPresence || !objectsArrayEquals(streams, oldPresence.activities.filter(activity => activity.type === ActivityType.Streaming && activity.state === 'Metroid Dread'))) {
                const user = await StreamBlacklist.findOne({ where: { userId: newPresence.user.id } });
                if (!user) {
                    streams.forEach(stream => {
                        dreadClient.channels.fetch(streamsChannel)
                            .then(c => c.send({ embeds: [streamEmbed(stream, newPresence.user)] }));
                    });
                    newPresence.member.roles.add(streamingRole);
                }
            }
        }
        else if (oldPresence && oldPresence.activities.filter(activity => activity.type === ActivityType.Streaming && activity.state === 'Metroid Dread').length > 0) {
            newPresence.member.roles.remove(streamingRole);
        }
    });
}

// Log on successful login
dreadClient.once(Events.ClientReady, () => {
    console.log('Interaction handling ready!');
});

// Login
dreadClient.login(discordToken);
