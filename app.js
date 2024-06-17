// Requirements //
require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session middleware //
app.use(sessions({
    secret: "learninglibrary",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));


// Setting EJS as templating, joining in my views directory and using my CSS //
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));


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
db.connect((err) => {
    if (err) return console.log(err.message);
    console.log("connected to local mysql db using .env properties");
});

// Index route //

app.get("/", (req, res) => {
    res.render("index")
});

// Sign in route //

app.get("/signin", (req, res) => {
    res.render("signin")
});

// Sign in failure route //

app.get("/signinfailure", (req, res) => {
    res.render("signinfailure")
});

// Sign in function //

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Checking that the user has completed the form //
    if (!username || !password) {
        return res.status(400).send('All fields must be filled in.')
    }

    // Checking the username and password against database //
    db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
        if (error) {
            console.error('Error logging you in:', error);
            return res.status(500).send('Error logging you in, try again.');
        } 

        // If the account exists //
        if (results.length > 0) {
            console.log('Log in successful', results);

            // Redirected to landing page //
            res.redirect('/landing');

        } else {
            console.error('Error logging you in.')
            res.redirect('/signinfailure');
        }
    });
});

// Browsing route // 

app.get("/browsing", (req, res) => {
    res.render("browsing")
});

// Landing page route //

app.get("/landing", (req, res) => {
    res.render("landing")
});

// Register route //

app.get("/register", (req, res) => {
    res.render("register")
});

// Registering function //

app.post("/register", (req, res) => {
    const forename = req.body.forename;
    const surname = req.body.surname;
    const username = req.body.username;
    const password = req.body.password;

    // Checking that the user has completed the form //
    if (!forename || !surname || !username || !password) {
        return res.status(400).send('All fields must be filled in.');
    }

    // Adding new user's information into database //
    db.query(
        'INSERT INTO user (forename, surname, username, password) VALUES (?, ?, ?, ?)',
        [forename, surname, username, password],
        (error, results) => {
            if (error) {
                console.error('Error creating your account:', error);
                return res.status(500).send('Error creating your account, try again.');
            }

            // User registered //
            console.log('Registration successful', results);

            // When an account is created, redirected to sign in page //
            res.redirect('/signin');
        }
    );
});

// View learnlists route //

app.get("/viewlearnlists", (req, res) => {
    res.render("viewlearnlists")
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});