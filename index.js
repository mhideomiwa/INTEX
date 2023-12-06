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


//Knex setup
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

const { employeenavbar, guestnavbar, adminnavbar, usernavbar } = require("./public/modules/navbars.js");

//TODO: Add a route to display data and accept data to add to the database
//TODO: Clean this up Miwa


//Baser Route
app.get("/", (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.render(__dirname + "/public/index.ejs", {navbar: adminnavbar});
        }
        else if (req.session.user.role === "employee") {
            res.render(__dirname + "/public/index.ejs", {navbar: employeenavbar});
        }
        else {
            res.render(__dirname + "/public/index.ejs", {navbar: usernavbar});
        }
    } else {
        res.render(__dirname + "/public/index.ejs", {navbar: guestnavbar});
    }
});

//Login/signup routes
app.get("/signup", (req, res) => {
    res.render(__dirname + "/public/pages/signup.ejs", {message: "", navbar: guestnavbar});
});

app.get("/login", (req, res) => {
    res.render(__dirname + "/public/pages/login", {message: "", navbar: guestnavbar});
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
                if (user[0].role === "admin") {
                    res.render(__dirname + "/public/index.ejs", {navbar: adminnavbar});
                }
                else if (user[0].role === "employee") {
                    res.render(__dirname + "/public/index.ejs", {navbar: employeenavbar});
                }
                else {
                    res.render(__dirname + "/public/index.ejs", {navbar: usernavbar});
                }
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
    res.render(__dirname + "/public/index.ejs", {navbar: guestnavbar});
});

//Home routes
app.get("/home", (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.render(__dirname + "/public/index.ejs", {navbar: adminnavbar});
        }
        else if (req.session.user.role === "employee") {
            res.render(__dirname + "/public/index.ejs", {navbar: employeenavbar});
        }
        else {
            res.render(__dirname + "/public/index.ejs", {navbar: usernavbar});
        }
    } else {
        res.render(__dirname + "/public/index.ejs", {navbar: guestnavbar});
    }
})

//Signup post
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
                res.render(__dirname + "/public/pages/login", {message: "Account created successfully. Please login."});
            });
        }
    });

})


//Submit Survey post
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
        origin: from
    }).then(recordNumber => {
        knex.select("survey_id").from("survey").where("survey_time", surveytime).andWhere("age", age).andWhere("gender_id", gender).andWhere("relationship_id", relationshipStatus).then(surveyData => {
                if (surveyData.length > 0) {
                    const surveyId = surveyData[0].survey_id;

                    if(socialMediaPlatforms[0] === '10') {
                        knex("individual_platforms").insert({
                            survey_id: surveyId,
                            platform_id: socialMediaPlatforms[0],
                            platform_number: 0

                        }).then(surveySocialMedia => {
                            console.log("Survey Social Media Inserted");
                        });
                    } else {
                        for (let i = 0; i < socialMediaPlatforms.length; i++) {
                            knex("individual_platforms").insert({
                                survey_id: surveyId,
                                platform_id: socialMediaPlatforms[i],
                                platform_number: i+1

                            }).then(surveySocialMedia => {
                                console.log("Survey Social Media Inserted");
                            });
                        }
                    }


                    if(affiliatedOrganizations[0] === '6') {
                        knex("individual_organizations").insert({
                            survey_id: surveyId,
                            organization_id: affiliatedOrganizations[0],
                            organization_number: 0
                        }).then(surveyOrganizations => {
                            console.log("Survey Organizations Inserted");
                        });
                    } else {
                        for (let i = 0; i < affiliatedOrganizations.length; i++) {
                            knex("individual_organizations").insert({
                                survey_id: surveyId,
                                organization_id: affiliatedOrganizations[i],
                                organization_number: i+1
                            }).then(surveyOrganizations => {
                                console.log("Survey Organizations Inserted");
                            });
                        }
                    }

                    res.redirect("/pages/thankYou.html");
                }
        })
    });
});


//Display Survey Results
app.get("/surveyResults", (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin" || req.session.user.role === 'employee') {
            knex.raw(`
              SELECT
                s.survey_id,
                s.survey_time,
                s.age,
                g.gender_description,
                r.relationship_description,
                o.occupation_description,
                string_agg(org.organization_type, ', ') AS organization_type,
                s.use_social_media,
                string_agg(p.platform_name, ', ') AS platform_name,
                t.time_description,
                s.no_specific_purpose,
                s.distracted_by_social_media,
                s.restless_without_social_media,
                s.easily_distracted,
                s.bothered_by_worries,
                s.concentration_difficulty,
                s.compare_with_successful_people,
                s.feel_about_comparisons,
                s.validation_from_social_media,
                s.depressed_or_down,
                s.interest_fluctuation,
                s.sleep_issues,
                s.origin
                FROM
                survey s
                JOIN gender g ON s.gender_id = g.gender_id
                JOIN relationship_status r ON s.relationship_id = r.relationship_id
                JOIN occupation_status o ON s.occupation_id = o.occupation_id
                LEFT JOIN individual_organizations io ON s.survey_id = io.survey_id
                JOIN organization org ON io.organization_id = org.organization_id
                JOIN time_spent t ON s.time_id = t.time_id
                LEFT JOIN individual_platforms ip ON s.survey_id = ip.survey_id
                JOIN platform p ON ip.platform_id = p.platform_id
                GROUP BY s.survey_id, s.survey_time, s.age, g.gender_description,
                         r.relationship_description, o.occupation_description, s.use_social_media,
                         t.time_description, s.no_specific_purpose, s.distracted_by_social_media,
                         s.restless_without_social_media, s.easily_distracted, s.bothered_by_worries,
                         s.concentration_difficulty, s.compare_with_successful_people, s.feel_about_comparisons,
                         s.validation_from_social_media, s.depressed_or_down, s.interest_fluctuation, s.sleep_issues, s.origin;
            `).then(surveyData => {
                // console.log(surveyData)
                res.render(__dirname + "/public/pages/surveyResults.ejs", {surveyData: surveyData.rows});
            });
        } else {
            res.sendFile(__dirname + "/public/pages/notAuthorized.html");
        }
    } else {
        res.render(__dirname + "/public/pages/login", {message: "Please login to view this page."});
    }
});

//Other page routes with authentication
app.get('/dashboard', (req, res) => {
    if (req.session.user === 'admin') {
        res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: adminnavbar});
    }
    else if (req.session.user === 'employee') {
        res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: employeenavbar});
    }
    else if (req.session.user === 'user'){
        res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: usernavbar});
    }
    else {
        res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: guestnavbar});
    }
})

app.get('/survey', (req, res) => {
    if (req.session.user === 'admin') {
        res.render(__dirname + "/public/pages/survey.ejs", {navbar: adminnavbar});
    }
    else if (req.session.user === 'employee') {
        res.render(__dirname + "/public/pages/survey.ejs", {navbar: employeenavbar});
    }
    else if (req.session.user === 'user') {
        res.render(__dirname + "/public/pages/survey.ejs", {navbar: usernavbar});
    }
    else {
        res.render(__dirname + "/public/pages/survey.ejs", {navbar: guestnavbar});
    }
});


app.get('/resources', (req, res) => {
    if (req.session.user === 'admin') {
        res.render(__dirname + "/public/pages/resources.ejs", {navbar: adminnavbar});
    }
    else if (req.session.user === 'employee') {
        res.render(__dirname + "/public/pages/resources.ejs", {navbar: employeenavbar});
    }
    else if (req.session.user === 'user') {
        res.render(__dirname + "/public/pages/resources.ejs", {navbar: usernavbar});
    }
    else {
        res.render(__dirname + "/public/pages/resources.ejs", {navbar: guestnavbar});
    }
});



app.listen(port, () => console.log("Listening on port: " + port + "."));
