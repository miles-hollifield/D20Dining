const express = require('express');
const SetEntriesDAO = require('../../db/setEntriesDAO');

const router = express.Router();
const { TokenMiddleware } = require('../middleware/authorize');

router.use(TokenMiddleware);

// Convert BigInt values to strings for serialization
const bigintSerializer = (key, value) => 
  (typeof value === 'bigint' ? value.toString() : value);

// Get restaurants in a set
router.get('/sets/:setId/restaurants', (req, res) => {
  const setId = parseInt(req.params.setId, 10);
  SetEntriesDAO.getRestaurantsInSet(setId)
    .then(restaurants => res.json(restaurants.map(restaurant => JSON.parse(JSON.stringify(restaurant, bigintSerializer)))))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Add a restaurant to a set
router.post('/sets/addRestaurant', (req, res) => {
  const { setId, restaurantId } = req.body;
  SetEntriesDAO.addRestaurantToSet(setId, restaurantId)
    .then(setEntry => res.status(201).json(JSON.parse(JSON.stringify(setEntry, bigintSerializer))))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Remove a restaurant from a set
router.delete('/sets/restaurant/:setEntryId', (req, res) => {
  const setEntryId = parseInt(req.params.setEntryId, 10);

  SetEntriesDAO.removeRestaurantFromSet(setEntryId)
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json({ error: error.message }));
});


module.exports = router;
