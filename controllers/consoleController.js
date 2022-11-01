const Console = require("../models/console");
const Videogame = require("../models/videogame");

const async = require('async');

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
    res.send("Not Implemented: console create get");
};

exports.console_create_post = (req, res) => {
    res.send("Not Implemented: console create post");
};

exports.console_delete_get = (req, res) => {
    res.send("Not Implemented: console delete get");
};

exports.console_delete_post = (req, res) => {
    res.send("Not Implemented: console delete post");
};

exports.console_update_get = (req, res) => {
    res.send("Not Implemented: console update get");
};

exports.console_update_post = (req, res) => {
    res.send("Not Implemented: console update post");
};