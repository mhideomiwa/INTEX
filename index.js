const express = require("express");

const session = require("express-session");

let app = express();

const bcrypt = require("bcrypt");

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

app.use(express.urlencoded({extended : true}));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || 'localhost',
        user: process.env.RDS_USERNAME || 'postgres',
        password: process.env.RDS_PASSWORD || 'C1$$&!Xi46RRu0HS',
        database: process.env.RDS_DB_NAME || 'users',
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    }
});

//TODO: Add a route to display data and accept data to add to the database
//TODO: Clean this up Miwa



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
                res.render(__dirname + "/public/pages/login", { message: 'Incorrect username or password.' });
            }
        } else {
            // If username doesn't exist, display error message in login.ejs
            res.render(__dirname + "/public/pages/login", { message: 'Incorrect username or password.' });
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

app.post('/submitSurvey', (req, res) => {
    let age = req.body.age;
    let gender = req.body.gender;
    let relationshipStatus = req.body.relationshipStatus;
    let occupationStatus = req.body.occupationStatus;
    let affiliatedOrganizations = req.body.affiliatedOrganizations;
    let useSocialMedia = req.body.useSocialMedia;
    let socialMediaPlatforms = req.body.socialMediaPlatforms;
    let timeOnSocialMedia = req.body.timeOnSocialMedia;
    let question9 = req.body.question9;
    let question10 = req.body.question10;
    let question11 = req.body.question11;
    let question12 = req.body.question12;
    let question13 = req.body.question13;
    let question14 = req.body.question14;
    let question15 = req.body.question15;
    let question16 = req.body.question16;
    let question17 = req.body.question17;
    let question18 = req.body.question18;
    let question19 = req.body.question19;
    let question20 = req.body.question20;
    let surveytime = new Date()


    knex("survey").insert({
        survey_time: surveytime,
        age: age,
        gender_id: gender,
        relationship_id: relationshipStatus,
        occupation_id: occupationStatus,
        use_social_media: useSocialMedia,
        time_id: timeOnSocialMedia,
        no_specific_purpose: question9,
        distracted_by_social_media: question10,
        restless_without_social_media: question11,
        easily_distracted: question12,
        bothered_by_worries: question13,
        concentration_difficulty: question14,
        compare_with_successful_people: question15,
        feel_about_comparisons: question16,
        validation_from_social_media: question17,
        depressed_or_down: question18,
        interest_fluctuation: question19,
        sleep_issues: question20,
        origin: 'Provo'
    }).then(recordNumber => {
        knex.select("survey_id").from("survey").where("survey_time", surveytime).andWhere("age", age).andWhere("gender_id", gender).andWhere("relationship_id", relationshipStatus).then(surveyData => {
                if (surveyData.length > 0) {
                    const surveyId = surveyData[0].survey_id;

                    for (let i = 0; i < socialMediaPlatforms.length; i++) {
                        knex("individual_platforms").insert({
                            survey_id: surveyId,
                            platform_id: socialMediaPlatforms[i],
                            platform_number: i+1

                        }).then(surveySocialMedia => {
                            console.log("Survey Social Media Inserted");
                        });
                    }
                    for (let i = 0; i < affiliatedOrganizations.length; i++) {
                        knex("individual_organizations").insert({
                            survey_id: surveyId,
                            organization_id: affiliatedOrganizations[i],
                            organization_number: i+1
                        }).then(surveyOrganizations => {
                            console.log("Survey Organizations Inserted");
                        });
                    }

                    res.redirect("/");
                }
        })
    });
});


app.listen(port, () => console.log("Listening on port: " + port + "."));
