
const mongoose = require('mongoose');
const WeatherStream = require('../schemas/');

async function watchData() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const data = await WeatherStream.watch();
    data.on('change', (change) => {
        console.log(change.fullDocument);
    });
}

async function findLastData() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const data = await WeatherStream.findOne({}, {}, { sort: { latest_date: -1 } });
    return data;
}

module.exports = { watchData, findLastData };
