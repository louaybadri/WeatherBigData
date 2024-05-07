const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const WeatherStream = require('./schemas/stream.schema');
const BatchSchema = require('./schemas/batch_schema');
require('dotenv').config()
const cors = require('cors');
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// kill all old connections io

io.sockets.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});


// enable cors


// mongoose.connect(process.env.MONGO_URI, {
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
});



async function watchData() {

    try {
        const data = await WeatherStream.watch();
        data.on('change', (change) => {
            console.log("data changed at " + new Date());
            io.emit('dataChange', change);
        });

    } catch (error) {

        io.emit('dataChange', error);
    };
}



async function findLastData() {
    const data = await WeatherStream.findOne({}, {}, { sort: { latest_date: -1 } });
    return data;
}
async function getAll(isStream) {
    const data = isStream ? await WeatherStream.find() : await BatchSchema.find();
    return data;
}
watchData();

app.get('/', async (req, res) => {

    const data = await findLastData()
    console.log(data);
    res.send('Hello World!');

});


app.get('/stream/all', async (req, res) => {

    const data = await getAll(true)
    if (data) {
        res.send({
            success: true,
            value: data
        });
    }
    else {
        res.send({
            success: false
        });
    }

});

app.get('/batch/all', async (req, res) => {

    const data = await getAll(false)
    if (data) {
        res.send({
            success: true,
            value: data
        });
    }
    else {
        res.send({
            success: false
        });
    }

});


server.listen(3005, () => {
    console.log('Server is running on port 3000');
});

module.exports = { watchData, findLastData };
