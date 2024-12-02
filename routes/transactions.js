import { format, parse } from 'date-fns';
import express from 'express';
import { CentralNodeGameInformation } from '../DBConn.js';

const transactionsRouter = express.Router();

// Get records
transactionsRouter.get('/', async (req, res) => {
    try {
        const steamgames = await CentralNodeGameInformation.findAll({ limit: 20, raw: true });
        res.render('index', { games: steamgames, gamesJSON: JSON.stringify(steamgames) });
    } catch (error) {
        res.status(500).send('Error fetching data: ' + error.message);
    }
});

// Create record
transactionsRouter.post('/games', async (req, res) => {
    const { AppID, Name, Releasedate, Requiredage, Price, DLCcount, Windows, Mac, Linux, Achievements, Developers, Publishers, Categories, Genres, Positive, Negative } = req.body;
    try {
        const newGame = await CentralNodeGameInformation.create({
            AppID: parseFloat(AppID),
            Name,
            Releasedate: format(parse(Releasedate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd'),
            Requiredage: parseFloat(Requiredage),
            Price: parseFloat(Price),
            DLCcount: parseFloat(DLCcount),
            Windows,
            Mac,
            Linux,
            Achievements: parseFloat(Achievements),
            Developers,
            Publishers,
            Categories,
            Genres,
            Positive: parseFloat(Positive),
            Negative: parseFloat(Negative),
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error creating new record: ' + error.message);
    }
});

// Update record
transactionsRouter.post('/gamelists/:id', async (req, res) => {
  const { id } = req.params;
  const {
      Name, Releasedate, Requiredage, Price, DLCcount,
      Windows, Mac, Linux, Achievements, Developers,
      Publishers, Categories, Genres, Positive, Negative
  } = req.body;

  try {
      const game = await CentralNodeGameInformation.findByPk(id);
      if (!game) return res.status(404).send('Game not found');

      // Update only the fields that are provided
      if (Name !== undefined) game.Name = Name;
      if (Releasedate !== undefined) game.Releasedate = Releasedate;
      if (Requiredage !== undefined) game.Requiredage = parseFloat(Requiredage) || null;
      if (Price !== undefined) game.Price = parseFloat(Price) || null;
      if (DLCcount !== undefined) game.DLCcount = parseFloat(DLCcount) || null;
      if (Windows !== undefined) game.Windows = Windows;
      if (Mac !== undefined) game.Mac = Mac;
      if (Linux !== undefined) game.Linux = Linux;
      if (Achievements !== undefined) game.Achievements = parseFloat(Achievements) || null;
      if (Developers !== undefined) game.Developers = Developers;
      if (Publishers !== undefined) game.Publishers = Publishers;
      if (Categories !== undefined) game.Categories = Categories;
      if (Genres !== undefined) game.Genres = Genres;
      if (Positive !== undefined) game.Positive = parseFloat(Positive) || null;
      if (Negative !== undefined) game.Negative = parseFloat(Negative) || null;

      await game.save();
      res.redirect('/');
  } catch (error) {
      res.status(500).send('Error updating record: ' + error.message);
  }
});


// Delete record
transactionsRouter.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const game = await CentralNodeGameInformation.findByPk(id);
        if (!game) return res.status(404).send('Game not found');
        await game.destroy();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting record: ' + error.message);
    }
});

export default transactionsRouter;
