const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { graphQlDomain, contributorRole } = require ('../config.json');
const { wikiToken } = require('../tokens.json');

const userQuery = (id) => '{users{singleByProviderId(providerId:"' + id + '"){id,providerId,name,providerName}}}'

const fetchUser = (id) => new Promise((resolve) => axios.get('http://' + graphQlDomain + '/graphql?query=' + userQuery(id), { headers: { 'Authorization': 'Bearer ' + wikiToken } }).then(res => resolve(res.data.data.users.singleByProviderId)));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify yourself on the wiki'),
    component: 'wiki',
    execute(interaction) {
        return new Promise(async (resolve, reject) => {
            await interaction.guild.roles.fetch();
            if (interaction.member.roles.cache.has(contributorRole)) return interaction.reply({ content: 'You already have the contributor role!', ephemeral: true }).then(resolve()).catch(e => reject(e));

            let user = await fetchUser(interaction.user.id);
            if (!user) return interaction.reply({ content: 'No user found!', ephemeral: true }).then(resolve()).catch(e => reject(e));

            await interaction.member.roles.add(contributorRole).catch(e => reject(e));
            interaction.reply('User found! You should now have the contributor role.').then(resolve()).catch(e => reject(e));
        });
    }
};
