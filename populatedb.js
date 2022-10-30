#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Videogame = require('./models/videogame');
var Console = require('./models/console');
var Genre = require('./models/genre')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var videogames = []
var consoles = []
var genres = []

function videogameCreate(name, price, stock, ESRB, releaseDate, genres, consoles, cb) {
    videogamedetail = {name:name , price:price , stock:stock , ESRB:ESRB };
    if (releaseDate != false) videogamedetail.releaseDate = releaseDate;
    if (genres != false) videogamedetail.genre = genres;
    if (consoles != false) videogamedetail.console = consoles;

    const videogame = new Videogame(videogamedetail);

    videogame.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Videogame: ' + videogame);
        videogames.push(videogame);
        cb(null, videogame);
    });
}

function consoleCreate(name, releaseYear, price, stock, cb) {
    consoledetail = { name: name, releaseYear: releaseYear, price: price, stock: stock };
    const thisconsole = new Console(consoledetail);

    thisconsole.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Console: ' + thisconsole);
        consoles.push(thisconsole);
        cb(null, thisconsole)
    });
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function createGenreConsoles(cb) {
    async.series([
        function(callback) {
            consoleCreate('Xbox 360', '2005', 99.99, 44, callback);
        },
        function(callback) {
            consoleCreate('PS3', '2006', 109.99, 56, callback);
        },
        function(callback) {
            consoleCreate('Wii', '2006', 59.99, 13, callback);
        },
        function(callback) {
            consoleCreate('Xbox One', '2013', 399.99, 212, callback);
        },
        function(callback) {
            consoleCreate('PS4', '2013', 379.99, 350, callback)
        },
        function(callback) {
            consoleCreate('Switch', '2017', 399.99, 32, callback);
        },
        function(callback) {
            genreCreate('Role-Playing', callback);
        },
        function(callback) {
            genreCreate('Sports', callback)
        },
        function(callback) {
            genreCreate('First-person Shooter', callback);
        },
        function(callback) {
            genreCreate('Action', callback);
        },
        function(callback) {
            genreCreate('Party', callback);
        },
    ], cb);
}

function createVideogames(cb) {
    async.parallel([
        function(callback) {
            videogameCreate('Skyrim', 14.99, 27, 'M', '2011-11-11', [genres[0], genres[3]], [consoles[0], consoles[1]], callback);
        },
        function(callback) {
            videogameCreate('Fallout 4', 25.99, 34, 'M', '2015-11-10', [genres[0], genres[3]], [consoles[3], consoles[4]], callback);
        },
        function(callback) {
            videogameCreate('Mario Kart Wii', 19.99, 54, 'E', '2008-04-10', [genres[1]], [consoles[2]], callback);
        },
        function(callback) {
            videogameCreate('Halo Reach', 9.99, 101, 'M', '2010-09-14', [genres[2], genres[3]], [consoles[0]], callback);
        },
        function(callback) {
            videogameCreate('Super Mario Party', 79.99, 2, 'E', '2019-11-19', [genres[4]], [consoles[5]], callback )
        }
    ], cb);
}

async.series([
    createGenreConsoles,
    createVideogames,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('This finished');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});