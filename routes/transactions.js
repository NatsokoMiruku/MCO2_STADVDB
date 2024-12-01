import express from 'express';
import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../DBConn.js';

const transactionsRouter = express.Router();

transactionsRouter.get('/', (req,res) => {
  res.render('index');
});

// read all of the records
transactionsRouter.get('/gamelists', async (req, res) => {
  try {
    // limit the display of the steamgames records to 20
    const steamgames = await CentralNodeGameInformation.findAll({ limit: 20 });

    res.render('index', { games: steamgames });
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

// create new record
transactionsRouter.post('/gamelists', async (req, res) => {
  const { AppId, Name, Releasedate, Price, Aboutthegame } = req.body;

  try {
    const newGame = await CentralNodeGameInformation.create({
      AppId,
      Name, 
      Releasedate,
      Requiredage,
      Price,
      DLCcount,
      Windows,
      Mac,
      Linux,
      Achievements,
      Developers,
      Publishers,
      Categories,
      Genres,
      Positive,
      Negative      
    });

    res.redirect('/gamelists');
  } catch (error) {
    res.status(500).send('Error creating new record: ' + error.message);
  }
});

// update record
transactionsRouter.post('/gamelists/:id', async (req, res) => {
  
  const { id } = req.params;
  const {
    Name, 
    Releasedate,
    Requiredage,
    Price,
    DLCcount,
    Windows,
    Mac,
    Linux,
    Achievements,
    Developers,
    Publishers,
    Categories,
    Genres,
    Positive,
    Negative  
   } = req.body;
  try {
    const game = await CentralNodeGameInformation.findByPk(id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    game.Name = Name;
    game.Releasedate = Releasedate;
    game.Requiredage = Requiredage;
    game.Price = Price;
    game.DLCcount = DLCcount;
    game.Windows = Windows;
    game.Mac = Mac;
    game.Linux = Linux;
    game.Achievements = Achievements;
    game.Developers = Developers;
    game.Publishers = Publishers;
    game.Categories = Categories;
    game.Genres = Genres;
    game.Positive = Positive;
    game.Negative = Negative; 

    await game.save();
    res.redirect('/gamelists');
  } catch (error) {
    res.status(500).send('Error deleting record: ' + error.message);
  }
});

// delete record
transactionsRouter.post('/gamelists/delete/:id', async (req, res) => {
  
  const { id } = req.params;
  try {
    const game = await CentralNodeGameInformation.findByPk(id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    await game.destroy();
    res.redirect('/games'); 
  } catch (error) {
    res.status(500).send('Error deleting record: ' + error.message);
  }
});

export default transactionsRouter;
