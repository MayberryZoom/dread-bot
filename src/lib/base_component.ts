
import { ExecuteInteractionFunction } from "./utils";

import { ComponentManager } from "./component_manager";

import { owners } from "../../config.json";
import { Interaction, RepliableInteraction } from "discord.js";


export interface BaseComponentConstructor {
    name: string;
    builder: unknown;
    moderatorOnly?: boolean;
    ownerOnly?: boolean;
}

export abstract class BaseComponent {
    public name: string;
    public abstract builder: unknown;
    public moderatorOnly?: boolean;
    public ownerOnly?: boolean;

    public constructor(fields: BaseComponentConstructor) {
        this.name = fields.name;
        this.moderatorOnly = fields.moderatorOnly;
        this.ownerOnly = fields.ownerOnly;
    }
}

export interface ExecutableComponentConstructor extends BaseComponentConstructor {
    execute?: ExecuteInteractionFunction<RepliableInteraction>;
}

export abstract class ExecutableComponent extends BaseComponent {
    public abstract _execute?: ExecuteInteractionFunction<RepliableInteraction>;

    public async canExecute(interaction: Interaction | RepliableInteraction): Promise<boolean> {
        if (this.ownerOnly && !owners.includes(interaction.user.id)) {
            if (!interaction.isAutocomplete()) interaction.reply({ content: "Only the bot owners can use that command.", ephemeral: true });
            return false;
        }
        else return true;
    }

    public async execute(interaction: RepliableInteraction, manager: ComponentManager): Promise<void> {
        if (this._execute && await this.canExecute(interaction)) await this._execute(interaction, manager);
    }
}
