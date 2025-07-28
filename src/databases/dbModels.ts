import { DataTypes } from "sequelize";

export const createStreamBlacklistModel = (sequelize) => sequelize.define('streamBlacklist', {
    userId: {
        type: DataTypes.STRING,
        unique: true
    }
});
