import { exec } from 'child_process';
import { promisify } from 'util';

import { SlashCommandBuilder } from 'discord.js';

const execAsync = promisify(exec);

export default {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update bot/reload commands'),
    component: 'functionality',
    ownerOnly: true,
    execute(interaction) {
        return new Promise(async (resolve, reject) => {
            const { err } = await execAsync('git fetch --all && git reset --hard origin/main');
            if (err) {
                return interaction.reply(err.message).then(resolve()).catch((e) => reject(e));
            }
            else {
                interaction.reply({ content: 'Rebooting...', ephemeral: true }).then(() => process.exit(0)).catch((e) => reject(e));
            }
        });
    }
};
