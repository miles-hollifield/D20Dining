const express = require('express');
const apiRouter = require('./routes/routes.js');
const app = express();
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT ? process.env.PORT : 80;

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); 

app.use(apiRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));