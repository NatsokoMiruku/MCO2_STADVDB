import 'dotenv/config'
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
    AppID: {type: Sequelize.DOUBLE, allowNull: false, primaryKey: true},
    Name: {type: Sequelize.STRING, allowNull: true},
    Releasedate: {type: Sequelize.STRING, allowNull: true},
    Requiredage: {type: Sequelize.DOUBLE, allowNull: true},
    Price: {type: Sequelize.DOUBLE, allowNull: true},
    DLCcount: {type: Sequelize.DOUBLE, allowNull: true},
    Aboutthegame: {type: Sequelize.STRING, allowNull: true},
    Reviews: {type: Sequelize.STRING, allowNull: true},
    Headerimage: {type: Sequelize.STRING, allowNull: true},
    Website: {type: Sequelize.STRING, allowNull: true},
    Supporturl: {type: Sequelize.STRING, allowNull: true},
    Supportemail: {type: Sequelize.STRING, allowNull: true},
    Windows: {type: Sequelize.STRING, allowNull: true},
    Mac: {type: Sequelize.STRING, allowNull: true},
    Linux: {type: Sequelize.STRING, allowNull: true},
    Metacriticscore: {type: Sequelize.DOUBLE, allowNull: true},
    Metacriticurl: {type: Sequelize.STRING, allowNull: true},
    Achievements: {type: Sequelize.DOUBLE, allowNull: true},
    Recommendations: {type: Sequelize.DOUBLE, allowNull: true},
    Notes: {type: Sequelize.STRING, allowNull: true},
    Supportedlanguages: {type: Sequelize.STRING, allowNull: true},
    Fullaudiolanguages: {type: Sequelize.STRING, allowNull: true},
    Developers: {type: Sequelize.STRING, allowNull: true},
    Publishers: {type: Sequelize.STRING, allowNull: true},
    Categories: {type: Sequelize.STRING, allowNull: true},
    Genres: {type: Sequelize.STRING, allowNull: true},
    Screenshots: {type: Sequelize.STRING, allowNull: true},
    Movies: {type: Sequelize.STRING, allowNull: true},
    Userscore: {type: Sequelize.DOUBLE, allowNull: true},
    Positive: {type: Sequelize.DOUBLE, allowNull: true},
    Negative: {type: Sequelize.DOUBLE, allowNull: true},
    Estimatedowners: {type: Sequelize.STRING, allowNull: true},
    Averageplaytimeforever: {type: Sequelize.DOUBLE, allowNull: true},
    Averageplaytimetwoweeks: {type: Sequelize.DOUBLE, allowNull: true},
    Medianplaytimeforever: {type: Sequelize.DOUBLE, allowNull: true},
    Medianplaytimetwoweeks: {type: Sequelize.DOUBLE, allowNull: true},
    PeakCCU: {type: Sequelize.DOUBLE, allowNull: true},
    Tags: {type: Sequelize.STRING, allowNull: true},

}, {
    tableName: 'game_information' // Make sure this matches your actual table name
});

export const Node2GameInformation = node2Connection.define('game_information', {
    AppID: {type: Sequelize.DOUBLE, allowNull: false, primaryKey: true},
    Name: {type: Sequelize.STRING, allowNull: true},
    Releasedate: {type: Sequelize.STRING, allowNull: true},
    Requiredage: {type: Sequelize.DOUBLE, allowNull: true},
    Price: {type: Sequelize.DOUBLE, allowNull: true},
    DLCcount: {type: Sequelize.DOUBLE, allowNull: true},
    Aboutthegame: {type: Sequelize.STRING, allowNull: true},
    Reviews: {type: Sequelize.STRING, allowNull: true},
    Headerimage: {type: Sequelize.STRING, allowNull: true},
    Website: {type: Sequelize.STRING, allowNull: true},
    Supporturl: {type: Sequelize.STRING, allowNull: true},
    Supportemail: {type: Sequelize.STRING, allowNull: true},
    Windows: {type: Sequelize.STRING, allowNull: true},
    Mac: {type: Sequelize.STRING, allowNull: true},
    Linux: {type: Sequelize.STRING, allowNull: true},
    Metacriticscore: {type: Sequelize.DOUBLE, allowNull: true},
    Metacriticurl: {type: Sequelize.STRING, allowNull: true},
    Achievements: {type: Sequelize.DOUBLE, allowNull: true},
    Recommendations: {type: Sequelize.DOUBLE, allowNull: true},
    Notes: {type: Sequelize.STRING, allowNull: true},
    Supportedlanguages: {type: Sequelize.STRING, allowNull: true},
    Fullaudiolanguages: {type: Sequelize.STRING, allowNull: true},
    Developers: {type: Sequelize.STRING, allowNull: true},
    Publishers: {type: Sequelize.STRING, allowNull: true},
    Categories: {type: Sequelize.STRING, allowNull: true},
    Genres: {type: Sequelize.STRING, allowNull: true},
    Screenshots: {type: Sequelize.STRING, allowNull: true},
    Movies: {type: Sequelize.STRING, allowNull: true},
    Userscore: {type: Sequelize.DOUBLE, allowNull: true},
    Positive: {type: Sequelize.DOUBLE, allowNull: true},
    Negative: {type: Sequelize.DOUBLE, allowNull: true},
    Estimatedowners: {type: Sequelize.STRING, allowNull: true},
    Averageplaytimeforever: {type: Sequelize.DOUBLE, allowNull: true},
    Averageplaytimetwoweeks: {type: Sequelize.DOUBLE, allowNull: true},
    Medianplaytimeforever: {type: Sequelize.DOUBLE, allowNull: true},
    Medianplaytimetwoweeks: {type: Sequelize.DOUBLE, allowNull: true},
    PeakCCU: {type: Sequelize.DOUBLE, allowNull: true},
    Tags: {type: Sequelize.STRING, allowNull: true},

}, {
    tableName: 'game_information' // Make sure this matches your actual table name
});

export const Node3GameInformation = node3Connection.define('game_information', {
    AppID: {type: Sequelize.DOUBLE, allowNull: false, primaryKey: true},
    Name: {type: Sequelize.STRING, allowNull: true},
    Releasedate: {type: Sequelize.STRING, allowNull: true},
    Requiredage: {type: Sequelize.DOUBLE, allowNull: true},
    Price: {type: Sequelize.DOUBLE, allowNull: true},
    DLCcount: {type: Sequelize.DOUBLE, allowNull: true},
    Aboutthegame: {type: Sequelize.STRING, allowNull: true},
    Reviews: {type: Sequelize.STRING, allowNull: true},
    Headerimage: {type: Sequelize.STRING, allowNull: true},
    Website: {type: Sequelize.STRING, allowNull: true},
    Supporturl: {type: Sequelize.STRING, allowNull: true},
    Supportemail: {type: Sequelize.STRING, allowNull: true},
    Windows: {type: Sequelize.STRING, allowNull: true},
    Mac: {type: Sequelize.STRING, allowNull: true},
    Linux: {type: Sequelize.STRING, allowNull: true},
    Metacriticscore: {type: Sequelize.DOUBLE, allowNull: true},
    Metacriticurl: {type: Sequelize.STRING, allowNull: true},
    Achievements: {type: Sequelize.DOUBLE, allowNull: true},
    Recommendations: {type: Sequelize.DOUBLE, allowNull: true},
    Notes: {type: Sequelize.STRING, allowNull: true},
    Supportedlanguages: {type: Sequelize.STRING, allowNull: true},
    Fullaudiolanguages: {type: Sequelize.STRING, allowNull: true},
    Developers: {type: Sequelize.STRING, allowNull: true},
    Publishers: {type: Sequelize.STRING, allowNull: true},
    Categories: {type: Sequelize.STRING, allowNull: true},
    Genres: {type: Sequelize.STRING, allowNull: true},
    Screenshots: {type: Sequelize.STRING, allowNull: true},
    Movies: {type: Sequelize.STRING, allowNull: true},
    Userscore: {type: Sequelize.DOUBLE, allowNull: true},
    Positive: {type: Sequelize.DOUBLE, allowNull: true},
    Negative: {type: Sequelize.DOUBLE, allowNull: true},
    Estimatedowners: {type: Sequelize.STRING, allowNull: true},
    Averageplaytimeforever: {type: Sequelize.DOUBLE, allowNull: true},
    Averageplaytimetwoweeks: {type: Sequelize.DOUBLE, allowNull: true},
    Medianplaytimeforever: {type: Sequelize.DOUBLE, allowNull: true},
    Medianplaytimetwoweeks: {type: Sequelize.DOUBLE, allowNull: true},
    PeakCCU: {type: Sequelize.DOUBLE, allowNull: true},
    Tags: {type: Sequelize.STRING, allowNull: true},

}, {
    tableName: 'game_information' // Make sure this matches your actual table name
});