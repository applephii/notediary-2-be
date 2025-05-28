import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const User = db.define("user", {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    refresh_token: Sequelize.TEXT,
})

const Note = db.define("note", {
    author: Sequelize.STRING,
    title: Sequelize.STRING,
    notes: Sequelize.TEXT,
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
})

User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });

db.sync().then(() => console.log("Database is syncronised..."));

export { User, Note };