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

// Login endpoint
apiRouter.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Attempting to log in with username: ${username}`);

    userDAO.getUserByCredentials(username, password)
        .then(user => {
            const token = auth.generateToken(req, res, user);
            console.log(`Token generated for user: ${username}`);
            res.json({ user: user.toJSON(), token });
        })
        .catch(err => {
            console.error(`Login error for username: ${username}`, err);
            res.status(401).json({ error: 'Invalid username or password' });
        });
});



apiRouter.get('/users', (req, res)=> {
    userDAO.getUsers()
    .then( users => {
        res.send(JSON.stringify(users));
    }).catch( error => {
        res.status(500).send("users could not be retreived");
        console.log(error);
    });
});

apiRouter.get('/users/id/:userId', (req, res)=> {
    let id = req.params.userId;

    userDAO.getUser(id)
    .then( user => {
        res.send(user);
    }).catch( error => {
        res.status(404).send("user could not be found");
        console.log(error);
    });

});

apiRouter.get('/users/name/:username', (req, res)=> {
    let name = req.params.username;
    console.log(name, userDAO.getUserByUsername(name));


    userDAO.getUserByUsername(name)
    .then( user => {
        res.send(JSON.stringify(user));
    }).catch( error => {
        res.status(404).send("user could not be found");
    });

});

// Get all sets for a specific user
apiRouter.get('/users/:userId/sets', auth.TokenMiddleware, async (req, res) => {
    const userId = req.params.userId;
    try {
        const userSets = await setDAO.getSetsByUserId(userId);
        res.json(userSets);
    } catch (error) {
        console.error(`Error fetching sets for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve sets' });
    }
});

apiRouter.get('/users/:userId/sets/:set', (req, res)=> {
    let id = req.params.userId;
    let setName = req.params.set;

    userDAO.getuserset(id, setName)
    .then( userset => {
        res.send(userset);
    }).catch( error => {
        res.status(404).send("user's set could not be retreived");
        console.log(error);
    });
});



apiRouter.get('/users/:userId/sets/:set/restaurants', (req, res)=> {
    let id = req.params.userId;
    let setName = req.params.set;

    userDAO.getuserset(id, setName)
    .then ( userset => {
        console.log(userset.restaraunts);
        res.send(JSON.stringify(userset.restaraunts));
    }).catch( error => {
        res.status(404).send("user's set information could not be retreived");
        console.log(error);
    });
});

apiRouter.get('/users/:userId/sets/:set', (req, res)=> {
    let id = req.params.userId;
    let setName = req.params.set;

    userDAO.getuserset(id, setName)
    .then( userset => {
        res.send(userset);
    }).catch( error => {
        res.status(404).send("user's set could not be retreived");
        console.log(error);
    });
});


// Get all favorites for a specific user
apiRouter.get('/users/:userId/favorites', auth.TokenMiddleware, async (req, res) => {
    const userId = req.params.userId;

    if (req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const userFavorites = await favoritesDAO.getUserFavorites(userId);
        res.json(userFavorites);
    } catch (error) {
        console.error(`Error fetching favorites for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve favorites' });
    }
});




apiRouter.get('/users/:userId/following', (req, res)=> {
    let id = req.params.userId;


    userDAO.getFollowingIds(id)
    .then( following => {
        res.send(following);
    }).catch( error => {
        res.send("user's followed accounts could not be retreived").status(500);
        console.log(error);
    });
});


apiRouter.get('/users/:userId/followers', (req, res)=> {
    let id = req.params.userId;


    userDAO.getFollowersIds(id)
    .then( followers => {
        res.send(followers);
    }).catch( error => {
        res.send("user's followers could not be retreived").status(500);
        console.log(error);
    });
});

apiRouter.post('/users', upload.none(), async (req, res) => {
    let userInfo = {};
    console.log(req.body);
    if (req.body.username && req.body.password && req.body.email && req.body.firstname && req.body.lastname) {
        userInfo.username = req.body.username;
        userInfo.email = req.body.email;
        userInfo.firstname = req.body.firstname;
        userInfo.lastname = req.body.lastname;
        userInfo.salt = auth.createSalt();
        
        try {
            userInfo.password = await auth.hashPassword(req.body.password, userInfo.salt);
            let response = await userDAO.createUser(userInfo);
            response = JSON.parse(JSON.stringify(response, (key, value) => 
                typeof value === 'bigint' ? value.toString() : value // Convert BigInt to String for serialization
            ));
            res.json(response);
        } catch (error) {
            console.error("There was a problem creating the user:", error);
            res.status(500).send("There was a problem: " + error.message);
        }
    } else {
        res.status(400).send("Missing required fields");
    }
});




//TODO
apiRouter.post('/users/:userId/sets', (req, res) => {
    const userId = req.params.userId;
    const setName = req.body.setName;

    userDAO.createuserset(userId, setName)
    .then(set => {
        res.status(201).send(set);
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("There was a problem creating the user's set.");
    });
});

//TODO
apiRouter.post('/users/:userId/sets/:setName/restaurants', (req, res) => {
    const userId = req.params.userId;
    const setName = req.params.setName;
    const restaurantDetails = req.body;

    userDAO.addRestaurantTouserset(userId, setName, restaurantDetails)
    .then(result => {
        res.send(result);
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("There was a problem adding the restaurant to the user's set.");
    });
});



module.exports = apiRouter;