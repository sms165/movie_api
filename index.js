//integrating models:
const mongoose = require('mongoose');
const models = require('./models.js');

const Movies = models.Movie;
const Users = models.User;

//connect to the database myFlixDb
mongoose.connect('mongodb://localhost:27017/myFlixDb' ,{
    useNewUrlParser: true, useUnifiedTopology: true
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
// app.get('/documentation', (req, res) => {
//     res.sendFile('public/documentation.html', {
//         root: __dirname
//     });
// });

// READ
//url /movies returns movies in json format
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error: '+err);
    });
    // res.status(200).json(movies);
});

// READ
// return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    Movies.findOne({title: req.params.title})
    .then((movie)=>{
        res.json(title);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' +err);
    });
    // const {
    //     title
    // } = req.params;
    // const movie = movies.find(movie => movie.title === title);

    // if (movie) {
    //     res.status(200).json(movie);
    // } else {
    //     res.status(400).send("Movie is not found")
    // }

});

// READ
//return data about a genre by title
app.get('/movies/genre/:genres', (req, res) => {
    const {
        genres
    } = req.params;

    //const movieGenre = movies.genre.include(genres)
    movieGenre = movies.filter(movie => movie.genre.includes(genres));

    if (movieGenre.length > 0) {
        res.json(movieGenre);
    } else {
        res.status(400).send("Genre is not found")


    }
})

// READ
//return data about director by name
app.get('/movies/director/:directorName', (req, res) => {
    const {
        directorName
    } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    console.log(director)

    if (director) {
        res.status(200).json(director);

    } else {
        res.status(400).send('No director found with the name ' + directorName);
    }
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
    Users.findOne({userName: req.body.userName})
    .then((user)=>{
        if(user){
            return res.status(400).send(req.body.userName + 'already exists');
        }else{
            Users
            .create({
                name: req.body.name,
                userName: req.body.userName,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday
            })
            .then((user) =>{res.status(201).json(user) })
            .catch((error) =>{
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).send('Error: '+ error);
        });
    });
    // const newUser = req.body;

    // if (!newUser.username) {
    //     const message = 'Missing username in request body';
    //     res.status(400).send(message);
    // } else {
    //     newUser.id = uuid.v4();
    //     users.push(newUser);
    //     res.status(201).send(newUser);
    // }






// UPDATE
// update user info: username
app.put('/users/:username', (req, res) => {
    const {
        username
    } = req.params;
    const updateUser = req.body;

    let user = users.find(user => user.username == username);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user)

    } else {
        res.status(400).send('User cannot be found.')
    }

})

//CREATE
// add a movie to users list of favorites
app.post('/users/:username/:movieTitle', (req, res) => {
    const {
        username
    } = req.params;
    const {
        movieTitle
    } = req.params;

    let user = users.find(user => user.username == username);

    if (user) {
        user.favorites.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${username}`)

    } else {
        res.status(400).send('User cannot be found.')
    }


});

// DELETE
//allow user to remove a movie from their favorites list
app.delete('/users/:username/:movieTitle', (req, res) => {
    const {
        username,
        movieTitle
    } = req.params;

    let user = users.find(user => user.username == username);

    if (user) {
        user.favorites = user.favorites.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${username}`)

    } else {
        res.status(400).send('User cannot be found.')
    }


});
//DELETE
//allow user to deregister
app.delete('/users/:username', (req, res) => {
    const {
        username
    } = req.params;

    let user = users.find(user => user.username == username);

    if (user) {
        users = users.filter(user => user.username !== username);
        res.status(200).send(`${username} has been deleted`)

    } else {
        res.status(400).send('User cannot be found.')
    }

})


//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

//listen for requests
app.listen(8080, () => {
    console.log('The app is listening on port 8080. ')
});