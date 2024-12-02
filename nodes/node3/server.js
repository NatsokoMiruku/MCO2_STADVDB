import express from 'express';
import { concurrencyMiddleware } from '../../middleware/concurrencyMiddleware.js';
import node3Connection from './db.js';

const app = express();

app.use(express.json());
app.use(concurrencyMiddleware);

app.get('/status', async (req, res) => {
    try {
        await node3Connection.authenticate();
        res.status(200).send('Node 3 is operational and connected to the database.');
    } catch (error) {
        res.status(500).send('Node 3 is not operational.');
    }
});

app.post('/transaction', async (req, res) => {
    const { action, data } = req.body;
    try {
        const GameInformation = node3Connection.define('game_information', {
            AppID: { type: Sequelize.DOUBLE, primaryKey: true },
            Name: { type: Sequelize.STRING },
            // Define other fields as necessary
        });

        if (action === 'insert') {
            await GameInformation.create(data);
        } else if (action === 'update') {
            await GameInformation.update(data, { where: { AppID: data.AppID } });
        }

        res.status(200).send('Transaction successful.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Transaction failed.');
    }
});

const PORT = 4003;
app.listen(PORT, () => console.log(`Node 3 server running on port ${PORT}`));
