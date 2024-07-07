const express = require('express');
const apiRouter = express.Router();
const auth = require('../middleware/authorize');
const SetDAO = require('../../db/setDAO');

apiRouter.use(auth.TokenMiddleware);

// Helper function to send responses based on the promise result
const handleResponse = (promise, res) => {
  promise
    .then(data => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      console.error("Operation failed:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

// Convert BigInt values to strings for serialization
const bigintSerializer = (key, value) => 
  (typeof value === 'bigint' ? value.toString() : value);

// Get all sets for the currently authenticated user
apiRouter.get('/users/:userId/sets', (req, res) => {
  const userId = parseInt(req.params.userId);
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  handleResponse(SetDAO.getSetsByUserId(userId), res);
});

// Get a specific set by ID
apiRouter.get('/sets/:setId', (req, res) => {
  const setId = parseInt(req.params.setId);
  handleResponse(SetDAO.getSetById(setId), res);
});

// Create a new set
apiRouter.post('/sets', (req, res) => {
  const { setName } = req.body;
  const userId = req.user.id;
  
  if (!setName) {
      return res.status(400).json({ error: 'Set name is required' });
  }

  SetDAO.createSet(userId, setName).then(set => {
      // Use bigintSerializer to serialize the response data
      res.status(201).json(JSON.parse(JSON.stringify(set, bigintSerializer)));
  }).catch(error => {
      console.error('Failed to create set:', error);
      res.status(500).json({ error: 'Internal server error' });
  });
});

// Update an existing set
apiRouter.put('/sets/:setId', (req, res) => {
  const setId = parseInt(req.params.setId);
  const setDetails = req.body;
  handleResponse(SetDAO.updateSet(setId, setDetails), res);
});

// Delete a set
apiRouter.delete('/sets/:setId', (req, res) => {
  const setId = parseInt(req.params.setId, 10);

  SetDAO.deleteSet(setId)
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = apiRouter;
