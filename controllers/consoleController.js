const Console = require("../models/console");
const Videogame = require("../models/videogame");

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.console_list = function(req, res, next) {
    Console.find({}, "name stock").sort({ name: 1 }).exec((err, results) => {
        if (err) {
            return next(err);
        }
        res.render("console_list", {
            title: "Console List",
            console_list: results,
        });
    });
};

exports.console_detail = function (req, res, next) {
    async.parallel(
        {
            console(callback) {
                Console.findById(req.params.id).exec(callback);
            },
            console_games(callback) {
                Videogame.find({ console: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.console == null) {
                const err = new Error("Console not found");
                err.status = 404;
                return next(err);
            }
            res.render("console_detail", {
                title: results.console.name,
                console: results.console,
                videogame_list: results.console_games,
            });
        }
    );
};

exports.console_create_get = (req, res) => {
    res.render("console_form", {
        title: "Add Console",
        console: undefined
    });
};

exports.console_create_post = [
    body("name", "Name is required").trim().isLength({ min: 0 }).escape(),
    body("releaseYear", "Release Year is required").trim().isLength({ min: 4, max: 4}).escape(),
    body("price", "Price is required").trim().isFloat({ min: 0 }).escape(),
    body("stock", "In stock amount is required").trim().isInt({ min: 0 }).escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);

        const console = new Console ({
            name: req.body.name,
            releaseYear: req.body.releaseYear,
            price: req.body.price,
            stock: req.body.stock,
        });

        if(!errors.isEmpty()) {
            res.render("console_form", {
                title: "Add Console",
                console: console
            });
            return; 
        }

        console.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(console.url);
        });
    },
]

exports.console_delete_get = function (req, res, next) {
    async.parallel(
        {
            console(callback) {
                Console.findById(req.params.id).exec(callback);
            },
            console_games(callback) {
                Videogame.find({ console: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            res.render("console_delete", {
                title: "Delete console: " + results.console.name,
                console: results.console,
                videogame_list: results.console_games,
            });
        }
    );
};

exports.console_delete_post = (req, res, next) => {
    async.parallel(
        {
            console(callback) {
                Console.findById(req.body.consoleid).exec(callback);
            },
            console_games(callback) {
                Videogame.find({ console: req.body.consoleid }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            if(results.console_games.length > 0) {
                res.render("console_delete", {
                    title: "Delete console: " + results.console.name,
                    console: results.console,
                    videogame_list: results.console_games,
                });
                return;
            }

            Console.findByIdAndRemove(req.body.consoleid, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/inventory/consoles")
            });
        }
    );
};

exports.console_update_get = (req, res) => {
    Console.findById(req.params.id).exec((err, console) => {
        if (err) {
            return next(err);
        }
        res.render("console_form", {
            title: "Update Console",
            console: console,
        });
    });
};

exports.console_update_post = [
    body("name", "Name is required").trim().isLength({ min: 0 }).escape(),
    body("releaseYear", "Release Year is required").trim().isLength({ min: 4, max: 4}).escape(),
    body("price", "Price is required").trim().isFloat({ min: 0 }).escape(),
    body("stock", "In stock amount is required").trim().isInt({ min: 0 }).escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);

        const console = new Console ({
            name: req.body.name,
            releaseYear: req.body.releaseYear,
            price: req.body.price,
            stock: req.body.stock,
            _id: req.params.id,
        });

        if(!errors.isEmpty()) {
            res.render("console_form", {
                title: "Update Console",
                console: console
            });
            return; 
        }

        Console.findByIdAndUpdate(req.params.id, console, {}, ((err, theconsole) => {
            if (err) {
                return next(err);
            }
            res.redirect(theconsole.url);
        }));
    },
]