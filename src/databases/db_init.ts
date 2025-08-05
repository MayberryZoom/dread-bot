import { Sequelize } from "sequelize";

import * as dbModels from "./db_models";


// Initialize sequelize
const sequelize = new Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite"
});

// Import models
const models = Object.values(dbModels).map(createModelFunction => createModelFunction(sequelize))

// Force sync command line option
const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).then(() => {
    console.log("Database synced!");
    console.log(models);

    sequelize.close();
}).catch(console.error);
