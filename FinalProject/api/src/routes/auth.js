const express = require('express');
const path = require('path');
const multer = require('multer');

const UserDAO = require(path.join(__dirname, '../../db/userDAO.js'));
const auth = require(path.join(__dirname, '../middleware/authorize.js'));

const authRouter = express.Router();
const upload = multer();

// Handles user login
authRouter.post('/users/login', upload.none(), async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    try {
        const user = await UserDAO.getUserByCredentials(username, password);
        const token = auth.generateToken(req, res, user);
        console.log(user, "user received")
        res.json({ user: user.toJSON(), token });
    } catch (err) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Handles user account creation
authRouter.post('/users/createAccount', async (req, res) => {
    const { username, password, first_name, last_name, email } = req.body;
    if (!username || !password || !first_name || !last_name || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await UserDAO.getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const user = { first_name, last_name, username, email };
        const createdUser = await UserDAO.createUser(user);
        res.redirect('/home');
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Retrieves the currently logged-in user
authRouter.get('/users/current', auth.TokenMiddleware, (req, res) => {
    res.json(req.user);
});

authRouter.get('/users/logout', (req, res) => {
    auth.removeToken(req, res);
    res.redirect('/login');
})

module.exports = authRouter;
