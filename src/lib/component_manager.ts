import { CacheType, Collection, CommandInteractionOptionResolver, InteractionType, RepliableInteraction } from "discord.js";

import { ExecutableComponent } from "./base_component";
import { Button } from "./button";
import { Command, SubcommandGroup } from "./command";
import { UserContextMenu } from "./context_menu";
import { Modal } from "./modal";
import { SelectMenu } from "./select_menu";
import { CachedPage } from "./utils";


export class ComponentManager {
    public constructor(
        public commands: Collection<string, Command>,
        public userContextMenus: Collection<string, UserContextMenu>,
        public modals: Collection<string, Modal>,
        public buttons: Collection<string, Button>,
        public selectMenus: Collection<string, SelectMenu>,
        public pageCache: Collection<number, CachedPage>,
    ) {}

    public getCommand(commandName: string, options: Pick<CommandInteractionOptionResolver<CacheType>, "getSubcommandGroup" | "getSubcommand">) {
        const command = this.commands.get(commandName);
        if (!command) throw Error(`No command ${commandName}`);

        const subcommandGroupName = options.getSubcommandGroup(false);
        const subcommandName = options.getSubcommand(false);

        if (command.subcommands && subcommandName) {
            let group: SubcommandGroup | undefined;
            if (command.subcommandGroups && subcommandGroupName) {
                group = command.subcommandGroups.get(subcommandGroupName);
                if (!group) throw Error(`No subcommand group ${subcommandGroupName}`);
            }

            const subcommand = (group ? group : command).subcommands.get(subcommandName);
            if (!subcommand) throw Error(`No subcommand ${subcommandName}`);
            return subcommand;
        }
        else return command;
    }

    public getUserContextMenu(userContextMenuName: string) {
        const userContextMenu = this.userContextMenus.get(userContextMenuName);
        if (!userContextMenu) throw Error(`No userContextMenu ${userContextMenuName}`);
        else return userContextMenu;
    }

    public getModal(modalName: string) {
        const modal = this.modals.get(modalName);
        if (!modal) throw Error(`No modal ${modalName}`);
        else return modal;
    }

    public createModal(modalName: string, modalInput?: unknown) {
        return this.getModal(modalName).builder(modalInput);
    }

    public getButton(buttonName: string) {
        const button = this.buttons.get(buttonName);
        if (!button) throw Error(`No button ${buttonName}`);
        else return button;
    }

    public createButton(buttonName: string, buttonInput?: unknown) {
        return this.getButton(buttonName).builder(buttonInput);
    }

    public getSelectMenu(selectMenuName: string) {
        const selectMenu = this.selectMenus.get(selectMenuName);
        if (!selectMenu) throw Error(`No selectMenu ${selectMenuName}`);
        else return selectMenu;
    }

    public createSelectMenu(selectMenuName: string, selectMenuInput?: unknown) {
        return this.getSelectMenu(selectMenuName).builder(selectMenuInput);
    }

    public getComponent(interaction: RepliableInteraction): ExecutableComponent {
        if (interaction.isChatInputCommand()) {
            return this.getCommand(interaction.commandName, interaction.options);
        }
        else if (interaction.isUserContextMenuCommand()) {
            return this.getUserContextMenu(interaction.commandName);
        }
        else if (interaction.type === InteractionType.ModalSubmit) {
            const pos = interaction.customId.indexOf("_");
            return this.getModal(pos === -1 ? interaction.customId : interaction.customId.slice(0, pos));
        }
        else if (interaction.isButton()) {
            const pos = interaction.customId.indexOf("_");
            return this.getButton(pos === -1 ? interaction.customId : interaction.customId.slice(0, pos));
        }
        else if (interaction.isAnySelectMenu()) {
            const pos = interaction.customId.indexOf("_");
            return this.getSelectMenu(pos === -1 ? interaction.customId : interaction.customId.slice(0, pos));
        }
        else {
            throw Error("Cannot determine component for interaction.");
        }
    }

    public getCachedPage(pageId: number) {
        const page = this.pageCache.get(pageId);
        if (!page) throw Error(`Page ${pageId} is not cached`);
        return page;
    }
}
