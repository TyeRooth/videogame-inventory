const Genre = require("../models/genre");
const Videogame = require("../models/videogame");

const async = require('async');

exports.genre_list = function (req, res, next) {
    Genre.find().sort({ name: 1 }).exec((err, results) => {
        if (err) {
            return next(err);
        }
        res.render("genre_list", {
            title: "Genre List",
            genre_list: results,
        });
    });
};

exports.genre_detail = function (req, res, next) {
    async.parallel(
        {
            genre(callback) {
                Genre.findById(req.params.id).exec(callback);
            },
            genre_games(callback) {
                Videogame.find({ genre: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.genre == null) {
                const err = new Error("Genre not found");
                err.status = 404;
                return next(err);
            }
            res.render("genre_detail", {
                title: results.genre.name,
                genre: results.genre,
                videogame_list: results.genre_games,
            });
        }
    );
};

exports.genre_create_get = (req, res) => {
    res.send("Not Implemented: genre create get");
};

exports.genre_create_post = (req, res) => {
    res.send("Not Implemented: genre create post");
};

exports.genre_delete_get = (req, res) => {
    res.send("Not Implemented: genre delete get");
};

exports.genre_delete_post = (req, res) => {
    res.send("Not Implemented: genre delete post");
};

exports.genre_update_get = (req, res) => {
    res.send("Not Implemented: genre update get");
};

exports.genre_update_post = (req, res) => {
    res.send("Not Implemented: genre update post");
};