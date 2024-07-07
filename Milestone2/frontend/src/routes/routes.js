const router = require('express').Router();
let path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const dir = path.join(__dirname, '..', 'templates');

const { TokenMiddleware, checkAuthorized } = require(path.join(__dirname, "../middleware/authorize.js"));

router.get('/', checkAuthorized, (req, res) => {
    res.sendFile(path.resolve('src/templates/login.html'));
});

router.get('/login', checkAuthorized, (req, res) => {
    res.sendFile(path.resolve('src/templates/login.html'));
});

router.get('/signup', checkAuthorized, (req, res) => {
    res.sendFile(path.resolve('src/templates/signup.html'));
});

router.get('/home', TokenMiddleware, (req, res) => {
    res.sendFile(path.resolve('src/templates/home.html'));
});



//will need to add authentication

router.get('/search', TokenMiddleware, (req, res) => {
    res.sendFile(path.resolve('src/templates/search.html'));
});

router.get('/sets', TokenMiddleware,(req, res) => {
    res.sendFile(path.resolve('src/templates/sets.html'))
});

router.get('/favorites', TokenMiddleware,(req, res) => {
    res.sendFile(path.resolve('src/templates/favorites.html'))
});

router.get('/profile', TokenMiddleware, (req, res) => {
    res.sendFile(path.resolve('src/templates/profile.html'))
});


module.exports = router;

