const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConsoleSchema = new Schema ({
    name: { type: String, required: true, maxLength: 100 },
    releaseYear: { type: String, required: true, maxLength: 4 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
});

ConsoleSchema.virtual("url").get(function () {
    return `/inventory/console/${ this._id }`;
});

module.exports = mongoose.model("Console", ConsoleSchema);