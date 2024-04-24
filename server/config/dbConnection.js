const mysql = require('mysql');
const colors = require('colors');


// create connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


// Connect
db.connect((err) => {
    if(err)
    {
        throw err;
    }
    console.log('MySql Connected...'.green.bold);
        
});

module.exports = db;