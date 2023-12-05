const express = require("express");

const session = require("express-session");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'Xr!af03SNk@cD@nu',
    resave: false,
    saveUninitialized: true,
}))
app.set("views", path.join(__dirname, "public/pages"));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || 'localhost',
        user: process.env.RDS_USERNAME || 'postgres',
        password: process.env.RDS_PASSWORD || 'thuet12345',
        database: process.env.RDS_DB_NAME || 'users',
        port: process.env.RDS_PORTv|| 5432,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    }
});

//TODO: Add a route to display data and accept data to add to the database



app.get("/signup", (req, res) => {
    res.render(__dirname + "/public/pages/signup.ejs", {message: ""});
});

app.get("/login", (req, res) => {
    res.render(__dirname + "/public/pages/login", {message: ""});
});

app.get("/loggedintest", (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + "/public/pages/loggedintest.html");
    } else {
        res.render(__dirname + "/public/pages/login", {message: "Please login to view this page."});
    }
});

app.get('/admintest', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.sendFile(__dirname + "/public/pages/admintest.html");
        } else {
            res.sendFile(__dirname + "/public/pages/notAuthorized.html");
        }
    } else {
        res.render(__dirname + "/public/pages/login", {message: "Please login to view this page."});
    }
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    knex.select().from("users").where("username", username).then(user => {
        if (user.length > 0) {
            if (user[0].password === password) {
                req.session.user = {
                    username: username,
                    role: user[0].role
                }
                res.sendFile(__dirname + "/public/pages/home.html");
            } else {
                // If password is incorrect, display error message in login.ejs
                res.render( __dirname + "/public/pages/login", {message: 'Incorrect username or password.'});
            }
        } else {
            // If username doesn't exist, display error message in login.ejs
            res.render(__dirname + "/public/pages/login", {message: 'Incorrect username or password.'});
        }
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", (req, res) => {
    let firstname = req.body.user_first_name;
    let lastname = req.body.user_last_name;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.user_email;

    knex("users").select().where("username", username).then(user => {
        if (user.length > 0) {
            // If username already exists, display error message in signup.ejs
            res.render(__dirname + "/public/pages/signup", {message: 'Username already exists.'});
        }
        else if(firstname === "" || lastname === "" || username === "" || password === "" || email === "") {
            // If any field is empty, display error message in signup.ejs
            res.render(__dirname + "/public/pages/signup", {message: 'Please fill in all fields.'});
        }
        else if (firstname.length > 30 || lastname.length > 30 || username.length > 30 || password.length > 30 || email.length > 30) {
            // If any field is longer than 30 characters, display error message in signup.ejs
            res.render(__dirname + "/public/pages/signup", {message: 'Please make sure all fields are less than 30 characters.'});
        }
        else {
            knex("users").insert({
                first_name: firstname,
                last_name: lastname,
                username: username,
                password: password,
                email: email,
                role: "user"
            }).then(user => {
                res.sendFile(__dirname + "/public/pages/home.html");
            });
        }
    });

})

app.post("/submitSurvey", (req, res) => {
    const surveyData = {
        age: req.body.age,
        gender: req.body.gender,
        relationshipStatus: req.body.relationshipStatus,
        occupationStatus: req.body.occupationStatus,
        affiliatedOrganizations: req.body.affiliatedOrganizations,
        useSocialMedia: req.body.useSocialMedia,
        socialMediaPlatforms: req.body.socialMediaPlatforms,
        timeOnSocialMedia: req.body.timeOnSocialMedia,
        question9: req.body.question9,
        question10: req.body.question10,
        question11: req.body.question11,
        question12: req.body.question12,
        question13: req.body.question13,
        question14: req.body.question14,
        question15: req.body.question15,
        question16: req.body.question16,
        question17: req.body.question17,
        question18: req.body.question18,
        question19: req.body.question19,
        question20: req.body.question20
    };

    // Insert survey data into the database
    knex("survey")
        .insert(surveyData)
        .then(() => {
            res.send("Survey submitted successfully!");
        })
        .catch((error) => {
            console.error("Error submitting survey:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.listen(port, () => console.log("Listening on port: " + port + "."));
