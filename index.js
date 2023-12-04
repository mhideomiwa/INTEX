const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

// const knex = require("knex")({
//     client: "pg",
//     connection: {
//         host: process.env.RDS_HOSTNAME || "",
//         user: process.env.RDS_USERNAME || "",
//         password: process.env.RDS_PASSWORD || "",
//         database: process.env.RDS_DB_NAME || "",
//         port: process.env.RDS_PORTv|| 5432,
//         ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
//     }
// });

//TODO: Add a route to display data and accept data to add to the database

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/public/pages/signup.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/pages/login.html");
});

app.listen(port, () => console.log("Listening on port: " + port + "."));
