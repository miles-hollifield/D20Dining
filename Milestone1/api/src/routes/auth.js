const Router = require('express').Router();
const path = require('path');
const multer = require('multer');

const userAPI = require('./user.js');

const upload = multer();



Router.post('/login', upload.none(), (req, res) => {
    res.redirect('/home');


    // const enteredUsername = req.body.username;
    
    // //validate user
    // fetch(`/Users/name/${encodeURIComponent(enteredUsername)}`).then(resp => { 
    //     if(!resp.ok) {
    //         throw new Error("Username does not exist, please try again or try creating an account." + JSON.stringify(resp));
    //     }
    //     console.log("logged in to: " + enteredUsername);

        
    //     return resp.json();
    //  }).then( user => {
    //     res.redirect('/home');
    //  })
    // .catch(err => {
    //     res.send("Username does not exist, please try again or try creating an account.");
    // })
    
});


Router.post('/createAccount', (req, res) => {
    let userInfo = {};
    userInfo.username = "testUser";
    userInfo.email = "test";
    userInfo.firstName = "test";
    userInfo.lastName = "test";
    userInfo.password = "test";
    userInfo.dateOfBirth = "test";

    res.redirect('/login');

    // fetch('http://localhost/api/Users/', {
    //     method: "POST",
    //     body: userInfo
    // })
    // .then(resp => {
    //     console.log(resp.json());
    //     if(resp.ok) {
    //         res.redirect('/login');
    //     } else {
    //         res.send("error"); //send to error page
    //     }
    // })
})

module.exports = Router;