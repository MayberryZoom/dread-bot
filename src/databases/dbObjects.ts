import { Sequelize } from 'sequelize';

import { createStreamBlacklistModel } from './dbModels';

// Initialize sequelize
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

// Models
export const StreamBlacklist = createStreamBlacklistModel(sequelize)
