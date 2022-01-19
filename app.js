// 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
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/manojitBlogDB");

const userSchema = new mongoose.Schema({
    userName: String,
    password: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            userName: req.body.username,
            password: hash
        });
        newUser.save(err => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/signin", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({ email: userName }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            // Load hash from your password DB.
            bcrypt.compare(password, foundUser.password, (err, result)=> {
                if (result === true) { 
                    res.render("secrets");
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log("Server successfuly started listening on port");
})