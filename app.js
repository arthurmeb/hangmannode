//app.js
const express = require('express');
const app = express();
const cors = require('cors');


const schedule = require('node-schedule');
const { daily } = require('./imagesCycle');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8081',
        methods: ['GET', 'POST'],
    }
});

let index = 0;
let currentDaily = daily[index];
let ummm

const cycleDaily = () => {
    index++;
    newDaily = daily[index];
    console.log('Cycled daily. New daily is:', newDaily);

    // Emit the updated daily value to all connected clients
    io.emit('dailyUpdated', newDaily);
};


// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('idk', currentDaily);
});


// Send the first day's value ONCE when the server is first
io.emit('dayOne', currentDaily)

console.log('This is after io.emit...')

const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0';
eventTime.hour = 4;
eventTime.minute = 44;
eventTime.second = 55;

const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);

// Define API
app.use(cors({ origin: 'http://localhost:8081' }));
app.use(express.static('assets'));

app.get('/api/daily', (req, res) => {
    console.log('Data sent.', currentDaily);
    res.json(currentDaily);
});

console.log('First ever daily:', currentDaily)

const serverPort = process.env.PORT || 3000;

http.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
});

