const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const TOKEN_COOKIE_NAME = "D20DiningAuthorization";

const SESSION_DURATION_MINUTES = 60;

const API_SECRET = process.env.API_SECRET_KEY;


const TokenMiddleware = (req, res, next) => {
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
    res.status(401).json({error: 'Not authenticated'});
    return;
  }

  //If we've made it this far, we have a token. We need to validate it

  try {
    const decoded = jwt.verify(token, API_SECRET);
    req.user = decoded.user;
    next(); //Make sure we call the next middleware
  }
  catch(err) { //Token is invalid
    res.status(401).json({error: 'Not authenticated'});
    return;
  }
}


const generateToken = (req, res, user) => {
  let data = {
    user: user,
    // Use the exp registered claim to expire token in 1 hour
    exp: Math.floor(Date.now() / 1000) + (60 * SESSION_DURATION_MINUTES)
  }

  const token = jwt.sign(data, API_SECRET);

  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_DURATION_MINUTES * 60 * 1000
  });
};

async function hashPassword(string, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(string, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
}

function createSalt() {
    return crypto.randomBytes(32).toString('hex');
}


const removeToken = (req, res) => {

  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000 //A date in the past
  });

}

module.exports = {
    TokenMiddleware,
    createSalt, 
    hashPassword,
    generateToken,
    removeToken
}
