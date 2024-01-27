var express = require('express');
const config = require('./config');
const mongodbConnectionString = require('./config').mongoUrl;
var app = express();
var port = process.env.PORT || 8080;

// cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// mongoose config
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(mongodbConnectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB on mLab :('));
db.once('open', function () {
    console.log('connected to the DB :)')
});

// body parser config
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// creating a livre mongoose model
const livreSchema = mongoose.Schema({
    titre: String,
    resume: String,
    isbn: String
});
const savedLivre = mongoose.model('Biblio', biblioSchema);

// routes
app.get('/livres', function(req, res) {
    Livre.find((err, livres) => {
        if(err) {
            console.log('could not retrieve books from DB');
            res.json({});
        } else {            
            res.json(livres);
        }
    });   
})

app.post('/livres', function (req, res) {

    if (!req.body) {
        return res.sendStatus(500);
    } else {
        var titre = req.body.titre;
        var resume = req.body.resume;
        var isbn = req.body.isbn;

        const myLivre = new Livre({ titre, resume, isbn });

        myLivre.save((err, savedLivre) => {
            if (err) {
                console.error(err);
                return;
            } else {
                console.log(savedLivre);
            }
        });

        res.sendStatus(201);
    }
});

// listening
app.listen(port);
console.log('Server started! At http://localhost:' + port);