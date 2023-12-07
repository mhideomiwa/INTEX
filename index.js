const express = require("express");
const session = require("express-session");
const ejs = require('ejs');
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/pages"));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Xr!af03SNk@cD@nu',
    resave: false,
    saveUninitialized: true,
}));


//Knex setup
const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || 'localhost',
        user: process.env.RDS_USERNAME || 'postgres',
        password: process.env.RDS_PASSWORD || 'thuet12345',
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
            const hashedPassword = user[0].password; // Fetch hashed password from the database

            bcrypt.compare(password, hashedPassword, (err, result) => {
                if (err) {
                    // Handle comparison error
                    console.error("Error comparing passwords:", err);
                    res.status(500).send("Internal Server Error");
                } else if (result) {
                    // Passwords match, set session and render appropriate page
                    req.session.user = {
                        username: username,
                        role: user[0].role
                    };
                    if (user[0].role === "admin") {
                        res.render(__dirname + "/public/index.ejs", { navbar: adminnavbar });
                    } else if (user[0].role === "employee") {
                        res.render(__dirname + "/public/index.ejs", { navbar: employeenavbar });
                    } else {
                        res.render(__dirname + "/public/index.ejs", { navbar: usernavbar });
                    }
                } else {
                    // If password is incorrect, display error message in login.ejs
                    res.render(__dirname + "/public/pages/login", { message: 'Incorrect username or password.', navbar: guestnavbar });
                }
            });
        } else {
            // If username doesn't exist, display error message in login.ejs
            res.render(__dirname + "/public/pages/login", { message: 'Incorrect username or password.', navbar: guestnavbar });
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

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            // Handle any error that occurred during hashing
            console.error("Error hashing password:", err);
            res.status(500).send("Internal Server Error");
        } else {
            knex("users").select().where("username", username).then(user => {
                if (user.length > 0) {
                    // If username already exists, display error message in signup.ejs
                    res.render(__dirname + "/public/pages/signup", { message: 'Username already exists.', navbar: guestnavbar});
                } else if (firstname === "" || lastname === "" || username === "" || password === "" || email === "") {
                    // If any field is empty, display error message in signup.ejs
                    res.render(__dirname + "/public/pages/signup", { message: 'Please fill in all fields.' });
                } else if (firstname.length > 30 || lastname.length > 30 || username.length > 30 || password.length > 30 || email.length > 30) {
                    // If any field is longer than 30 characters, display error message in signup.ejs
                    res.render(__dirname + "/public/pages/signup", { message: 'Please make sure all fields are less than 30 characters.', navbar: guestnavbar });
                } else {
                    // Insert the hashed password into the database
                    knex("users").insert({
                        first_name: firstname,
                        last_name: lastname,
                        username: username,
                        password: hash, // Store the hashed password
                        email: email,
                        role: "user"
                    }).then(user => {
                        res.render(__dirname + "/public/pages/login", { message: "Account created successfully. Please login.", navbar: guestnavbar });
                    }).catch(err => {
                        console.error("Error inserting user data:", err);
                        res.status(500).send("Internal Server Error");
                    });
                }
            });
        }
    });
});


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
    let location = req.body.location;


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
        origin: location
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
app.get("/surveyResults", async (req, res) => {
    try {
        if (req.session.user) {
            if (req.session.user.role === "admin" || req.session.user.role === 'employee') {
                const surveyData = await knex.raw(`
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
                    `); // Fetch complete survey data

                if (req.session.user.role === 'admin') {
                    res.render(__dirname + "/public/pages/surveyResults.ejs", { surveyData: surveyData.rows, navbar: adminnavbar });
                } else {
                    res.render(__dirname + "/public/pages/surveyResults.ejs", { surveyData: surveyData.rows, navbar: employeenavbar });
                }
            } else {
                res.sendFile(__dirname + "/public/pages/notAuthorized.html");
            }
        } else {
            res.render(__dirname + "/public/pages/login", { message: "Please login to view this page.", navbar: guestnavbar });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

//Filter Survey Results
app.post("/filterSurveyResults", async(req, res) => {
    try {
        console.log('Body: ', req.body);
        let surveyId = req.body.SurveyIdSearch;
        let location1 = req.body.LocationSearch1;
        let location2 = req.body.LocationSearch2;
        let timeSpent = [
            req.body.TimeSpentSearch1,
            req.body.TimeSpentSearch2,
            req.body.TimeSpentSearch3,
            req.body.TimeSpentSearch4,
            req.body.TimeSpentSearch5,
            req.body.TimeSpentSearch6
        ].filter(Boolean); // Remove undefined values


        // console.log('surveyId:', surveyId, 'location1:', location1, 'location2:', location2, 'timeSpent:', timeSpent);

        let query = knex("survey")
            .select(
                "s.survey_id",
                "s.survey_time",
                "s.age",
                "g.gender_description",
                "r.relationship_description",
                "o.occupation_description",
                knex.raw("string_agg(org.organization_type, ', ') AS organization_type"),
                "s.use_social_media",
                knex.raw("string_agg(p.platform_name, ', ') AS platform_name"),
                "t.time_description",
                "s.no_specific_purpose",
                "s.distracted_by_social_media",
                "s.restless_without_social_media",
                "s.easily_distracted",
                "s.bothered_by_worries",
                "s.concentration_difficulty",
                "s.compare_with_successful_people",
                "s.feel_about_comparisons",
                "s.validation_from_social_media",
                "s.depressed_or_down",
                "s.interest_fluctuation",
                "s.sleep_issues",
                "s.origin"
            )
            .from("survey as s")
            .join("gender as g", "s.gender_id", "=", "g.gender_id")
            .join("relationship_status as r", "s.relationship_id", "=", "r.relationship_id")
            .join("occupation_status as o", "s.occupation_id", "=", "o.occupation_id")
            .leftJoin("individual_organizations as io", "s.survey_id", "=", "io.survey_id")
            .join("organization as org", "io.organization_id", "=", "org.organization_id")
            .join("time_spent as t", "s.time_id", "=", "t.time_id")
            .leftJoin("individual_platforms as ip", "s.survey_id", "=", "ip.survey_id")
            .join("platform as p", "ip.platform_id", "=", "p.platform_id")
            .groupBy(
                "s.survey_id",
                "s.survey_time",
                "s.age",
                "g.gender_description",
                "r.relationship_description",
                "o.occupation_description",
                "s.use_social_media",
                "t.time_description",
                "s.no_specific_purpose",
                "s.distracted_by_social_media",
                "s.restless_without_social_media",
                "s.easily_distracted",
                "s.bothered_by_worries",
                "s.concentration_difficulty",
                "s.compare_with_successful_people",
                "s.feel_about_comparisons",
                "s.validation_from_social_media",
                "s.depressed_or_down",
                "s.interest_fluctuation",
                "s.sleep_issues",
                "s.origin"
            );


        // Apply filters if they are provided
        if (surveyId && surveyId.trim() !== '') {
            query = query.where("s.survey_id", surveyId);
        }

        if (location1 || location2) {
            query.andWhere(function () {
                if (location1) this.where("s.origin", location1);
                if (location2) this.orWhere("s.origin", location2);
            });
        }

        if (timeSpent.length > 0) {
            query.andWhere(function () {
                this.whereIn("s.time_id", timeSpent);
            });
        }

        // Execute the query
        const surveyData = await query;

        // Render the table rows HTML using EJS
        const tableRowsHTML = await ejs.renderFile(__dirname + '/public/modules/tableRows.ejs', { surveyData });
        res.send(tableRowsHTML); // Send only the updated table rows HTML back to the client
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});




//Other page routes with authentication
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: adminnavbar});
        }
        else if (req.session.user.role === "employee") {
            res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: employeenavbar});
        }
        else {
            res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: usernavbar});
        }
    } else {
        res.render(__dirname + "/public/pages/dashboard.ejs", {navbar: guestnavbar});
    }
});

app.get('/survey', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.render(__dirname + "/public/pages/survey.ejs", {navbar: adminnavbar});
        }
        else if (req.session.user.role === "employee") {
            res.render(__dirname + "/public/pages/survey.ejs", {navbar: employeenavbar});
        }
        else {
            res.render(__dirname + "/public/pages/survey.ejs", {navbar: usernavbar});
        }
    } else {
        res.render(__dirname + "/public/pages/survey.ejs", {navbar: guestnavbar});
    }
});

app.get('/resources', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.render(__dirname + "/public/pages/resources.ejs", {navbar: adminnavbar});
        }
        else if (req.session.user.role === "employee") {
            res.render(__dirname + "/public/pages/resources.ejs", {navbar: employeenavbar});
        }
        else {
            res.render(__dirname + "/public/pages/resources.ejs", {navbar: usernavbar});
        }
    } else {
        res.render(__dirname + "/public/pages/resources.ejs", {navbar: guestnavbar});
    }
});

//View Profile Route
app.get('/viewProfile', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            knex("users").select().where("username", req.session.user.username).then(user => {
                res.render(__dirname + "/public/pages/profile.ejs", {navbar: adminnavbar, user: user[0]});
            });
        }
        else if (req.session.user.role === "employee") {
            knex("users").select().where("username", req.session.user.username).then(user => {
                res.render(__dirname + "/public/pages/profile.ejs", {navbar: employeenavbar, user: user[0]});
            });
        }
        else {
            knex("users").select().where("username", req.session.user.username).then(user => {
                res.render(__dirname + "/public/pages/profile.ejs", {navbar: usernavbar, user: user[0]});
            })
        }
    } else {
        res.sendFile(__dirname + '/public/pages/notAuthorized.html');
    }
});

//Edit Profile Route
app.get('/edit-profile', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            knex("users").select().where("username", req.session.user.username).then(user => {
                res.render(__dirname + "/public/pages/edit-profile.ejs", {navbar: adminnavbar, user: user[0], message:''});
            });
        }
        else if (req.session.user.role === "employee") {
            knex("users").select().where("username", req.session.user.username).then(user => {
                res.render(__dirname + "/public/pages/edit-profile.ejs", {navbar: employeenavbar, user: user[0], message: ''});
            });
        }
        else {
            knex("users").select().where("username", req.session.user.username).then(user => {
                res.render(__dirname + "/public/pages/edit-profile.ejs", {navbar: usernavbar, user: user[0], message: ''});
            })
        }
    } else {
        res.sendFile(__dirname + '/public/pages/notAuthorized.html');
    }
});

app.post('/edit-profile', (req, res) => {
    let firstname = req.body.user_first_name;
    let lastname = req.body.user_last_name;
    let email = req.body.user_email;

    if (firstname === "" || lastname === "" || email === "") {
        // If any field is empty, display an error message
        res.render(__dirname + "/public/pages/edit-profile", { message: 'Please fill in all fields.' });
    } else if (firstname.length > 30 || lastname.length > 30 || email.length > 30) {
        // If any field is longer than 30 characters, display an error message
        res.render(__dirname + "/public/pages/edit-profile", { message: 'Please make sure all fields are less than 30 characters.' });
    } else {
        // Update the user's information in the database
        knex("users")
            .where("username", req.session.user.username)
            .update({
                first_name: firstname,
                last_name: lastname,
                email: email,
            })
            .then(() => {
                // Fetch the updated user data after the update operation
                knex("users")
                    .select()
                    .where("username", req.session.user.username)
                    .then(updatedUser => {
                        const user = updatedUser[0]; // Extract the user object from the array

                        // Render the profile page with the updated user information
                        if (req.session.user.role === "admin") {
                            res.render(__dirname + "/public/pages/profile", { message: "Account updated successfully.", navbar: adminnavbar, user: user });
                        } else if (req.session.user.role === "employee") {
                            res.render(__dirname + "/public/pages/profile", { message: "Account updated successfully.", navbar: employeenavbar, user: user });
                        } else {
                            res.render(__dirname + "/public/pages/profile", { message: "Account updated successfully.", navbar: usernavbar, user: user });
                        }
                    })
                    .catch(err => {
                        // Handle any error that occurred during fetching the updated user data
                        console.error("Error fetching updated user data:", err);
                        res.status(500).send("Internal Server Error");
                    });
            })
            .catch(err => {
                // Handle any error that occurred during the update operation
                console.error("Error updating user data:", err);
                res.status(500).send("Internal Server Error");
            });
    }
});

//Change Password Route
app.get('/change-password', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            res.render(__dirname + "/public/pages/change-password.ejs", {navbar: adminnavbar, username: req.session.user.username, message:''});
        }
        else if (req.session.user.role === "employee") {
            res.render(__dirname + "/public/pages/change-password.ejs", {navbar: employeenavbar, username: req.session.user.username, message:''});
        }
        else {
            res.render(__dirname + "/public/pages/change-password.ejs", {navbar: usernavbar, username: req.session.user.username, message:''});
        }
    } else {
        res.sendFile(__dirname + '/public/pages/notAuthorized.html');
    }
});

app.post('/change-password', (req, res) => {
    let username = req.body.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
        // If any field is empty, display an error message
        res.render(__dirname + "/public/pages/change-password", { message: 'Please fill in all fields.' });
    } else if (newPassword !== confirmPassword) {
        // If the new password and confirm password don't match, display an error message
        res.render(__dirname + "/public/pages/change-password", { message: 'New password and confirm password do not match.' });
    } else if (newPassword.length > 30) {
        // If any field is longer than 30 characters, display an error message
        res.render(__dirname + "/public/pages/change-password", { message: 'Please make sure all fields are less than 30 characters.' });
    } else {
        // Fetch the user's password from the database
        knex("users")
            .select("password")
            .where("username", username)
            .then(user => {
                const hashedPassword = user[0].password; // Extract the hashed password from the user object

                // Compare the old password with the hashed password
                bcrypt.compare(oldPassword, hashedPassword, (err, result) => {
                    if (err) {
                        // Handle any error that occurred during the comparison
                        console.error("Error comparing passwords:", err);
                        res.status(500).send("Internal Server Error");
                    } else if (!result) {
                        // If the old password is incorrect, display an error message
                        res.render(__dirname + "/public/pages/change-password", { message: 'Incorrect password.' });
                    } else {
                        // Hash the new password
                        bcrypt.hash(newPassword, 10, (err, hash) => {
                            if (err) {
                                // Handle any error that occurred during the hashing
                                console.error("Error hashing password:", err);
                                res.status(500).send("Internal Server Error");
                            } else {
                                // Update the user's password in the database
                                knex("users")
                                    .where("username", username)
                                    .update({
                                        password: hash
                                    })
                                    .then(() => {
                                        // Render the change password page with a success message
                                        if (req.session.user.role === "admin") {
                                            res.render(__dirname + "/public/pages/profile", { message: 'Password changed successfully.', navbar: adminnavbar, username: username });
                                        }
                                        else if (req.session.user.role === "employee") {
                                            res.render(__dirname + "/public/pages/profile", { message: 'Password changed successfully.', navbar: employeenavbar, username: username });
                                        }
                                        else {
                                            res.render(__dirname + "/public/pages/profile", { message: 'Password changed successfully.', navbar: usernavbar, username: username });
                                        }
                                    })
                                    .catch(updateError => {
                                        console.error("Error updating password:", updateError);
                                        res.status(500).send("Internal Server Error");
                                    });
                            }
                        });
                    }
                });
            })
            .catch(queryError => {
                console.error("Error querying user:", queryError);
                res.status(500).send("Internal Server Error");
            });
    }
});


//Users Page Routes
app.get('/users', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            knex("users").select().then(users => {
                res.render(__dirname + "/public/pages/users.ejs", {navbar: adminnavbar, users: users});
            });
        }
        else {
            res.sendFile(__dirname + '/public/pages/notAuthorized.html');
        }
    } else {
        res.sendFile(__dirname + '/public/pages/notAuthorized.html');
    }
});

app.post('/updateUsers', async (req, res) => {
    try {
        const username = req.body.username; // Fetch the user's unique identifier from the form
        const newRole = req.body.newUserRole; // Fetch the updated role from the form
        // console.log('username:', username, 'newRole:', newRole); //This was for testing purposes

        // Update the user's role in the database using the userId
        // You should use the appropriate function to update the database based on your schema
        for (let i = 0; i < username.length; i++) {
            await knex('users')
                .where({ username: username[i] })
                .update({ role: newRole[i] });
        }

        res.redirect('/users'); // Redirect back to the users page after the update
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

app.delete('/deleteUser/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Delete the user from the 'users' table where the username matches
        await knex('users').where({ username: username }).del();

        res.sendStatus(200); // Send a success status upon successful deletion
    } catch (error) {
        console.error('Error deleting user:', error);
        res.sendStatus(500); // Send a server error status on failure
    }
});


//TODO: For testing purposes.  Delete me!
app.get('/test', (req, res) => {
    res.render(__dirname + "/public/pages/test.ejs", {navbar: guestnavbar});
});


app.listen(port, () => console.log("Listening on port: " + port + "."));
