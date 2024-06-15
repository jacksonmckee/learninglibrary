require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require('mysql2');

const PORT = process.env.PORT || 4000;
app.set('view engine', 'ejs');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:10,
    port: process.env.DB_PORT,
    multipleStatements: true
});

connection.getConnection((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db using .env properties");
});

// All data on all resources //

app.get('/api-allresources', (req, res)=> { 

    let allresources = `SELECT *
                       FROM resource`;
    connection.query(allresources, (err, data) => {  
        if(err) throw err;
        res.json({data});
    });

});

// All video resources //

app.get('/api-allvideos', (req, res) => {

    let allvideos = `SELECT *
                    FROM resource
                    WHERE media_id = 1`;
    connection.query(allvideos, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All webpage resources //

app.get('/api-allwebpages', (req, res) => {

    let allwebpages = `SELECT *
                    FROM resource
                    WHERE media_id = 2`;
    connection.query(allwebpages, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });
    
});

// All online course resources //

app.get('/api-allonlinecourses', (req, res) => {

    let allonlinecourses = `SELECT *
                    FROM resource
                    WHERE media_id = 3`;
    connection.query(allonlinecourses, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });
    
});

// All books resources //

app.get('/api-allbooks', (req, res) => {

    let allbooks = `SELECT *
                    FROM resource
                    WHERE media_id = 4`;
    connection.query(allbooks, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });
    
});

// All podcast resources //

app.get('/api-allpodcasts', (req, res) => {

    let allpodcasts = `SELECT *
                    FROM resource
                    WHERE media_id = 5`;
    connection.query(allpodcasts, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });
    
});

const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});
