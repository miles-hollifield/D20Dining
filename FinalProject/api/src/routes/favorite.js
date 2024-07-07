const express = require('express');
const apiRouter = express.Router();

const FavoriteDAO = require('../../db/favoritesDAO');
const RestaurantDAO = require('../../db/restaurantDAO');
const { TokenMiddleware } = require('../middleware/authorize');

apiRouter.use(TokenMiddleware);

// Helper function for sending responses
const sendResponse = (res, promise) => {
  promise
    .then(data => res.json(data))
    .catch(error => {
      console.error("Error:", error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

// Get all favorites for the currently authenticated user
apiRouter.get('/users/:userId/favorites', (req, res) => {
  const userId = parseInt(req.params.userId);
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  sendResponse(res, FavoriteDAO.getUserFavorites(userId));
});

// Add a restaurant to favorites
apiRouter.post('/favorites', (req, res) => {
  const userId = req.user.id; 
  const restaurantId = parseInt(req.body.restaurantId);
  if (!restaurantId) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }
  sendResponse(res, FavoriteDAO.addFavorite(userId, restaurantId));
});

// Remove a restaurant from favorites
apiRouter.delete('/favorites/:favoriteId', (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  if (!favoriteId) {
    return res.status(400).json({ error: 'Invalid favorite ID' });
  }
  FavoriteDAO.deleteFavorite(favoriteId)
        .then(() => res.status(204).end()) // Send 204 No Content response
        .catch(error => {
            console.error('Error deleting favorite:', error);
            res.status(500).json({ error: 'Failed to delete favorite' });
        });
});

// Adding restaurant to favorites through search
apiRouter.post('/favorites/add', async (req, res) => {
  const { name, cuisine, website } = req.body;
  try {
      // Check if the restaurant exists
      let restaurant = await RestaurantDAO.findByName(name);
      if (!restaurant) {
          // If not, add the restaurant
          restaurant = await RestaurantDAO.createRestaurant({
              restaurant_name: name,
              restaurant_cuisine: cuisine,
              restaurant_website: website
          });
      }
      // Add to favorites
      let addedRestaurant = await RestaurantDAO.findByName(name);
      const favorite = await FavoriteDAO.addFavorite(req.user.id, addedRestaurant.restaurant_id); 
      res.json({ success: true, favorite });
  } catch (error) {
      console.error("Failed to add to favorites:", error);
      res.status(500).json({ success: false, message: "Failed to add to favorites" });
  }
});

module.exports = apiRouter;
