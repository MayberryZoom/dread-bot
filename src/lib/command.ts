import { AutocompleteInteraction, ChatInputCommandInteraction, Collection, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

import { BaseComponent, BaseComponentConstructor, ExecutableComponent, ExecutableComponentConstructor } from "./base_component";
import { ComponentManager } from "./component_manager";
import { ExecuteInteractionFunction } from "./utils";


// Base class
interface BaseCommandConstructor extends ExecutableComponentConstructor {
    execute?: ExecuteInteractionFunction<ChatInputCommandInteraction>;
    autocomplete?: ExecuteInteractionFunction<AutocompleteInteraction>;
}

abstract class BaseCommand extends ExecutableComponent {
    public _execute?: ExecuteInteractionFunction<ChatInputCommandInteraction>;
    public _autocomplete?: ExecuteInteractionFunction<AutocompleteInteraction>;

    public constructor(fields: BaseCommandConstructor) {
        super(fields);
        this._execute = fields.execute;
        this._autocomplete = fields.autocomplete;
    }

    public async autocomplete(interaction: AutocompleteInteraction, manager: ComponentManager): Promise<void> {
        if (this._autocomplete && await this.canExecute(interaction)) await this._autocomplete(interaction, manager);
    }
}

// Subcommand
interface SubcommandConstructor extends BaseCommandConstructor {
    builder: SlashCommandSubcommandBuilder;
}

export class Subcommand extends BaseCommand {
    public builder: SlashCommandSubcommandBuilder;

    public constructor(fields: SubcommandConstructor) {
        super(fields);
        this.builder = fields.builder.setName(fields.name);
    }
}

// Subcommand group
interface SubcommandGroupConstructor extends BaseComponentConstructor {
    builder: SlashCommandSubcommandGroupBuilder;
    subcommands?: Subcommand[];
}

export class SubcommandGroup extends BaseComponent {
    public builder: SlashCommandSubcommandGroupBuilder;
    public subcommands: Collection<string, Subcommand>;

    public constructor(fields: SubcommandGroupConstructor) {
        super(fields);
        this.builder = fields.builder.setName(fields.name);

        const subcommands = fields.subcommands || [];
        this.subcommands = new Collection(subcommands.map((subcommand: Subcommand) => {
            this.builder.addSubcommand(subcommand.builder);
            return [subcommand.name, subcommand] as [string, Subcommand];
        }));
    }
}

// Command
interface CommandConstructor extends BaseCommandConstructor {
    builder: SlashCommandBuilder;
    subcommandGroups?: SubcommandGroup[];
    subcommands?: Subcommand[];
}

export class Command extends BaseCommand {
    public builder: SlashCommandBuilder;
    public subcommandGroups: Collection<string, SubcommandGroup>;
    public subcommands: Collection<string, Subcommand>;

    public constructor(fields: CommandConstructor) {
        super(fields);
        this.builder = fields.builder.setName(fields.name);

        const subcommandGroups = fields.subcommandGroups || [];
        this.subcommandGroups = new Collection(subcommandGroups.map((subcommandGroup: SubcommandGroup) => {
            this.builder.addSubcommandGroup(subcommandGroup.builder);
            return [subcommandGroup.name, subcommandGroup] as [string, SubcommandGroup];
        }));

        const subcommands = fields.subcommands || [];
        this.subcommands = new Collection(subcommands.map((subcommand: Subcommand) => {
            this.builder.addSubcommand(subcommand.builder);
            return [subcommand.name, subcommand] as [string, Subcommand];
        }));
    }

    // public abstract get name(): string;

    // public abstract get builder(): SlashCommandBuilder;

    // public static get subcommandGroups(): Collection<string, SubcommandGroup> {
    //     throw Error(`${this.constructor.name}.subcommandGroups is undefined.`);
    // }

    // public static get subcommands(): Collection<string, Subcommand> {
    //     throw Error(`${this.constructor.name}.subcommands is undefined.`);
    // }

    // public static get moderatorOnly(): boolean {
    //     throw Error(`${this.constructor.name}.moderatorOnly is undefined.`);
    // }

    // public static get ownerOnly(): boolean {
    //     throw Error(`${this.constructor.name}.ownerOnly is undefined.`);
    // }

    // public abstract execute(): string;

    // public abstract autocomplete(): string;
}
