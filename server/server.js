const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const colors = require('colors');

// const db = require('./config/dbConnection');


const app = express();

const port = 4000;




app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));
app.use('/images',express.static('images'));


app.use('/server', require('./routes/appRoutes'));
 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });



app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});
