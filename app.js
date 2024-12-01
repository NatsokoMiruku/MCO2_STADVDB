import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { Sequelize } from 'sequelize';
import { localConnection } from './DBConn.js';
import { centralNodeConnection } from './DBConn.js';
import { node2Connection } from './DBConn.js';
import { node3Connection } from './DBConn.js';
import path from 'path';
import Handlebars from 'handlebars';
import { engine } from 'express-handlebars';
import transactionsRouter from './routes/transactions.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('hbs', engine({
    extname: '.hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, '/views/layouts')
}));

// middleware
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// app.set('views',  path.join(__dirname, 'views'));

// app.get('/', (req, res) =>{
//     res.render('index', { title: 'Welcome to Transactions' });
// });


async function testConnection(sequelizeInstance, nodeName) {
    try{
        await sequelizeInstance.authenticate();
        console.log(`Connection has been established successfully to ${nodeName}`);
        if(nodeName == 'Local Connection'){
            await localConnection.sync();
        } else if(nodeName == 'Central Node') {
            await centralNodeConnection.sync();
        } else if(nodeName == 'Node 2') {
            await node2Connection.sync();
        } else if(nodeName == 'Node 3') {
            await node3Connection.sync();
        }
    } catch(e) {
        console.error(`Unable to connect to ${nodeName}`, e);
    }
}

testConnection(localConnection, 'Local Connection');
testConnection(centralNodeConnection, 'Central Node');
testConnection(node2Connection, 'Node 2');
testConnection(node3Connection, 'Node 3');

app.listen(3000, () => {
    console.log('server is listening on... ' + 3000);
});

app.use('/', transactionsRouter);