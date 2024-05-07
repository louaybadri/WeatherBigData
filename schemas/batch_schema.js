require('dotenv').config()
const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    capital: String,
    average_temperature: Number,
});



module.exports = mongoose.model(process.env.MONGO_COLLECTION_BATCH, BatchSchema, process.env.MONGO_COLLECTION_BATCH);