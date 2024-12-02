import { CentralNodeGameInformation } from '../models/gameInformation.js';

export const getGames = async (req, res) => {
    try {
        // Fetch the first 20 games from the central node
        const games = await CentralNodeGameInformation.findAll({
            limit: 20, // Fetch only the first 20 rows
            order: [['AppID', 'ASC']], // Sort by AppID in ascending order
        });

        // Convert games to plain JSON
        const gameList = games.map((game) => game.get({ plain: true }));

        // Pass the game data to the dashboard view
        res.render('dashboard', { games: gameList });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).send('Failed to fetch games.');
    }
};
