//integrating models:
const mongoose = require('mongoose');
const models = require('./models.js');

const Movies = models.Movie;
const Users = models.User;

//connect to the database myFlixDb
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// localhost
// mongoose.connect('mongodb://localhost:27017/myFlixDb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });



const express = require('express');
const app = express();

const morgan = require('morgan');


const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser'),
    uuid = require('uuid');
const {
    constants
} = require('buffer');



//log.txt file is created in the root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags: 'a'
});

//logger
app.use(morgan('combined', {
    stream: accessLogStream
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//allows implementation of CORS: Cross Origin Resource Sharing
const cors = require('cors');
app.use(cors());

//CORS only specific domains allowed
// let allowedOrigins = ['http://localhost:8080'];

// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
//             return callback(new Error(message), false);
//         }
//         return callback(null, true);
//     }
// }));

let auth = require('./auth')(app); //app so that express is available in the auth.js file

//passport
const passport = require('passport');
require('./passport');

const {
    check,
    validationResult
} = require('express-validator');



//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');

});

// url /documentation uses express.static to get file from public folder
// route example /documentation.html
app.use(express.static('public'));


// READ
//url /movies returns movies in json format
app.get('/movies', function (req, res) {
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
app.get('/movies/:title', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Movies.findOne({
            title: req.params.title
            
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
//return data about a genre by title
app.get('/movies/genre/:genres', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Movies.find()


        .populate({
            path: 'genre',
            match: {
                name: req.params.genres
            }
        })


        .then((movie) => {

            const moviesWithGenres = movie.filter(item => item.genre.length > 0)
            res.json(moviesWithGenres);
        })


        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});

//Read
//return data about actor by name
app.get('/movies/actor/:actor', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Movies.find()


        .populate({
            path: 'actors',
            match: {
                name: req.params.actor
            }
        })
        .then((movie) => {

            const moviesWithActor = movie.filter(item => item.actors.length > 0);
            res.send(moviesWithActor);

        })

        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});


// READ
//return data about director by name
app.get('/movies/director/:directorName', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
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

//READ
//return data about user
app.get('/users/:userName', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Users.findOne({
            userName: req.params.userName
        })
        .then((user) => {
            res.json(user);
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
app.post('/users', [
        //validation logic for the request
        check('userName', 'Username is required').isLength({
            min: 5
        }),
        check('userName', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        //not().isEmpty checks that it is not empty
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail()
    ],
    (req, res) => {

        //check validation
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        //hash password before storing it in the MongoDB database
        let hashedPassword = Users.hashPassword(req.body.password);
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
                            password: hashedPassword,
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
app.put('/users/:username', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
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
app.post('/users/:username/:movieId', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
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
app.delete('/users/:username/:movieId', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
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
app.delete('/users/:username', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
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

//listen for requests (only localhost)
// app.listen(8080, () => {
//     console.log('The app is listening on port 8080. ')
// });

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});