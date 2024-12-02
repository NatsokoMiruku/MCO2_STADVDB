import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const localConnection = new Sequelize('steam_games', 'root', 'VincentVolnaris1@!', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    logging: console.log()
});

export const centralNodeConnection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20722,
    dialect: 'mysql',
    logging: console.log()
});

export const node2Connection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20732,
    dialect: 'mysql',
    logging: console.log()
});

export const node3Connection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20742,
    dialect: 'mysql',
    logging: console.log()
});

export const CentralNodeGameInformation = centralNodeConnection.define('game_information', {
    AppID: { type: Sequelize.DOUBLE, allowNull: false, primaryKey: true },
    Name: { type: Sequelize.STRING, allowNull: true },
    Releasedate: { type: Sequelize.STRING, allowNull: true },
    Requiredage: { type: Sequelize.DOUBLE, allowNull: true },
    Price: { type: Sequelize.DOUBLE, allowNull: true },
    DLCcount: { type: Sequelize.DOUBLE, allowNull: true },
    Windows: { type: Sequelize.STRING, allowNull: true },
    Mac: { type: Sequelize.STRING, allowNull: true },
    Linux: { type: Sequelize.STRING, allowNull: true },
    Achievements: { type: Sequelize.DOUBLE, allowNull: true },
    Developers: { type: Sequelize.STRING, allowNull: true },
    Publishers: { type: Sequelize.STRING, allowNull: true },
    Categories: { type: Sequelize.STRING(1000), allowNull: true },
    Genres: { type: Sequelize.STRING, allowNull: true },
    Positive: { type: Sequelize.DOUBLE, allowNull: true },
    Negative: { type: Sequelize.DOUBLE, allowNull: true },
}, {
    tableName: 'game_information'
});
