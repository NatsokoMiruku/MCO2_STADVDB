import { Sequelize } from 'sequelize';

const node1Connection = new Sequelize('steam_games', 'root', 'VincentVolnaris1@!', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});

export default node1Connection;
