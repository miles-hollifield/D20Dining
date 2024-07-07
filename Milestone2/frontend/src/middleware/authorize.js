const jwt = require('jsonwebtoken');

const path = require('path');
const envPath = path.join(__dirname, '../../.env');
console.log("path", envPath);
require('dotenv').config();

const TOKEN_COOKIE_NAME = "D20DiningAuthorization";

const API_SECRET = 'D20DiningSecretKey';//process.env.API_SECRET_KEY;
const API_SECRET1 = process.env.API_SECRET_KEY;
console.log(API_SECRET1);    

exports.TokenMiddleware = (req, res, next) => {
    // We will look for the token in two places:
    // 1. A cookie in case of a browser
    // 2. The Authorization header in case of a different client
    let token = null;
    if(!req.cookies[TOKEN_COOKIE_NAME]) {
      //No cookie, so let's check Authorization header
      const authHeader = req.get('Authorization');
      if(authHeader && authHeader.startsWith("Bearer ")) {
        //Format should be "Bearer token" but we only need the token
        token = authHeader.split(" ")[1].trim();
      }
    }
    else { //We do have a cookie with a token
      token = req.cookies[TOKEN_COOKIE_NAME]; //Get session Id from cookie
    }
  
    if(!token) { // If we don't have a token
    //   res.status(401).json({error: 'Not authenticated'});
        res.redirect('/');
      return;
    }
  
    //If we've made it this far, we have a token. We need to validate it
  
    try {
      const decoded = jwt.verify(token, API_SECRET);
      req.user = decoded.user;
      next(); //Make sure we call the next middleware
    }
    catch(err) { //Token is invalid
    //   res.status(401).json({error: 'Not authenticated'});
      res.redirect('/');
      return;
    }
  }

exports.checkAuthorized = (req, res, next) => {
    if(req.cookies[TOKEN_COOKIE_NAME] && jwt.verify(req.cookies[TOKEN_COOKIE_NAME], API_SECRET)) {
        res.redirect('./home')
    } else {
        next();
    }
}

