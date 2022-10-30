const Videogame = require('../models/videogame');
const Console = require('../models/console');
const Genre = require('../models/genre');

const async = require('async');

exports.index = function (req, res, next) {
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
            if (err) {
                return next(err);
            }
            // Sum stocks together for all videogames
            results.total_stock = 0;
            if (results.videogames) {
                for (let i = 0; i < results.videogames.length; i++) {
                    results.total_stock += results.videogames[i].stock;
                }
            };

            res.render("index", {
                title: "Videogame Inventory Summary",
                error: err,
                data: results,
            });
        }
    );
};

exports.videogame_list = function (req, res, next) {
    Videogame.find({}, "name stock").sort({ name: 1 }).exec((err, results) => {
        if (err) {
            return next(err);
        }
        res.render("videogame_list", {
            title: "Videogame List",
            videogame_list: results,
        });
    });
};

exports.videogame_detail = function (req, res, next) {
    Videogame.findById(req.params.id).populate("console").populate("genre").exec((err, result) => {
        if (err) {
            return next(err);
        }
        if (result == null) {
            const err = new Error ("Videogame not found");
            err.status = 404;
            return next(err);
        }
        res.render("videogame_detail", {
            title: result.name,
            data: result,
        });
    });
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