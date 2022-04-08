//movie list
let topMovies = [{
    title: 'Pillow Talk',
    year: 1959
},
{
    title: 'The Glass Bottom Boat',
    year: 1966
},
{
    title: 'Lover Come Back',
    year: 1961
},
{
    title: 'Send Me No Flowers',
    year: 1964
},
{
    title: 'The Thrill of It All',
    year: 1963
},
{
    title: 'The Pajama Game',
    year: 1957
},
{
    title: 'Please Don\'t Eat the Daisies',
    year: 1959
},
{
    title: 'How to Lose a Guy in 10 Days',
    year: 2003
},
{
    title: 'Grease',
    year: 1978
},
{
    title: 'Sweet Home Alabama',
    year: 2002
},

];

const express = require('express');
const app = express();

const morgan = require('morgan');


const fs = require('fs'),
    path = requie('path');

//log.txt file is created in the root directory
const accessLogStream = fs.createWriteStream(path.join(_dirname, 'log.txt'), {flags: 'a'});

//logger
app.use(morgan('combined', {stream:accessLogStream}));


//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// url /documentation uses express.static to get file from public folder
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {
        root: __dirname
    });
});

//url /movies returns movies in json format
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//listen for requests
app.listen(8080, () => {
    console.log('The app is listening on port 8080. ')
});