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

// All react videos //

app.get('/api-allreactvideos', (req, res) => {

    let allreactvideos = `SELECT *
                    FROM resource
                    WHERE media_id = 1 AND topic_id = 1`;

    connection.query(allreactvideos, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All react webpages //

app.get('/api-allreactwebpages', (req, res) => {

    let allreactwebpages = `SELECT *
                    FROM resource
                    WHERE media_id = 2 AND topic_id = 1`;

    connection.query(allreactwebpages, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All react online courses //

app.get('/api-allreactcourses', (req, res) => {

    let allreactcourses = `SELECT *
                    FROM resource
                    WHERE media_id = 3 AND topic_id = 1`;

    connection.query(allreactcourses, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All react books //

app.get('/api-allreactbooks', (req, res) => {

    let allreactbooks = `SELECT *
                    FROM resource
                    WHERE media_id = 4 AND topic_id = 1`;

    connection.query(allreactbooks, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All react podcasts //

app.get('/api-allreactpodcasts', (req, res) => {

    let allreactpodcasts = `SELECT *
                    FROM resource
                    WHERE media_id = 5 AND topic_id = 1`;

    connection.query(allreactpodcasts, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All html videos //

app.get('/api-allhtmlvideos', (req, res) => {

    let allhtmlvideos = `SELECT *
                    FROM resource
                    WHERE media_id = 1 AND topic_id = 2`;

    connection.query(allhtmlvideos, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All html webpages //

app.get('/api-allhtmlwebpages', (req, res) => {

    let allhtmlwebpages = `SELECT *
                    FROM resource
                    WHERE media_id = 2 AND topic_id = 2`;

    connection.query(allhtmlwebpages, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All html courses //

app.get('/api-allhtmlcourses', (req, res) => {

    let allhtmlcourses = `SELECT *
                    FROM resource
                    WHERE media_id = 3 AND topic_id = 2`;

    connection.query(allhtmlcourses, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All html books //

app.get('/api-allhtmlbooks', (req, res) => {

    let allhtmlbooks = `SELECT *
                    FROM resource
                    WHERE media_id = 4 AND topic_id = 2`;

    connection.query(allhtmlbooks, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All html podcasts //

app.get('/api-allhtmlpodcasts', (req, res) => {

    let allhtmlpodcasts = `SELECT *
                    FROM resource
                    WHERE media_id = 5 AND topic_id = 2`;

    connection.query(allhtmlpodcasts, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All gardening videos //

app.get('/api-allgardeningvideos', (req, res) => {

    let allgardeningvideos = `SELECT *
                    FROM resource
                    WHERE media_id = 1 AND topic_id = 3`;

    connection.query(allgardeningvideos, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All gardening webpages //

app.get('/api-allgardeningwebpages', (req, res) => {

    let allgardeningwebpages = `SELECT *
                    FROM resource
                    WHERE media_id = 2 AND topic_id = 3`;

    connection.query(allgardeningwebpages, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All gardening courses //

app.get('/api-allgardeningcourses', (req, res) => {

    let allgardeningcourses = `SELECT *
                    FROM resource
                    WHERE media_id = 3 AND topic_id = 3`;

    connection.query(allgardeningcourses, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All gardening books (there is 0) //

app.get('/api-allgardeningbooks', (req, res) => {

    let allgardeningbooks = `SELECT *
                    FROM resource
                    WHERE media_id = 4 AND topic_id = 3`;

    connection.query(allgardeningbooks, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All gardening podcasts //

app.get('/api-allgardeningpodcasts', (req, res) => {

    let allgardeningpodcasts = `SELECT *
                    FROM resource
                    WHERE media_id = 5 AND topic_id = 3`;

    connection.query(allgardeningpodcasts, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All spanish videos (there is 0) //

app.get('/api-allspanishvideos', (req, res) => {

    let allspanishvideos = `SELECT *
                    FROM resource
                    WHERE media_id = 1 AND topic_id = 4`;

    connection.query(allspanishvideos, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All spanish webpages //

app.get('/api-allspanishwebpages', (req, res) => {

    let allspanishwebpages = `SELECT *
                    FROM resource
                    WHERE media_id = 2 AND topic_id = 4`;

    connection.query(allspanishwebpages, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All spanish courses //

app.get('/api-allspanishcourses', (req, res) => {

    let allspanishcourses = `SELECT *
                    FROM resource
                    WHERE media_id = 3 AND topic_id = 4`;

    connection.query(allspanishcourses, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All spanish books //

app.get('/api-allspanishbooks', (req, res) => {

    let allspanishbooks = `SELECT *
                    FROM resource
                    WHERE media_id = 4 AND topic_id = 4`;

    connection.query(allspanishbooks, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All spanish podcasts //

app.get('/api-allspanishpodcasts', (req, res) => {

    let allspanishpodcasts = `SELECT *
                    FROM resource
                    WHERE media_id = 5 AND topic_id = 4`;

    connection.query(allspanishpodcasts, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All plumbing videos //

app.get('/api-allplumbingvideos', (req, res) => {

    let allplumbingvideos = `SELECT *
                    FROM resource
                    WHERE media_id = 1 AND topic_id = 5`;

    connection.query(allplumbingvideos, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All plumbing webpages //

app.get('/api-allplumbingwebpages', (req, res) => {

    let allplumbingwebpages = `SELECT *
                    FROM resource
                    WHERE media_id = 2 AND topic_id = 5`;

    connection.query(allplumbingwebpages, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All plumbing courses //

app.get('/api-allplumbingcourses', (req, res) => {

    let allplumbingcourses = `SELECT *
                    FROM resource
                    WHERE media_id = 3 AND topic_id = 5`;

    connection.query(allplumbingcourses, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All plumbing books //

app.get('/api-allplumbingbooks', (req, res) => {

    let allplumbingbooks = `SELECT *
                    FROM resource
                    WHERE media_id = 4 AND topic_id = 5`;

    connection.query(allplumbingbooks, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

// All plumbing podcasts (there are 0) //

app.get('/api-allplumbingpodcasts', (req, res) => {

    let allplumbingpodcasts = `SELECT *
                    FROM resource
                    WHERE media_id = 5 AND topic_id = 5`;

    connection.query(allplumbingpodcasts, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});