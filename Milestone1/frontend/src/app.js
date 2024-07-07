const express = require('express');

const router = require('./routes/routes.js');

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 80;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));

const dir = __dirname + '/static/';



app.use(router);


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));