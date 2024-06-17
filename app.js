// Requirements //
require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mysql = require('mysql2');

// Setting EJS as templating, joining in my views directory and using my CSS //
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static("public"));


// New port for app.js to run //
const port = process.env.PORT || 3000;

// Database connection //
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Checks if connection has worked //
db.connect( (err)=> {
    if(err) return console.log(err.message);
    console.log("connected to local mysql db using .env properties");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});