const Videogame = require('../models/videogame');
const Console = require('../models/console');
const Genre = require('../models/genre');

const async = require('async');

exports.index = (req, res) => {
    async.parallel(
        {
            videogame_count(callback) {
                Videogame.countDocuments({}, callback);
            },
            videogames(callback) {
                Videogame.find({}, callback);
            },
            console_count(callback) {
                Console.countDocuments({}, callback);
            },
            genre_count(callback) {
                Genre.countDocuments({}, callback);
            },
        },
        (err, results) => {
            results.total_stock = 0;
            if (results.videogames) {
                for (let i = 0; i < results.videogames.length; i++) {
                    results.total_stock += videogames[i].stock;
                }
            };
            res.render("index", {
                title: "Videogame Inventory Home",
                error: err,
                data: results,
            });
        }
    );
};

exports.videogame_list = (req, res) => {
    res.send("Not Implemented: videogame list");
};

exports.videogame_detail = (req, res) => {
    res.send("Not Implemented: videogame detail");
};

exports.videogame_create_get = (req, res) => {
    res.send("Not Implemented: videogame create get");
};

exports.videogame_create_post = (req, res) => {
    res.send("Not implemented: videogame create post");
};

exports.videogame_delete_get = (req, res) => {
    res.send("Not implemented: videogame delete get");
};

exports.videogame_delete_post = (req, res) => {
    res.send("Not implemented: videogame delete post");
};

exports.videogame_update_get = (req, res) => {
    res.send("Not implemented: videogame update get");
};

exports.videogame_update_post = (req, res) => {
    res.send("Not implemented: videogame update post");
};