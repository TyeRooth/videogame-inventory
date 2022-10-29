const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VideogameSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    ESRB: { type: String, required: true, enum: ["E", "E10+", "T", "M"], default: "E" },
    releaseDate: { type: Date },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre "}],
    console: [{ type: Schema.Types.ObjectId, ref: "Console"}],
});

VideogameSchema.virtual("url").get(function () {
    return `/inventory/videogame/${ this._id }`;
});

module.exports = mongoose.model("Videogame", VideogameSchema);