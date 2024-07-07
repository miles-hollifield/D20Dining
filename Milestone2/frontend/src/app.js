const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/routes.js');

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 80;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
const dir = __dirname + '/static/';

app.use(router);


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));