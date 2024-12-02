import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../models/gameInformation.js';
import { logRecovery, recoverNode } from '../models/recoveryModel.js';

export const simulateRecovery = async (req, res) => {
    const { node } = req.body;

    try {
        let targetNode;
        if (node === 'central') targetNode = CentralNodeGameInformation;
        else if (node === 'node2') targetNode = Node2GameInformation;
        else if (node === 'node3') targetNode = Node3GameInformation;
        else throw new Error('Invalid node specified.');

        // Perform recovery
        const recoveryResult = await recoverNode(targetNode);
        await logRecovery(targetNode);

        res.status(200).send(recoveryResult);
    } catch (error) {
        console.error('Recovery failed:', error);
        res.status(500).send('Recovery failed: ' + error.message);
    }
};