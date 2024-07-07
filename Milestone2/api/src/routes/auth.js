const authRouter = require('express').Router();
const path = require('path');
const multer = require('multer');

const UserDAO = require(path.join(__dirname, '../../db/userDAO.js'));

const auth = require(path.join(__dirname, '../middleware/authorize.js'));

const userAPI = require('./user.js');

const upload = multer();



authRouter.post('/users/login', upload.none(), (req, res) => {

    // validate user
    if(req.body.username && req.body.password) {
        UserDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
        let result = {
            user: user.toJSON()
        }
    
        auth.generateToken(req, res, result.user);
        
        res.json(result);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
    else {
        res.status(400).json({error: 'missing field'});
    } 
});


authRouter.post('/users/createAccount', (req, res) => {


    if(req.body.username && req.body.password && req.body.first_name && req.body.last_name && req.body.email) {
        UserDAO.getUserByUsername(req.body.username).then( user => {
            if(user) {
                res.send('username already exists');
            } else {

                //figure out how to create an element in database
                let user = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    email: req.body.email
                }


                let createdUser = UserDAO.createUser(user);

                if(createdUser) {
                    res.redirect('/home');
                } else {
                    res.send('could not create User');
                }

            }
        })
    }
})

authRouter.get('/users/current', auth.TokenMiddleware, (req, res) => {
    console.log(req.user);
    res.send(req.user);
});

module.exports = authRouter;