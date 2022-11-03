const Videogame = require('../models/videogame');
const Console = require('../models/console');
const Genre = require('../models/genre');

const async = require('async');
const { body, validationResult } = require('express-validator');

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
    async.parallel(
        {
            consoles(callback) {
                Console.find(callback);
            },
            genres(callback) {
                Genre.find(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            res.render("videogame_form", {
                title: "Add New Videogame",
                consoles: results.consoles,
                genres: results.genres,
                videogame: undefined,
            });
        }
    );
};

exports.videogame_create_post = [
    body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
    body("price", "Price is required").trim().isFloat({ min: 0 }).escape(),
    body("stock", "In-stock amount is required").trim().isInt({ min: 0 }).escape(),
    body("ESRB").escape(),
    body("releaseDate").optional({ checkFalsy: true }).isISO8601().toDate(),
    body("genre.*").escape(),
    body("console.*").escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        
        const videogame = new Videogame({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            ESRB: req.body.ESRB,
            releaseDate: req.body.releaseDate,
            genre: req.body.genre,
            console: req.body.console,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    consoles(callback) {
                        Console.find(callback);
                    },
                    genres(callback) {
                        Genre.find(callback);
                    },
                },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    // Mark genres and consoles as selected
                    for (const console of results.consoles) {
                        if (videogame.console.includes(console._id)) {
                            console.checked= "true";
                        }
                    }
                    for (const genre of results.genres) {
                        if (videogame.genre.includes(genre._id)) {
                            genre.checked = true;
                        }
                    }
                    res.render("videogame_form", {
                        title: "Add New Videogame",
                        consoles: results.consoles,
                        genres: results.genres,
                        videogame,
                        errors: errors.array(),
                    });
                }
            );
            return;
        }
        videogame.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(videogame.url);
        });
    },
];

exports.videogame_delete_get = function (req, res, next) {
    Videogame.findById(req.params.id).exec((err, videogame) => {
        if (err) {
            return next(err);
        }
        res.render("videogame_delete", {
            title: "Delete videogame: " + videogame.name,
            videogame: videogame
        });
    });
};

exports.videogame_delete_post = function (req, res, next) {
    Videogame.findByIdAndRemove(req.params.id).exec((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/inventory/videogames");
    });
};

exports.videogame_update_get = (req, res) => {
    res.send("Not implemented: videogame update get");
};

exports.videogame_update_post = (req, res) => {
    res.send("Not implemented: videogame update post");
};