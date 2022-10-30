const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { DateTime } = require('luxon');

const VideogameSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    ESRB: { type: String, required: true, enum: ["E", "E10+", "T", "M"], default: "E" },
    releaseDate: { type: Date },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre"}],
    console: [{ type: Schema.Types.ObjectId, ref: "Console"}],
});

VideogameSchema.virtual("url").get(function () {
    return `/inventory/videogame/${ this._id }`;
});

VideogameSchema.virtual("release_date_formatted").get(function () {
    return DateTime.fromJSDate(this.releaseDate).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Videogame", VideogameSchema);