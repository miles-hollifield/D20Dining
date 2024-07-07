// favoritesRoute.js
const express = require('express');
const apiRouter = express.Router();

const FavoriteDAO = require('../../db/favoritesDAO');

const { TokenMiddleware } = require('../middleware/authorize');

apiRouter.use(TokenMiddleware);

// Get all favorites for the currently authenticated user
apiRouter.get('/users/:userId/favorites', async (req, res) => {
  if (req.user.id != req.params.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const favorites = await FavoriteDAO.getUserFavorites(req.params.userId);
    res.json(favorites);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a restaurant to favorites
apiRouter.post('/favorites', TokenMiddleware, async (req, res) => {
  const userId = req.user.id; 
  const { restaurantId } = req.body; 

  try {
    const favorite = await FavoriteDAO.addFavorite(userId, restaurantId);
    res.status(201).json(favorite);
  } catch (error) {
    console.error("Failed to add to favorites:", error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove a restaurant from favorites
apiRouter.delete('/favorites/:favoriteId', TokenMiddleware, async (req, res) => {
  const favoriteId = req.params.favoriteId;

  try {
    await FavoriteDAO.removeFavorite(favoriteId);
    res.status(204).send(); // No content to send back on successful deletion
  } catch (error) {
    console.error("Failed to remove from favorites:", error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

module.exports = apiRouter;
