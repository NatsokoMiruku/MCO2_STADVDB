import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { concurrencyMiddleware } from './middleware/concurrencyMiddleware.js';
import { loggingMiddleware } from './middleware/loggingMiddleware.js';
import gameRoutes from './routes/gameRoutes.js';
import nodeRoutes from './routes/nodeRoutes.js';
import recoveryRoutes from './routes/recoveryRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';


// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up Handlebars as the view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main', layoutsDir: './views/layouts' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/transactions', (req, res) => {
    res.render('transactions');
});

app.get('/recovery', (req, res) => {
    res.render('recovery');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register the recovery routes
app.use('/recovery', recoveryRoutes);

// Register routes with middleware
app.use('/transactions', concurrencyMiddleware, transactionRoutes);

app.use(loggingMiddleware); // Logging middleware

app.use('/nodes', nodeRoutes);

app.use('/', gameRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
