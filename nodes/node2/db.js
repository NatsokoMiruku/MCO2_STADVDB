import { Sequelize } from 'sequelize';

const node2Connection = new Sequelize('steam_games', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20732,
    dialect: 'mysql',
    logging: false,
});

export default node2Connection;
