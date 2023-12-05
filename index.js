const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "public/pages"));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || 'localhost',
        user: process.env.RDS_USERNAME || 'postgres',
        password: process.env.RDS_PASSWORD || 'C1$$&!Xi46RRu0HS',
        database: process.env.RDS_DB_NAME || 'users',
        port: process.env.RDS_PORTv|| 5432,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    }
});

//TODO: Add a route to display data and accept data to add to the database

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/public/pages/signup.html");
});

app.get("/login", (req, res) => {
    res.render(__dirname + "/public/pages/login");
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let message = 'Username or password is incorrect.'
    knex.select().from("users").where("username", username).then(user => {
        if (user.length > 0) {
            if (user[0].password === password) {
                res.render("/public/pages/home.html");
            } else {
                // If password is incorrect, display error message in login.ejs
                res.render( "/public/pages/login", {message});
            }
        } else {
            // If username doesn't exist, display error message in login.ejs
            res.render("/public/pages/login", message);
        }
    });
});

app.post("/signup", (req, res) => {


})
app.listen(port, () => console.log("Listening on port: " + port + "."));
