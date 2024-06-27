// Requirements //
require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


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

const mediaMap = {
    1: 'Video',
    2: 'Webpage',
    3: 'Online Course',
    4: 'Book',
    5: 'Podcast'
};

const topicMap = {
    1: 'REACT.JS',
    2: 'HTML Basics',
    3: 'Gardening',
    4: 'Basic Spanish',
    5: 'Plumbing'
};

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
        return res.status(400).send('All fields must be filled in.');
    }

    // Checking the username and password against database //
    db.query('SELECT * FROM user WHERE username = ?', [username], function (error, results, fields) {
        if (error) {
            console.error('Error logging you in:', error);
            return res.status(500).send('Error logging you in, try again.');
        }

        // If the account exists... //
        if (results.length > 0) {

            // The hashed password is checked against original //
            const hash = results[0].password;
            bcrypt.compare(password, hash, (error, matches) => {
                if (error) {
                    console.error('Error logging you in:', error);
                    return res.status(500).send('Error logging you in, try again.');
                }

                // If it matches... //
                if (matches) {

                    // A session will begin //
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userID = results[0].user_id;

                    console.log('Log in successful', results);

                    // Redirected to landing page //
                    res.redirect('/landing');
                } else {

                    // If it doesn't match...//
                    console.error('Incorrect password, try again.');
                    res.redirect('/signinfailure');
                }
            });
        } else {
            console.error('Username not found in database.');
            res.redirect('/signinfailure');
        }
    });
});

// Function to check if a user has logged in, protects parts of website //

function checkLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        console.error('You must sign in.')
        res.redirect('/signin')
    }
}

// Browsing route // 

app.get("/browsing", (req, res) => {
    const search = req.query.search;
    const mediaType = req.query.mediaType;
    const topic = req.query.topic;
    const sort = req.query.sort;

    let query = 'SELECT * FROM resource WHERE 1=1';

    // Adding the filters from the form //

    if (search) {
        query += ` AND resource_name LIKE '%${search}%'`;
    }

    if (mediaType) {
        query += ` AND media_id = ${mediaType}`;
    }

    if (topic) {
        query += ` AND topic_id = ${topic}`;
    }

    if (sort) {
        if (sort === 'most liked') {
            query += ` ORDER BY resource_likes DESC`;
        } else if (sort === 'a-z') {
            query += ` ORDER BY resource_name ASC`;
        }
    }

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching resources:', err);
            return res.status(500).send('Error fetching resources');
        }
        res.render('browsing', { resourceData: result });
    });
});

// Individual card details route

app.get('/resourcedetails/:resourceId', (req, res) => {
    let resourceId = req.params.resourceId;
    let getresource = `SELECT * FROM resource WHERE resource_id=?`;

    db.query(getresource, [resourceId], (err, data) => {
        if (err) throw err;

        res.render('resourcedetails', { resource: data[0], mediaMap: mediaMap, topicMap: topicMap });
    });
});

// Landing page route //

app.get("/landing", checkLogin, (req, res) => {
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

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error creating your account, try again.');
        }

        // Adding new user's information into database //
        db.query(
            'INSERT INTO user (forename, surname, username, password) VALUES (?, ?, ?, ?)',
            [forename, surname, username, hash],
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
});

// Log out button //

app.get('/logout', (req, res) => {

    req.session.destroy((error) => {
        if (error) {
            console.error('Error logging user out:', error);
        } else {
            console.log('User logged out.');
        }
        res.redirect('/');
    });

});

// View learnlists route //

app.get("/viewlearnlists", (req, res) => {
    const userLearnlist = req.query.userLearnlist;

    const query = `SELECT * 
                    FROM resource 
                    JOIN user_learnlist_list 
                    ON resource.resource_id = user_learnlist_list.resource_id 
                    JOIN user_learnlist 
                    ON user_learnlist_list.learnlist_id = user_learnlist.learnlist_id 
                    WHERE user_learnlist_list.learnlist_id = ?`;

    db.query(query, [userLearnlist], (error, results, fields) => {
        if (error) {
            console.error('Error fetcthing user learnlist:', error);
            return res.status(500).send('Error fetching user learnlist.')
        }
        res.render("viewlearnlists", { resourceData: results });
    });

});

// Delete account function //

app.post('/deleteaccount', (req, res) => {
    const userId = req.session.userID;

    console.log('Deleting user with ID:', userId);

    // Delete user from database //
    const query = `DELETE FROM user WHERE user_id = ?`;
    db.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting user:', error);
            return res.status(500).send('Error deleting user');
        }

        console.log('Account deletion successful', results);

        // Destroy the session //
        req.session.destroy((error) => {
            if (error) {
                console.error('Error destroying session:', error);
            } else {
                res.redirect('/');
            }
        });
    });
});

// Create learnlist route //

app.get("/createlearnlist", checkLogin, (req, res) => {
    res.render("createlearnlist")
});

// Create a learnlist function //

app.post("/createlearnlist", (req, res) => {
    const learnlistName = req.body.learnlistName;
    const learnlistDescription  = req.body.learnlistDescription;

    const userId = req.session.userID;

    // Checking that the user has completed the form //
    if (!learnlistName || !learnlistDescription) {
        return res.status(400).send('All fields must be filled in.');
    }

    // Querying database to see if user has a learnlist //
    db.query(
        'SELECT * FROM user_learnlist  WHERE user_id = ?',
        [userId],
        (error, results) => {
            if (error) {
                console.error('Error checking for learnlist:', error);
                return res.status(500).send('Error checking for learnlist, try again.');
            }

            if (results.length > 0){
                console.log('There is already a learnlist for user', userId);
                return res.status(400).send(`There is already a learnlist for user ${userId}`);
            }

        // Adding new learnlist information into database //
        db.query(
            'INSERT INTO user_learnlist (learnlist_name, learnlist_desc, user_id, learnlist_likes) VALUES (?, ?, ?, NULL)',
            [learnlistName, learnlistDescription, userId],
            (error, results) => {
                if (error) {
                    console.error('Error creating your learnlist:', error);
                    return res.status(500).send('Error creating your learnlist, try again.');
                }

                // Learnlist created //
                console.log('Learnlist created!', results);

                // After learnlist is created, redirected to landing. //
                res.redirect('/landing');
            }
        );
    });
});

// Manage learnlist route //

app.get("/managelearnlist", checkLogin, (req, res) => {
    res.render("managelearnlist")
});

// Delete learnlist function //

app.post('/deletelearnlist', (req, res) => {
    const userId = req.session.userID;

    console.log('Deleting learnlist belonging to user', userId);

    // Delete learnlist from database //
    const query = `DELETE FROM user_learnlist WHERE user_id = ?`;
    db.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting learnlist:', error);
            return res.status(500).send('Error deleting learnlist');
        }

        console.log('Learnlist deletion successful', results);
        res.redirect('/landing');
    });
});

// Change learnlist name route //

app.get("/changelearnlistname", checkLogin, (req, res) => {
    res.render("changelearnlistname")
});

app.post("/newlearnlistname", (req, res) => {
    const newLearnlistName = req.body.newLearnlistName;
    const userId = req.session.userID;

    if (!newLearnlistName){
        return res.status(400).send('You must fill in the form.');
    }

    // Finds the learnlist in the database //

    db.query(
        'SELECT * FROM  user_learnlist WHERE user_id = ?',
        [userId],
        (error, results) => {
            if (error){
                console.error('Error finding learnlist:', error);
                return res.status(500).send('Error finding learnlist, try again.');
            }

            if (results.length === 0){
                console.log('No learnlist found for user', userId);
                return res.status(400).send(`No learnlist found for user ${userId}`);
            }

            // Changing name in database //

            db.query(
                'UPDATE user_learnlist SET learnlist_name = ? WHERE user_id = ?',
                [newLearnlistName, userId], 
                (error, results) => {
                    if (error){
                        console.error('Error chaning learnlist name', error);
                        return res.status(500).send('Error changing learnlist name, try again.');
                    }

                    // Learnlist name changed //
                    console.log('Learnlist name updated!', results);

                    res.redirect('/landing');
                }
            );
        }
    );
});

// Likes route //

app.get("/likes", checkLogin, (req, res) => {
    const userId = req.session.userID;

    const query = `SELECT *
                    FROM user_learnlist 
                    JOIN liked 
                    ON user_learnlist.learnlist_id = liked.learnlist_id 
                    WHERE liked.user_id = ?`;

    db.query(query, [userId], (error, results, fields) => {
        if (error){
            console.error('Error fetching user liked list:', error);
            return res.status(500).send('Error fetching user liked list.')
        }

    if (results.length === 0) {
        console.log('No liked learnlists found for user:', userId);
    }
        res.render("likes", { learnlistData: results } );
    });

});

// Viewing liked learnlists //

app.get("/likedlearnlist/:learnlistId", checkLogin, (req, res) => {
    const learnlistId = req.params.learnlistId;

    const query = `SELECT *
                    FROM resource
                    JOIN user_learnlist_list
                    ON resource.resource_id = user_learnlist_list.resource_id
                    WHERE learnlist_id = ?`;

    db.query(query, [learnlistId], (error, results, fields) => {
        if (error){
            console.error('Error fetching learnlist:', error);
            return res.status(500).send('Error fetching learnlist.')
        }
        res.render("likedlearnlist", { resourceData: results });
    });
});

// Unlike learnlist //

app.post("/unlike/:learnlistId", checkLogin, (req, res) => {
    const userId = req.session.userID;
    const learnlistId = req.params.learnlistId;

    const query = `DELETE FROM liked WHERE user_id = ? AND learnlist_id = ?`;

    db.query(query, [userId, learnlistId], (error, results, fields) => {
        if (error){
            console.error('Error while unliking:', error);
            return res.status(500).send('Error while unliking.')
        }
        res.redirect('/likes')
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});