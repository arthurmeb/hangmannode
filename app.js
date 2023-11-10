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

const cycleDaily = () => {
    index++;
    currentDaily = daily[index];
    console.log('Cycled daily. New daily is:', currentDaily);

    // Emit the updated daily value to all connected clients
    io.emit('dailyUpdated', currentDaily);
};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Optionally, you can emit the current daily value when a user connects
    socket.emit('dailyUpdated', currentDaily);
});


const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0';
eventTime.hour = 1;
eventTime.minute = 57;
eventTime.second = 55;

const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);

// Define API
app.use(cors({ origin: 'http://localhost:8081' }));
app.use(express.static('assets'));

app.get('/api/daily', (req, res) => {
    console.log('Data sent.', currentDaily);
    res.json(currentDaily);
});

console.log('Initial daily:', currentDaily)

const serverPort = process.env.PORT || 3000;

http.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
});
