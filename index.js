//integrating models:
const mongoose = require('mongoose');
const models = require('./models.js');

const Movies = models.Movie;
const Users = models.User;
const Genres = models.Genre;

//connect to the database myFlixDb
mongoose.connect('mongodb://localhost:27017/myFlixDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const express = require('express');
const app = express();

const morgan = require('morgan');


const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser'),
    uuid = require('uuid');


//log.txt file is created in the root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a'
});

//logger
app.use(morgan('combined', {
    stream: accessLogStream
}));

app.use(bodyParser.json());


//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');

});

// url /documentation uses express.static to get file from public folder
// route example /documentation.html
app.use(express.static('public'));


// READ
//url /movies returns movies in json format
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    // res.status(200).json(movies);
});

// READ
// return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    Movies.findOne({
            title: req.params.title
        })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ
//return data about a genre by title
app.get('/movies/genre/:genres', (req, res) => {
    Movies.find({
        //find by genreId
        genre: req.params.genres
    })
  
    
        .populate('genre')
        .then((movie) => {
                res.json(movie);
                
            
            

        })

        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});

//Read
//return data about actor
app.get('/movies/actor/:actor', (req, res) => {
    Movies.find({
        //find by actorId
        actor: req.params.actor
    })
  
    
        .populate('genre')
        .then((movie) => {

            res.json(movie);

        })

        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});


// READ
//return data about director by name
app.get('/movies/director/:directorName', (req, res) => {
    Movies.find({
            'director.name': req.params.directorName
        })
        .then((directorName) => {
            res.json(directorName);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});

// CREATE
//add new user

// JSON format:
// {
//     id: Integer ,
//     name: String,
//     userName: String,
//     email: String,
//     birthday: Data 
// }
app.post('/users', (req, res) => {
    Users.findOne({
            userName: req.body.userName
        })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.userName + 'already exists');
            } else {
                Users
                    .create({
                        name: req.body.name,
                        userName: req.body.userName,
                        password: req.body.password,
                        email: req.body.email,
                        birthday: req.body.birthday
                    })
                    .then((user) => {
                        res.status(201).json(user)
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// UPDATE
// update user info: username
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({
            userName: req.params.username
        }, {
            $set: {
                name: req.body.name,
                userName: req.body.userName,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday
            }
        }, {
            new: true
        }, //check that updated document is returned
        (err, updateUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updateUser);
            }
        });

});

//CREATE
// add a movie to users list of favorites
app.post('/users/:username/:movieId', (req, res) => {
    Users.findOneAndUpdate({
            userName: req.params.username
        }, {
            $addToSet: {
                favorites: req.params.movieId
            }
        }, {
            new: true
        },
        (err, updateUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updateUser);
            }
        });

});

// DELETE
//allow user to remove a movie from their favorites list
app.delete('/users/:username/:movieTitle', (req, res) => {
    Users.findOneAndUpdate({
            userName: req.params.username
        }, {
            $pull: {
                favorites: req.params.movieId
            }
        }, {
            new: true
        },
        (err, updateUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updateUser);
            }
        });
});

//DELETE
//allow user to deregister
app.delete('/users/:username', (req, res) => {
    Users.findOneAndRemove({
            userName: req.params.username
        })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});


//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

//listen for requests
app.listen(8080, () => {
    console.log('The app is listening on port 8080. ')
});