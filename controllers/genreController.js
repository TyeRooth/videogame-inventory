const Genre = require("../models/genre");
const Videogame = require("../models/videogame");

const async = require('async');
const { body, validationResult } = require('express-validator');
const genre = require("../models/genre");

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
    res.render("genre_form", {
        title: "Add new Genre",
        genre: undefined,
    });
};

exports.genre_create_post = [
    body("name", "Name is required").trim().isLength({ min: 0 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre ({
            name: req.body.name,
        });

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Add new Genre",
                genre: genre,
            });
            return;
        }

        genre.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(genre.url);
        });
    },
]

exports.genre_delete_get = function (req, res, next) {
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
            res.render("genre_delete", {
                title: "Delete genre: " + results.genre.name,
                genre: results.genre,
                videogame_list: results.genre_games,
            });
        }
    );
};

exports.genre_delete_post = function (req, res, next) {
    async.parallel(
        {
            genre(callback) {
                Genre.findById(req.body.genreid).exec(callback);
            },
            genre_games(callback) {
                Videogame.find({ genre: req.body.genreid }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.genre_games.length > 0) {
                res.render("genre_delete", {
                    title: "Delete genre: " + results.genre.name,
                    genre: results.genre,
                    videogame_list: results.genre_games,
                });
                return;  
            }

            Genre.findByIdAndRemove(req.body.genreid, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/inventory/genres");
            });
        }
    )
};

exports.genre_update_get = (req, res) => {
    Genre.findById(req.params.id).exec((err, genre) => {
        if (err) {
            return next(err);
        }
        res.render("genre_form", {
            title: "Update Genre",
            genre: genre,
        });
    });
};

exports.genre_update_post = [
    body("name", "Name is required").trim().isLength({ min: 0 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre ({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Add new Genre",
                genre: genre,
            });
            return;
        }

        Genre.findByIdAndUpdate(req.params.id, genre, {}, ((err, thegenre) => {
            if (err) {
                return next(err);
            }
            res.redirect(thegenre.url);
        }));
    },
]