import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../models/gameInformation.js';

export const getNodeStatus = async (req, res) => {
    try {
        const centralStatus = await CentralNodeGameInformation.sequelize.authenticate()
            .then(() => 'Operational')
            .catch(() => 'Down');

        const node2Status = await Node2GameInformation.sequelize.authenticate()
            .then(() => 'Operational')
            .catch(() => 'Down');

        const node3Status = await Node3GameInformation.sequelize.authenticate()
            .then(() => 'Operational')
            .catch(() => 'Down');

        res.status(200).send({
            centralNode: centralStatus,
            node2: node2Status,
            node3: node3Status,
        });
    } catch (error) {
        console.error('Error checking node statuses:', error);
        res.status(500).send({ message: 'Failed to retrieve node statuses.' });
    }
};