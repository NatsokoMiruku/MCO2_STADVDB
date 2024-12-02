import { Sequelize } from 'sequelize';
import { centralNodeConnection, node2Connection, node3Connection } from './nodeConnections.js';

const attributes = {
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
};

export const CentralNodeGameInformation = centralNodeConnection.define('game_information', attributes, { tableName: 'game_information' });
export const Node2GameInformation = node2Connection.define('game_information', attributes, { tableName: 'game_information' });
export const Node3GameInformation = node3Connection.define('game_information', attributes, { tableName: 'game_information' });
