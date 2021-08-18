//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisoutlongsecret.";
//adding encryption functionality to userSchema and defining fields to be encrypted
userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]}); 

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", (req, res) => {
    // console.log(req.body);

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err){
        if(!err){
            res.render("secrets");
        } else {
            console.log(err);
        }
    });

});

app.post("/login", (req, res) => {
    User.findOne({ email: req.body.username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function (req, res){
    console.log("Listening on port 3000.");
});


