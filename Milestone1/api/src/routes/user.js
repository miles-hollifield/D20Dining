const apiRouter = require('express').Router();

const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const userDAO = require('../userDAO.js');


apiRouter.get('/Users', (req, res)=> {
    userDAO.getUsers()
    .then( users => {
        res.send(users);
    }).catch( error => {
        res.status(500).send("users could not be retreived");
        console.log(error);
    });
});

apiRouter.get('/Users/:userId', (req, res)=> {
    let id = req.params.userId;

    userDAO.getUser(id)
    .then( user => {
        res.send(user);
    }).catch( error => {
        res.status(404).send("user could not be found");
        console.log(error);
    });

});

apiRouter.get('/Users/name/:username', (req, res)=> {
    let name = req.params.username;
    console.log(name, userDAO.getUserByUsername(name));


    userDAO.getUserByUsername(name)
    .then( user => {
        res.send(JSON.stringify(user));
    }).catch( error => {
        res.status(404).send("user could not be found");
    });

});

apiRouter.get('/Users/:userId/sets', (req, res)=> {
    let id = req.params.userId;


    userDAO.getUserSets(id)
    .then( userSets => {
        res.send(userSets);
    }).catch( error => {
        res.status(404).send("user's sets could not be retreived");
        console.log(error);
    });
});

apiRouter.get('/Users/:userId/sets/:set', (req, res)=> {
    let id = req.params.userId;
    let setName = req.params.set;

    userDAO.getUserSet(id, setName)
    .then( userSet => {
        res.send(userSet);
    }).catch( error => {
        res.status(404).send("user's set could not be retreived");
        console.log(error);
    });
});



apiRouter.get('/Users/:userId/sets/:set/restaurants', (req, res)=> {
    let id = req.params.userId;
    let setName = req.params.set;

    userDAO.getUserSet(id, setName)
    .then ( userSet => {
        console.log(userSet.restaraunts);
        res.send(JSON.stringify(userSet.restaraunts));
    }).catch( error => {
        res.status(404).send("user's set information could not be retreived");
        console.log(error);
    });
});

apiRouter.get('/Users/:userId/sets/:set', (req, res)=> {
    let id = req.params.userId;
    let setName = req.params.set;

    userDAO.getUserSet(id, setName)
    .then( userSet => {
        res.send(userSet);
    }).catch( error => {
        res.status(404).send("user's set could not be retreived");
        console.log(error);
    });
});


apiRouter.get('/Users/:userId/favorites', (req, res)=> {
    let id = req.params.userId;


    userDAO.getUserFavorite(id)
    .then( favorites => {
        res.send(favorites);
    }).catch( error => {
        res.status(404).send("user's favorites could not be retreived");
        console.log(error);
    });
});




apiRouter.get('/Users/:userId/following', (req, res)=> {
    let id = req.params.userId;


    userDAO.getFollowingIds(id)
    .then( following => {
        res.send(following);
    }).catch( error => {
        res.send("user's followed accounts could not be retreived").status(500);
        console.log(error);
    });
});


apiRouter.get('/Users/:userId/followers', (req, res)=> {
    let id = req.params.userId;


    userDAO.getFollowersIds(id)
    .then( followers => {
        res.send(followers);
    }).catch( error => {
        res.send("user's followers could not be retreived").status(500);
        console.log(error);
    });
});

apiRouter.post('/Users',(req, res) => {

    let userInfo = {};
    userInfo.username = "testUser";
    userInfo.email = "test";
    userInfo.firstName = "test";
    userInfo.lastName = "test";
    userInfo.password = "test";
    userInfo.dateOfBirth = "test";

    userDAO.createUser(userInfo).then( response => {
        res.send("created new user: " + `<pre>${JSON.stringify(response, 2)}</pre>` + "now try and recreate that user, it will not let you because the sample data has the same usernames. Usernames must be unique.");
    }).catch(error => {
        res.send("There was a problem: " + error);
    });
});


//TODO
apiRouter.post('/Users/:userId/sets', (req, res) => {
    const userId = req.params.userId;
    const setName = req.body.setName;

    userDAO.createUserSet(userId, setName)
    .then(set => {
        res.status(201).send(set);
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("There was a problem creating the user's set.");
    });
});

//TODO
apiRouter.post('/Users/:userId/sets/:setName/restaurants', (req, res) => {
    const userId = req.params.userId;
    const setName = req.params.setName;
    const restaurantDetails = req.body;

    userDAO.addRestaurantToUserSet(userId, setName, restaurantDetails)
    .then(result => {
        res.send(result);
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("There was a problem adding the restaurant to the user's set.");
    });
});



module.exports = apiRouter;