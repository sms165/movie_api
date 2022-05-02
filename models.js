const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// let genreSchema = mongoose.Schema({
//     type: mongoose.Schema.Types.ObjectId,
//     name: {type:String, required:true},
//     description: {type:String, required:true}
// });

// let actorSchema = mongoose.Schema({
//     name: {type:String, required:true},
//     bio: String,
//     birthYear:Date,
//     deathYear:Date
// });

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: String,
    featured: Boolean,
    genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}], //name of model genreSchema
    director: {
        name : String,
        bio: String,
        birthYear: Date,
        deathYear: Date
    },
    actors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Actor'}] //name of model actorSchema
});

let userSchema = mongoose.Schema({
    name: String,
    userName: {type: String, required: true},
    password: {type:String, required:true},
    email: {type:String, required:true},
    birthday:Date,
    favorites:[{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}] //name of model movieSchema
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

//create collections: titles will come out as lowercase and pluralized
//Actor will create a collection called db.actors
// let Actor = mongoose.model('Actor', actorSchema);
// let Genre = mongoose.model('Genre', genreSchema);
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//export the models, allows importing on index.js
// module.exports.Actor = Actor;
// module.exports.Genre = Genre
module.exports.Movie = Movie;
module.exports.User = User;