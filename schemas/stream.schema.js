require('dotenv').config()
const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
    capital: String,
    max_temp: Number,
    latest_date: String
});



module.exports = mongoose.model(process.env.MONGO_COLLECTION_STREAM, StreamSchema, process.env.MONGO_COLLECTION_STREAM);