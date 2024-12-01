import express from 'express';
import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../DBConn.js';
import csvParser from 'csv-parser';
import fs from 'fs';
import { parse, format } from 'date-fns';


const transactionsRouter = express.Router();

/*transactionsRouter.get('/', (req,res) => {
  res.render('index');
});*/

// read all of the records
transactionsRouter.get('/', async (req, res) => {
  try {
    // limit the display of the steamgames records to 20
    const steamgames = await CentralNodeGameInformation.findAll({ limit: 20, raw: true });
    console.log(steamgames);

    res.render('index', { games: steamgames });
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

// create new record
transactionsRouter.post('/games', async (req, res) => {
  const { AppID, Name, Releasedate, Requiredage, Price, DLCcount, Windows, Mac, Linux, Achievements, Developers, Publishers, Categories, Genres, Positive, Negative} = req.body;
  
  const AppID_double = parseFloat(AppID);
  const Requiredage_double = parseFloat(Requiredage);
  const Price_double = parseFloat(Price);
  const DLCcount_double = parseFloat(DLCcount);
  const Achievements_double = parseFloat(Achievements);
  const Positive_double = parseFloat(Positive);
  const Negative_double = parseFloat(Negative);
  const parsedDate = parse(Releasedate, 'dd-MMM-yy', new Date());
  const formattedDate = format(parsedDate, 'dd/MM/yyyy');

  try {
    const newGame = await CentralNodeGameInformation.create({
      AppID: AppID_double,
      Name: Name , 
      Releasedate: formattedDate,
      Requiredage: Requiredage_double,
      Price: Price_double,
      DLCcount: DLCcount_double,
      Windows: Windows,
      Mac: Mac,
      Linux: Linux,
      Achievements: Achievements_double,
      Developers: Developers,
      Publishers: Publishers,
      Categories: Categories,
      Genres: Genres,
      Positive: Positive_double,
      Negative: Negative_double,      
    });

    res.redirect('/');
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

  
   const formattedDate = format(Releasedate, 'dd/MM/yyyy');

  try {
    const game = await CentralNodeGameInformation.findByPk(id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    game.Name = Name;
    game.Releasedate = formattedDate;
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
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error updating record: ' + error.message);
  }
});

// delete record
transactionsRouter.post('/delete/:id', async (req, res) => {
  
  const { id } = req.params;
  try {
    const game = await CentralNodeGameInformation.findByPk(id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    await game.destroy();
    res.redirect('/'); 
  } catch (error) {
    res.status(500).send('Error deleting record: ' + error.message);
  }
});


//import csv
/*transactionsRouter.get('/importcsv', async (req, res) => {
  console.log('CSV IMPORT CALLED');
  const csvFilePath = 'csvimport/output_part_1.csv';
  
  try {
      console.log('finding file path');
      await fs.promises.access(csvFilePath);

      const results = [];

      const csvStream = fs.createReadStream(csvFilePath).pipe(csvParser());

      console.log('putting files into an array');
      var count = 0;
      for await (const record of csvStream) {
          if(count % 1000 == 0){
              console.log(count);
          }
          count = count + 1;

          for (const key in record) {
              if (record[key] === '') {
                  record[key] = null;
              }
          }
          await CentralNodeGameInformation.create(record);
      }

      console.log('CSV import completed successfully.');
      res.sendStatus(200);

  } catch(err) {
      console.log('Error importing CSV: ', err);
      res.sendStatus(500);
  }
});

transactionsRouter.get('/importcsvnode2', async (req, res) => {
  console.log('CSV NODE 2 IMPORT CALLED');
  const csvFilePath = 'csvimport/output_part_1.csv';

  try {
      console.log('finding file path');
      await fs.promises.access(csvFilePath);

      const results = [];

      const csvStream = fs.createReadStream(csvFilePath).pipe(csvParser());

      console.log('putting files into an array');
      var count = 0;
      for await (const record of csvStream) {
          if(count % 1000 == 0){
              console.log(count);
          }
          count = count + 1;

          for (const key in record) {
              if (record[key] === '') {
                  record[key] = null;
              }
          }
          
          if (record.Releasedate) {
            const parsedDate = parse(record.Releasedate, 'dd-MMM-yy', new Date());
            const releaseYear = parsedDate.getFullYear();
            
            if (releaseYear < 2010) {
              await Node2GameInformation.create(record); // Insert into Node3GameInformation
            }
          }
        }

      console.log('CSV import completed successfully.');
      res.sendStatus(200);

  } catch(err) {
      console.log('Error importing CSV: ', err);
      res.sendStatus(500);
  }
});

transactionsRouter.get('/importcsvnode3', async (req, res) => {
  console.log('CSV NODE 3 IMPORT CALLED');
  const csvFilePath = 'csvimport/output_part_1.csv';

  try {
      console.log('finding file path');
      await fs.promises.access(csvFilePath);

      const results = [];

      const csvStream = fs.createReadStream(csvFilePath).pipe(csvParser());

      console.log('putting files into an array');
      var count = 0;
      for await (const record of csvStream) {
          if(count % 1000 == 0){
              console.log(count);
          }
          count = count + 1;

          for (const key in record) {
              if (record[key] === '') {
                  record[key] = null;
              }
          }
          
          if (record.Releasedate) {
            const parsedDate = parse(record.Releasedate, 'dd-MMM-yy', new Date());
            const releaseYear = parsedDate.getFullYear();
            
            if (releaseYear >= 2010) {
              await Node3GameInformation.create(record); // Insert into Node3GameInformation
            }
          }
        }
    
      console.log('CSV import completed successfully.');
      res.sendStatus(200);

  } catch(err) {
      console.log('Error importing CSV: ', err);
      res.sendStatus(500);
  }
});*/

export default transactionsRouter;
