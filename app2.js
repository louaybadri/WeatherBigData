const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const WeatherStream = require('./schemas/stream.schema');

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


mongoose.connect('mongodb+srv://admin:1234@cluster0.iunwbji.mongodb.net/bigdata', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
});



async function watchData() {

    const data = await WeatherStream.watch();
    data.on('change', (change) => {
        io.emit('dataChange', change);
    });

}

async function findLastData() {
    const data = await WeatherStream.findOne({}, {}, { sort: { latest_date: -1 } });
    return data;
}
async function getAll() {
    const data = await WeatherStream.find({});
    return data;
}
watchData();

app.get('/', async (req, res) => {

    const data = await findLastData()
    console.log(data);
    res.send('Hello World!');

});


app.get('/all', async (req, res) => {

    const data = await getAll()
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
