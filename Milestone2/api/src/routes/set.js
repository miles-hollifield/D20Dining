const express = require('express');
const apiRouter = express.Router();
const auth = require('../middleware/authorize'); 
const SetDAO = require('../../db/setDAO');

apiRouter.use(auth.TokenMiddleware);

// Get all sets for the currently authenticated user
apiRouter.get('/users/:userId/sets', async (req, res) => {
  const userId = req.params.userId;

  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const sets = await SetDAO.getSetsByUserId(userId);
    res.json(sets);
  } catch (error) {
    console.error("Failed to fetch sets:", error);
    res.status(500).json({ error: 'Failed to fetch sets' });
  }
});

// Get a specific set by ID
apiRouter.get('/sets/:setId', TokenMiddleware, (req, res) => {
  const setId = req.params.setId;
  SetDAO.getSetById(setId).then(set => {
    if (set) {
      res.json(set);
    } else {
      res.status(404).json({ error: 'Set not found' });
    }
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Create a new set
apiRouter.post('/sets', TokenMiddleware, (req, res) => {
  const newSet = req.body; 
  SetDAO.createSet(newSet).then(set => {
    res.status(201).json(set);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Update an existing set
apiRouter.put('/sets/:setId', TokenMiddleware, (req, res) => {
  const setId = req.params.setId;
  const setDetails = req.body;
  SetDAO.updateSet(setId, setDetails).then(updatedSet => {
    res.json(updatedSet);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Delete a set
apiRouter.delete('/sets/:setId', TokenMiddleware, (req, res) => {
  const setId = req.params.setId;
  SetDAO.deleteSet(setId).then(() => {
    res.status(204).send();
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = apiRouter;
