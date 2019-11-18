const fs = require('fs');
var express = require("express"),
    session = require('express-session')
app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to mongodb');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
var sess;
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


var router = express.Router();

var sess;

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/getPlaylists', function(req, res) {


    let user_playlist = db.collection('user_playlist').find();
    user_playlist.toArray((err, playlist) => {
        if (playlist == null) {
            db.close();
            return;
        }
        console.log(playlist)
        res.send(playlist);

    });
    console.log("[REST API] Playlists cargadas con éxito.");
});

router.post('/playlist/add', function(req, res) {
    let title = req.body.data.title;
    db.collection('user_playlist').insertOne({ title: title });
    console.log("[REST API] Se añadido una nueva playlist.");
});




router.post('/login', (req, res) => {

    console.log(typeof req.body.data.password)

    let users = db.collection('users').find({
        email: req.body.data.email,
        password: req.body.data.password,
        active: true
    });
    let error = false;
    users.toArray((err, user) => {
        // Account found
        if (user.length > 0) {
            res.send({ status: 'USER_LOGIN_SUCCESS', userData: user });
            console.log("[REST API] LOGIN SUCCESS");
            sess = user;
            console.log(req.session.user);

        } else {
            res.send({ status: 'USER_LOGIN_FAIL' });
            console.log("[REST API] LOGIN FAILED");
        }

    });

});


router.get('/register', (req, res) => {

    db.collection('users').insertOne({
        email: "nouaryk@protonmail.ch",
        password: "123",
        active: true
    });

    res.send({ status: 'USER_CREATED' });
    console.log("[REST API] USER CREATED SUCCESSFULLY ");
});

router.post('/checkLogged', (req, res) => {
    console.log(sess);
    res.send(sess);
});

app.use(router);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});