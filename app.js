import bodyParser from 'body-parser';
import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { centralNodeConnection, localConnection, node2Connection, node3Connection } from './DBConn.js';
import transactionsRouter from './routes/transactions.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register the JSON helper for Handlebars
Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main'
}));

// Test connection for all database nodes
async function testConnection(sequelizeInstance, nodeName) {
    try {
        await sequelizeInstance.authenticate();
        console.log(`Connection has been established successfully to ${nodeName}`);
        if (nodeName == 'Local Connection') {
            await localConnection.sync();
        } else if (nodeName == 'Central Node') {
            await centralNodeConnection.sync();
        } else if (nodeName == 'Node 2') {
            await node2Connection.sync();
        } else if (nodeName == 'Node 3') {
            await node3Connection.sync();
        }
    } catch (e) {
        console.error(`Unable to connect to ${nodeName}`, e);
    }
}

testConnection(localConnection, 'Local Connection');
testConnection(centralNodeConnection, 'Central Node');
testConnection(node2Connection, 'Node 2');
testConnection(node3Connection, 'Node 3');

// Start the server
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// Routes
app.use('/', transactionsRouter);
