import { Sequelize } from 'sequelize';

export const localConnection = new Sequelize('steam_games', 'root', 'VincentVolnaris1@!', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: console.log,
});

export const centralNodeConnection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20722,
    dialect: 'mysql',
    logging: console.log,
});

export const node2Connection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20732,
    dialect: 'mysql',
    logging: console.log,
});

export const node3Connection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20742,
    dialect: 'mysql',
    logging: console.log,
});
