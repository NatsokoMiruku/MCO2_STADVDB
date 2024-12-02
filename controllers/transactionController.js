import { releaseLock } from '../middleware/concurrencyMiddleware.js';
import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../models/gameInformation.js';

export const performTransaction = async (req, res) => {
    try {
        const { node, action } = req.body;
        let data = req.body.data;

        // Parse data if it is a string
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (error) {
                return res.status(400).send('Invalid JSON format in data.');
            }
        }

        if (!data || !data.AppID) {
            return res.status(400).send('AppID is required.');
        }

        let nodeConnection;
        if (node === 'central') nodeConnection = CentralNodeGameInformation;
        else if (node === 'node2') nodeConnection = Node2GameInformation;
        else if (node === 'node3') nodeConnection = Node3GameInformation;
        else {
            return res.status(400).send('Invalid node specified.');
        }

        if (action === 'insert') {
            await nodeConnection.create(data);
        } else if (action === 'update') {
            await nodeConnection.update(data, { where: { AppID: data.AppID } });
        } else {
            return res.status(400).send('Invalid action specified.');
        }

        res.status(200).send('Transaction performed successfully.');
    } catch (error) {
        console.error('Transaction error:', error.message);
        res.status(500).send('Transaction failed: ' + error.message);
    } finally {
        if (req.lockedResource) {
            releaseLock(req.lockedResource);
        }
    }
};

