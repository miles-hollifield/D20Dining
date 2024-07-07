const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require(path.join(__dirname, '../middleware/authorize'));
const userDAO = require(path.join(__dirname, '../../db/userDAO'));
const setDAO = require(path.join(__dirname, '../../db/setDAO'));
const favoritesDAO = require(path.join(__dirname, '../../db/favoritesDAO'));

const apiRouter = express.Router();
const upload = multer();

apiRouter.use(express.json());
apiRouter.use(upload.none());

// Handle response uniformly
function handleResponse(promise, res) {
    promise.then(data => {
        // Convert BigInt values to strings
        const jsonData = JSON.stringify(data, (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });

        res.json(JSON.parse(jsonData));
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: err.toString() });
    });
}

// Login endpoint
apiRouter.post('/users/login', upload.none(), (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    userDAO.getUserByCredentials(username, password)
        .then(user => {
            const token = auth.generateToken(req, res, user);
            res.json({ user: user.toJSON(), token });
        })
        .catch(err => {
            console.error(`Login error for username: ${username}`, err);
            res.status(401).json({ error: 'Invalid username or password' });
        });
});


// Retrieve all users
apiRouter.get('/users', (req, res) => {
    handleResponse(userDAO.getUsers(), res);
});

// Retrieve a user by ID
apiRouter.get('/users/id/:userId', (req, res) => {
    handleResponse(userDAO.getUser(req.params.userId), res);
});

// Retrieve a user by username
apiRouter.get('/users/name/:username', (req, res) => {
    handleResponse(userDAO.getUserByUsername(req.params.username), res);
});

// Get all sets for a specific user
apiRouter.get('/users/:userId/sets', auth.TokenMiddleware, (req, res) => {
    if (req.user.id !== parseInt(req.params.userId, 10)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    handleResponse(setDAO.getSetsByUserId(req.params.userId), res);
});

// Get all favorites for a specific user
apiRouter.get('/users/:userId/favorites', auth.TokenMiddleware, (req, res) => {
    if (req.user.id !== parseInt(req.params.userId, 10)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    handleResponse(favoritesDAO.getUserFavorites(req.params.userId), res);
});

// Create a new user
apiRouter.post('/users', upload.none(), (req, res) => {
    const { username, password, email, firstname, lastname } = req.body;
    if (!username || !password || !email || !firstname || !lastname) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    let saltVal = auth.createSalt();

    auth.hashPassword(password, saltVal).then( newPassword => {
        let userInfo = {
            username,
            email,
            firstname,
            lastname,
            salt: saltVal,
            password: newPassword
        };
        console.log(userInfo);
        handleResponse(userDAO.createUser(userInfo), res);
    })
});

// Update user profile information
apiRouter.put('/users/current', auth.TokenMiddleware, (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { firstname, lastname, username, email, avatar } = req.body;
    if (!firstname || !lastname || !username || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userInfo = { firstname, lastname, username, email, avatar };
    userDAO.updateUser(req.user.id, userInfo)
        .then(updatedUser => {
            auth.generateToken(req, res, updatedUser); // Generate new token with updated data
            res.json({ user: updatedUser });
        })
        .catch(error => {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// Get user profile picture
apiRouter.get('/users/:userId/profile-picture', auth.TokenMiddleware, (req, res) => {
    let id = parseInt(req.params.userId, 10);
    if (req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    handleResponse(userDAO.getUserProfilePicture(id), res);
});

// Delete all sets of a user
apiRouter.delete('/users/:userId/sets/all', auth.TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    handleResponse(setDAO.deleteAllSetsAndEntriesByUser(userId), res);
});

// Delete all favorites of a user
apiRouter.delete('/users/:userId/favorites', auth.TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    handleResponse(favoritesDAO.deleteAllFavoritesOfUser(userId), res);
});
module.exports = apiRouter;
