import express from 'express';
import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../DBConn.js';

const transactionsRouter = express.Router();

transactionsRouter.get('/', (req,res) => {
  res.send('Loading Page...');
});

// Case #1: Read-only transactions across nodes
transactionsRouter.get('/case1', async (req, res) => {
  try {
    res.render('case1');
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

// Case #2: One writer, multiple readers
transactionsRouter.post('/case2', async (req, res) => {
  try {
    res.render('case2');
  } catch (error) {
    res.status(500).send('Error processing request: ' + error.message);
  }
});

// Case #3: Multiple writers
transactionsRouter.post('/case3', async (req, res) => {
  try {
    res.render('case3');
  } catch (error) {
    res.status(500).send('Error processing request: ' + error.message);
  }
});

export default transactionsRouter;
