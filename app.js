const fs = require('fs');
var express = require("express"),
    session = require('express-session')
app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vue-music', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('---------------- Connected to MongoDB : ) ----------------'))
    .catch(error => console.log(error))

const Playlist = require('./models/playlist');
const Users = require('./models/users');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(router);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});


// PLAYLIST
router.post('/playlist/add', async(req, res) => {

    const playlist = new Playlist(req.body.data);
    await playlist.save()
    console.log("[REST API] Se añadido una nueva playlist.");
    res.send({ status: 'PLAYLIST_CREATED_SUCCESS' });
});

router.get('/getPlaylists', async(req, res) => {
    const playlists = await Playlist.find();
    res.send(playlists);
    console.log("[REST API] Playlists cargadas con éxito.");
});

router.post('/playlist/delete/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.find({ _id: id });

        await Playlist.remove({ _id: id })
        console.log(`[REST API] Se eliminado la playlist: ${id}.`);
        res.send({ status: 'PLAYLIST_DELETED_SUCCESS' });
    } catch (error) {
        console.log(error)
        console.log('[REST API] Playlist NO encontrada');
        res.send({ status: 'PLAYLIST_NOT_FOUND' });
    }

});
// END PLAYLIST



// USER - ACCOUNT
router.post('/register', async(req, res) => {
    const users = new Users(req.body.data);
    const data = req.body.data;
    const user = await Users.find({
        email: data.email,
        password: data.password
    });
    if (req.body.data.email == '' || req.body.data.email == '') {
        res.send({ status: 'USER_CREATED_FAILED' });
    } else {
        if (!user.length) {
            await users.save();
            console.log("[REST API] Se añadido un nuevo usuario.");
            res.send({ status: 'USER_CREATED_SUCCESS' });
        } else {
            res.send({ status: 'USER_CREATED_ALREADY_EXISTS' });
            console.log("[REST API] No se ha podido crear el usuario, ya existe!.");

        }
    }
});

router.post('/login', async(req, res) => {
    const data = req.body.data;
    const user = await Users.find({
        email: data.email,
        password: data.password
    });
    if (!user.length) {
        res.send({ status: 'USER_LOGIN_FAILED' });
        console.log("[REST API] El usuario no se ha podido conectar.");
    } else {
        res.send({ status: 'USER_LOGIN_SUCCESS' });
        console.log("[REST API] El usuario se ha conectado correctamente.");
    }
});

// END USER - ACCOUNT