const router = require('express').Router();
let path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const dir = path.join(__dirname, '..', 'templates');

router.get('/', (req, res) => {
    res.sendFile(path.resolve('src/templates/login.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.resolve('src/templates/login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.resolve('src/templates/signup.html'));
});

router.get('/home', (req, res) => {
    res.sendFile(path.resolve('src/templates/home.html'));
});



//will need to add authentication

router.get('/search', (req, res) => {
    res.sendFile(path.resolve('src/templates/search.html'));
});

router.get('/sets', (req, res) => {
    res.sendFile(path.resolve('src/templates/sets.html'))
});

router.get('/favorites', (req, res) => {
    res.sendFile(path.resolve('src/templates/favorites.html'))
});

router.get('/profile', (req, res) => {
    res.sendFile(path.resolve('src/templates/profile.html'))
});


module.exports = router;

