import { Sequelize } from 'sequelize';

const node3Connection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20742,
    dialect: 'mysql',
    logging: false,
});

export default node3Connection;
