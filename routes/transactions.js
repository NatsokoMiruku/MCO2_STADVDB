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
  
    for(const games of steamgames){
      try{
        const parsedDate = parse(games.Releasedate, 'dd-MMM-yy', new Date());
        const formattedDate = format(parsedDate, 'yyyy-MM-dd');
        games.Releasedate = formattedDate;
      } catch(e)
      {
        console.log('format already fixed.');
      }
    }
    //console.log(steamgames);
    res.render('index', { games: steamgames, helpers: {
      isTrue(value) {return value == 'TRUE';}
    } });
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

// create new record
transactionsRouter.post('/games', async (req, res) => {
  const { AppID, Name, Releasedate, Requiredage, Price, DLCcount, Windows, Mac, Linux, Achievements, Developers, Publishers, Categories, Genres, Positive, Negative} = req.body;
  
  // const AppID_double = parseFloat(AppID);
  // const Requiredage_double = parseFloat(Requiredage);
  // const Price_double = parseFloat(Price);
  // const DLCcount_double = parseFloat(DLCcount);
  // const Achievements_double = parseFloat(Achievements);
  // const Positive_double = parseFloat(Positive);
  // const Negative_double = parseFloat(Negative);

  const fixedWindows = Windows ? 'TRUE' : 'FALSE';
  const fixedMac = Mac ? 'TRUE' : 'FALSE';
  const fixedLinux = Linux ? 'TRUE' : 'FALSE';

  console.log(fixedWindows, fixedMac, fixedLinux);


  try {
    const newGame = await CentralNodeGameInformation.create({
      AppID: AppID,
      Name: Name , 
      Releasedate: Releasedate,
      Requiredage: Requiredage,
      Price: Price,
      DLCcount: DLCcount,
      Windows: fixedWindows,
      Mac: fixedMac,
      Linux: fixedLinux,
      Achievements: Achievements,
      Developers: Developers,
      Publishers: Publishers,
      Categories: Categories,
      Genres: Genres,
      Positive: Positive,
      Negative: Negative,      
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

  console.log(Windows, Linux, Mac);
  const fixedWindows = Windows ? 'TRUE' : 'FALSE';
  const fixedMac = Mac ? 'TRUE' : 'FALSE';
  const fixedLinux = Linux ? 'TRUE' : 'FALSE';

  console.log(fixedWindows, fixedLinux, fixedMac);

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
    game.Windows = fixedWindows;
    game.Mac = fixedMac;
    game.Linux = fixedLinux;
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

transactionsRouter.post('/search', async (req, res) => {
  const appid = req.body.AppID;
  console.log('data recieved', appid);
  

  const searchRecord = await CentralNodeGameInformation.findAll({where: {AppID: appid}, raw:true});

  for(const games of searchRecord){
    try{
      const parsedDate = parse(games.Releasedate, 'dd-MMM-yy', new Date());
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');
      games.Releasedate = formattedDate;
    } catch(e)
    {
      console.log('format already fixed.');
    }
  }
  res.render('index', { games: searchRecord, helpers: {
      isTrue(value) {return value == 'TRUE';}
    } });
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
