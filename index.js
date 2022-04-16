//movie list
let movies = [{
        title: 'Pillow Talk',
        year: 1959,
        genre: ['comedy', 'romance'],
        director: {
            name: 'Michael Gordon',
            birth: 1909,
            death: 1993
        }
    },
    {
        title: 'The Glass Bottom Boat',
        year: 1966,
        genre: ['comedy', 'romance'],
        director: {
            name: 'Frank Tashlin',
            birth: 1913,
            death: 1972
        }
    },
    {
        title: 'Lover Come Back',
        year: 1961,
        genre: ['comedy', 'romance', 'drama'],
        director: {
            name: 'Delbert Mann',
            birth: 1920,
            death: 2007
        }
    },
    {
        title: 'Send Me No Flowers',
        year: 1964,
        genre: ['comedy', 'romance'],
        director: {
            name: 'Michael Gordon',
            birth: 1909,
            death: 1993
        }
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
    favorites: [ 'Scream'   
    ]
},
{
    id: '2',
    username: 'Sammy',
    name: 'Sammy',
    password: 'password',
    favorites: [ 'Scream'   
    ]
} ];

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
app.use(express.static('public'))
// app.get('/documentation', (req, res) => {
//     res.sendFile('public/documentation.html', {
//         root: __dirname
//     });
// });

// READ
//url /movies returns movies in json format
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// READ
// return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    const { title} = req.params;
    const movie = movies.find(movie =>movie.title === title);

    if(movie){
        res.status(200).json(movie);
    }else{
        res.status(400).send("Movie is not found")
    }
       
});

// READ
//return data about a genre by title
app.get('/movies/genre/:genres', (req, res) => {
    const { genres} = req.params;
    const genre = movies.find(movie =>movie.genre === genres).genre;


    // if (genre) {
    //     console.log(Object.values(movie.genre));
    //     // let genre = Object.values(movie.genre);
        
    //     // for (let i = 0; i < genre.length; i++) {
    //     //     const element = genre[i];
    //     //     console.log(element);
    //     //     res.status(201).send('' + element);

    //     // }
    // } else {
    //     res.status(404).send('Movie with the name ' + req.params.title + ' was not found.')
    // }
})

// READ
//return data about director by name
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName ).director;

    console.log(director)
    
    if (director) {
        res.status(200).json(director);
        
    }else{
        res.status(400).send('No director found with the name ' + directorName);
    }
});

// CREATE
//add new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (!newUser.username) {
        const message = 'Missing username in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
})

// UPDATE
// update user info: username
app.put('/users/:username', (req, res) => {
    const {username} =req.params;
    const updateUser = req.body;

    let user = users.find(user => user.username == username);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user)
        
    }else{
        res.status(400).send('User cannot be found.')
    }
    
})

//CREATE
// add a movie to users list of favorites
app.post('/users/:username/:movieTitle', (req, res) =>{
    const { username} = req.params;
    const { movieTitle} = req.params;

    let user = users.find(user => user.username == username);

    if (user) {
        user.favorites.push(movieTitle); 
        res.status(200).send(`${movieTitle} has been added to user ${username}`)
        
    }else{
        res.status(400).send('User cannot be found.')
    }
    
    
});

// DELETE
//allow user to remove a movie from their favorites list
app.delete('/users/:username/:movieTitle', (req, res) =>{
    const { username, movieTitle} = req.params;

    let user = users.find(user => user.username == username);

    if (user) {
        user.favorites = user.favorites.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${username}`)
        
    }else{
        res.status(400).send('User cannot be found.')
    }
    

});
//DELETE
//allow user to deregister
app.delete('/users/:username', (req, res) =>{
    const { username } = req.params;

    let user = users.find(user => user.username == username);

    if (user) {
        users = users.filter(user => user.username !== username);
        res.status(200).send(`${username} has been deleted`)
        
    }else{
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

