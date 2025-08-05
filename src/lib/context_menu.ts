import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";
import { ExecuteInteractionFunction } from "./utils";
import { ExecutableComponent, ExecutableComponentConstructor } from "./base_component";


interface UserContextMenuConstructor extends ExecutableComponentConstructor {
    builder: ContextMenuCommandBuilder;
    execute?: ExecuteInteractionFunction<UserContextMenuCommandInteraction>;
}

export class UserContextMenu extends ExecutableComponent {
    public builder: ContextMenuCommandBuilder;
    public _execute?: ExecuteInteractionFunction<UserContextMenuCommandInteraction>;

    public constructor(fields: UserContextMenuConstructor) {
        super(fields);
        this.builder = fields.builder.setName(fields.name)
        this._execute = fields.execute;
    }
}
