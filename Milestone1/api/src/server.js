const express = require('express');
const apiRouter = require('./routes/routes.js');
const app = express();

const PORT = process.env.PORT ? process.env.PORT : 80;

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req,  res) => {
//   res.json({your_api: 'it works'});
// });

app.use('/', apiRouter);
// app.get('/', (req, res) => {
//     res.send("testing");
// })

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));