//movie list
let topMovies = [{
        title: 'Pillow Talk',
        year: 1959,
        genre: ['comedy', 'romance'],
        director: 'Michael Gordon'
    },
    {
        title: 'The Glass Bottom Boat',
        year: 1966,
        genre: ['comedy', 'romance'],
        director: 'Frank Tashlin'
    },
    {
        title: 'Lover Come Back',
        year: 1961,
        genre: ['comedy', 'romance', 'drama'],
        director: 'Delbert Mann'
    },
    {
        title: 'Send Me No Flowers',
        year: 1964,
        genre: ['comedy', 'romance'],
        director: 'Michael Gordon'
    },
    {
        title: 'The Thrill of It All',
        year: 1963,
        genre: ['comedy', 'romance', 'drama'],
        director: {
            name: 'Norman Jewison',
            birth: 1926,
            death: undefined
        }
    },
    {
        title: 'The Pajama Game',
        year: 1957,
        genre: ['comedy', 'drama', 'musical'],
        director: {
            name: 'George Abbott',
            birth: 1887,
            death: 1995
        }
    },
    {
        title: 'Please Don\'t Eat the Daisies',
        year: 1959,
        genre: ['comedy', 'romance', 'family'],
        director: {
            name: 'Charles Walters',
            birth: 1911,
            death: 1982
        }
    },
    {
        title: 'How to Lose a Guy in 10 Days',
        year: 2003,
        genre: ['comedy', 'romance'],
        director: {
            name: 'Donald Petrie',
            birth: 1954,
            death: undefined
        }
    },
    {
        title: 'Grease',
        year: 1978,
        genre: ['comedy', 'romance', 'musical'],
        director: {
            name: 'Randal Kleiser',
            birth: 1946,
            death: undefined
        }
    },
    {
        title: 'Sweet Home Alabama',
        year: 2002,
        genre: ['comedy', 'romance'],
        director: {
            name: 'Andy Tennant',
            birth: 1955,
            death: undefined
        }
    },

];

// user list
let users = [{
    id: '1',
    username: 'testUser',
    name: 'Test User',
    password: 'password',
    favorites: [
        topMovies.title('Grease')
    ]
}, ];

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


//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// url /documentation uses express.static to get file from public folder
app.use(express.static('public'))
// app.get('/documentation', (req, res) => {
//     res.sendFile('public/documentation.html', {
//         root: __dirname
//     });
// });

//url /movies returns movies in json format
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.json(topMovies.find((movie) => {
        return movie.title === req.params.title
    }));
});

//return data about a genre by title
app.get('/movies/:title/genre', (req, res) => {
    let movie = topMovies.find((movie) => {
        return movie.title === req.params.title
    });

    if (title) {
        let genre = Object.values(movie.genre);
        for (let i = 0; i < genre.length; i++) {
            const element = genre[i];
            console.log(element);
            res.status(201).send('' + element);

        }
    } else {
        res.status(404).send('Movie with the name ' + req.params.title + ' was not found.')
    }
})

//return data about director by name
app.get('/movies/:director', (req, res) => {
    res.json(topMovies.find((movie) => {
        return movie.director === req.params.director
    }));
});

//add new user
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newStudent.username) {
        const message = 'Missing username in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
})

// update user info: username
app.put('/users/:username', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });

    if (user) {
        user.username[req.params.username] = req.params.username;
        res.status(201).send('Username is ' + req.params.username);

    } else {
        res.status(404).send('The username: ' + req.params.name + ' was not found');
    }
})

// add a movie to users list of favorites
app.post('users/:username/:favorites/:movieId', (req, res) =>{
    let user = users.find((user) =>
    {return users.username === req.params.username});

    if (user) {
        users.push(favorites[req.params.movieId]);
        res.status(201).send('The movie' +req.params.movieId + ' was added to favorites.');
        
    }else{
        res.status(404).send('The username: ' + req.params.username + ' was not found.');
    }
});

app.delete('users/:username/:favorites/:movieId', (req, res) =>{
    let favorite = users.find((favorite) =>
    {return users.favorite.movieId === req.params.movieId});
    // not done
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






// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)