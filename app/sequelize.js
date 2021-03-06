const { Sequelize, Model, DataTypes } = require('sequelize');

// FIXME: use absolute path to store file

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/sqlite/database.sqlite',
    logging: false,
});

class Doc extends Model {}
Doc.init(
    {
        uid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        hash: {
            type: DataTypes.NUMBER,
            unique: true,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timedout: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    },
    { sequelize, modelName: 'doc' },
);

// const syncOptions = { force: true };
const syncOptions = {};

// drop the table if it already exists
sequelize.sync(syncOptions).then(() => {
    console.info('[sequelize] Syncing db');
});

module.exports = {
    sequelize,
    Doc,
};
