import express from 'express';
import { centralNodeConnection, CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from '../DBConn.js';
import csvParser from 'csv-parser';
import fs from 'fs';
import { parse, format } from 'date-fns';

const nodeRecoveryQueue = [];
var needRecovery = false;


const transactionsRouter = express.Router();

/*transactionsRouter.get('/', (req,res) => {
  res.render('index');
});*/

// read all of the records
transactionsRouter.get('/', async (req, res) => {
  if(nodeRecoveryQueue.length != 0){
    needRecovery = true;
  } else {
    needRecovery = false;
  }
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
      res.render('index', { games: steamgames, needRecovery: needRecovery, helpers: {
        isTrue(value) {return value == 'TRUE';}
      } });
  } catch (error) {
    res.status(500).send('Error fetching from Central Node, Fetching from node 2 and node 3 ' + error.message);
    try{
      const steamGamesnode2 = await Node2GameInformation.findAll({limit: 10, raw: true});
      const steamGamesnode3 = await Node3GameInformation.findAll({limit: 10, raw: true});
      const combinedSteamGames = [...steamGamesnode2, ...steamGamesnode3];
      for(const games of combinedSteamGames){
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
      res.render('index', { games: combinedSteamGames, needRecovery: needRecovery ,helpers: {
        isTrue(value) {return value == 'TRUE';}
      } });
    } catch(error) {
      console.log('Cannot fetch data, all relevant nodes down.', error);
    }
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

  const createGame = {
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
      Negative: Negative
  }

  const parsedDate = parse(Releasedate, 'yyyy-MM-dd', new Date());
  const releaseYear = parsedDate.getFullYear();
  console.log(releaseYear);

  try {
    console.log('Writing to Central Node');
    const centralNodeTransaction = await CentralNodeGameInformation.sequelize.transaction();
    if (!createGame) {
      // If game not found, rollback the transaction and return 404
      await centralNodeTransaction.rollback();
      return res.status(404).send('Game not found');
    }
    const newGame = await CentralNodeGameInformation.create(createGame, {transaction: centralNodeTransaction});
    await centralNodeTransaction.commit();
    console.log('Central Node write successful.');
  } catch (centralError) {
    console.log('Error creating new record in Central Node: ' + centralError.message);
    nodeRecoveryQueue.push({node: 'CentralNode', operation: 'create',  data: createGame});
  }
  if(releaseYear < 2010){
    try {
      console.log('Writing to Node 2');
      const node2Transaction = await Node2GameInformation.sequelize.transaction();
      if (!createGame) {
        // If game not found, rollback the transaction and return 404
        await node2Transaction.rollback();
        return res.status(404).send('Game not found');
      }
      const newGame = await Node2GameInformation.create(createGame, {transaction: node2Transaction});
      await node2Transaction.commit();
      console.log('Node 2 write successful.');
    } catch (node2Error) {
      console.log('Error creating new record in Node 2: ' + node2Error.message);
      nodeRecoveryQueue.push({node: 'Node 2', operation: 'create', data: createGame});
    }
  } else {
    try {
      //do this for other functions
      console.log('Writing to Node 3');
      const node3Transaction = await Node3GameInformation.sequelize.transaction();
      if (!createGame) {
        // If game not found, rollback the transaction and return 404
        await node3Transaction.rollback();
        return res.status(404).send('Game not found');
      }
      const newGame = await Node3GameInformation.create(createGame, {transaction: node3Transaction});
      await node3Transaction.commit();
      console.log('Node 3 write successful.');
    } catch (node3Error) {
      console.log('Error creating new record in Node 3: ' + node3Error.message);
      nodeRecoveryQueue.push({node: 'Node 3', operation: 'create', data: createGame});
    }
  }
  res.redirect('/');

});


// update record
transactionsRouter.post('/gamelists/:id', async (req, res) => {
  
  const { id } = req.params;
  const { 
    AppID,
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

  const updateGame = {
    AppID: id,
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
    Negative: Negative
}

  const parsedDate = parse(Releasedate, 'yyyy-MM-dd', new Date());
  const releaseYear = parsedDate.getFullYear();

  try {
    console.log('Updating to Central Node');
    const centralNodeTransaction = await CentralNodeGameInformation.sequelize.transaction();
    if (!updateGame) {
      // If game not found, rollback the transaction and return 404
      await centralNodeTransaction.rollback();
      return res.status(404).send('Game not found');
    }
    const game = await CentralNodeGameInformation.findByPk(id, {transaction: centralNodeTransaction});
    game.AppID = id;
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

    await game.update(updateGame, {transaction: centralNodeTransaction});
    await centralNodeTransaction.commit();
    console.log('Central Node update successful.');
    } catch (centralError) {
      console.log('Error updating record in Central Node: ' + centralError.message);
      nodeRecoveryQueue.push({node: 'CentralNode', operation: 'update', data: updateGame});
    }
    if(releaseYear < 2010){  
      try {
        console.log('Updating to Node 2');
        const node2Transaction = await Node2GameInformation.sequelize.transaction();
        if (!updateGame) {
          // If game not found, rollback the transaction and return 404
          await node2Transaction.rollback();
          return res.status(404).send('Game not found');
        }
        const game = await Node2GameInformation.findByPk(id, {transaction: node2Transaction});
        game.AppID = id;
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

        await game.update(updateGame, {transaction: node2Transaction});
        await node2Transaction.commit();
        console.log('Node 2 update successful.');
          } catch (node2Error) {
            console.log('Error creating new record in Node 2: ' + node2Error.message);
            nodeRecoveryQueue.push({node: 'Node 2', operation: 'update', data: updateGame});
          }
        } else {
          try {
            console.log('Updating to Node 3');
            const node3Transaction = await Node3GameInformation.sequelize.transaction();
            if (!updateGame) {
              // If game not found, rollback the transaction and return 404
              await node3Transaction.rollback();
              return res.status(404).send('Game not found');
            }
            const game = await Node3GameInformation.findByPk(id, {transaction: node3Transaction});
            game.AppID = id;
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

            await game.update(updateGame, {transaction: node3Transaction});
            await node3Transaction.commit();
            console.log('Node 3 update successful.');
          } catch (node3Error) {
            console.log('Error updating new record in Node 3: ' + node3Error.message);
            nodeRecoveryQueue.push({node: 'Node 3', operation: 'update', data: updateGame});
          }
        }

        res.redirect('/');

});

// delete record
transactionsRouter.post('/delete/:id', async (req, res) => {

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

   //add other node checking later
   const findGame = await CentralNodeGameInformation.findByPk(id);

   console.log(findGame);

   const parsedDate = parse(findGame.Releasedate, 'yyyy-MM-dd', new Date());
   const releaseYear = parsedDate.getFullYear();

  try {
    console.log('Deleting to Central Node');
    const centralNodeTransaction = await CentralNodeGameInformation.sequelize.transaction();
    if (!findGame) {
      // If game not found, rollback the transaction and return 404
      await centralNodeTransaction.rollback();
      return res.status(404).send('Game not found');
    }
    const game = await CentralNodeGameInformation.findByPk(id,{transaction: centralNodeTransaction});
    await game.destroy({transaction: centralNodeTransaction});
    await centralNodeTransaction.commit();
    console.log('Central Node Delete successful.')
  } catch (centralError) {
    console.log('Error deleting record in Central Node: ' + centralError.message);
    nodeRecoveryQueue.push({node: 'CentralNode', operation: 'delete',  data: {AppID: id}});
  }
  if(releaseYear < 2010){
    try {
      console.log('Deleting to Node 2');
      const node2Transaction = await Node2GameInformation.sequelize.transaction();
      if (!findGame) {
        // If game not found, rollback the transaction and return 404
        await node2Transaction.rollback();
        return res.status(404).send('Game not found');
      }
      const game = await Node2GameInformation.findByPk(id, {transaction: node2Transaction});
      await game.destroy({transaction: node2Transaction});
      await node2Transaction.commit();
      console.log('Node 2 Delete successful.')
    } catch (node2Error) {
      console.log('Error deleting record in Node 2: ' + node2Error.message);
      nodeRecoveryQueue.push({node: 'Node 2', operation: 'delete', data: {AppID: id}});
    }
  } else {
  
    try {
      console.log('Deleting to Node 3');
      const node3Transaction = await Node3GameInformation.sequelize.transaction();
      if (!findGame) {
        // If game not found, rollback the transaction and return 404
        await node3Transaction.rollback();
        return res.status(404).send('Game not found');
      }
      const game = await Node3GameInformation.findByPk(id, {transaction: node3Transaction});
      await game.destroy({transaction: node3Transaction});
      await node3Transaction.commit();
      console.log('Node 3 Delete successful.')
    } catch (node3Error) {
      console.log('Error deleting record in Node 3: ' + node3Error.message);
      nodeRecoveryQueue.push({node: 'Node 3', operation: 'delete', data: {AppID: id}});
    }
  }
  res.redirect('/'); 
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

transactionsRouter.post('/search2', async (req, res) => {
  const appid = req.body.AppID;
  console.log('data recieved', appid);
  

  const searchRecord = await Node2GameInformation.findAll({where: {AppID: appid}, raw:true});

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

transactionsRouter.post('/search3', async (req, res) => {
  const appid = req.body.AppID;
  console.log('data recieved', appid);
  

  const searchRecord = await Node3GameInformation.findAll({where: {AppID: appid}, raw:true});

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


transactionsRouter.get('/sync', async (req, res) => {
  if (nodeRecoveryQueue.length === 0) return; // No failed writes to process

  console.log('Starting recovery of failed writes...');
  const remainingWrites = [];


  for (const write of nodeRecoveryQueue) {
    console.log(write);
    try {
      if (write.operation === 'create') {
        if (write.node === 'CentralNode') {
          console.log('Retrying create operation on Central Node...');
          await CentralNodeGameInformation.create(write.data);
          console.log('Create recovery successful for Central Node.');
        } else if (write.node === 'Node 2') {
            console.log('Retrying create operation on Node 2...');
            await Node2GameInformation.create(write.data);
            console.log('Create recovery successful for Node 2.');  
        } else if (write.node === 'Node 3') {
          console.log('Retrying create operation on Node 3...');
          await Node3GameInformation.create(write.data);
          console.log('Create recovery successful for Node 3.');
        }
      } else if (write.operation === 'update') {
        if (write.node === 'CentralNode') {
          console.log('Retrying create operation on Central Node...');
          await CentralNodeGameInformation.update(write.data, { where: { AppID: write.data.AppID } });
          console.log('Updating recovery successful for Central Node.');
        } else if (write.node === 'Node 2') {
          console.log('Retrying update operation on Node 2...');
          await Node2GameInformation.update(write.data, { where: { AppID: write.data.AppID } });
          console.log('Update recovery successful for Node 2.');
        } else if (write.node === 'Node 3') {
          console.log('Retrying update operation on Node 3...');
          await Node3GameInformation.update(write.data, { where: { AppID: write.data.AppID } });
          console.log('Update recovery successful for Node 3.');
        }
      } else if (write.operation === 'delete') {
        if (write.node === 'CentralNode') {
          console.log('Retrying delete operation for Central Node...');
          await CentralNodeGameInformation.destroy(write.data, { where: { id: write.data.id } });
          console.log('Delete recovery successful for Central Node.');
        } else if (write.node === 'Node 2') {
          console.log('Retrying delete operation on Node 2...');
          await Node2GameInformation.destroy(write.data, { where: { id: write.data.id } });
          console.log('Delete recovery successful for Node 2.');
        } else if (write.node === 'Node 3') {
          console.log('Retrying delete operation on Node 3...');
          await Node3GameInformation.destroy(write.data, { where: { id: write.data.id } });
          console.log('Delete recovery successful for Node 3.');
        }
      }
    } catch (recoveryError) {
      console.error(`Recovery failed for ${write.node} (${write.operation}):`, recoveryError.message);
      remainingWrites.push(write); // Keep failed writes for the next attempt
    }
  }
  // Update the failedWrites queue with remaining writes
  nodeRecoveryQueue.length = 0; // Clear the queue
  nodeRecoveryQueue.push(...remainingWrites);

  if (remainingWrites.length > 0) {
    console.log(`Recovery incomplete. ${remainingWrites.length} writes remain.`);
    res.redirect('/'); 
  } else {
    console.log('All failed writes successfully recovered.');
    res.redirect('/'); 
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
