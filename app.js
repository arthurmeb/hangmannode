//app.js
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');



const schedule = require('node-schedule');
const { daily } = require('./imagesCycle');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8081',
        methods: ['GET', 'POST'],
    }
});


const filePath = path.join(__dirname, 'thedaily.json');



let index = 0;
let currentDaily = daily[index];

const cycleDaily = () => {

    index++;
    newDaily = daily[index];
    console.log('Cycled daily. New daily is:', newDaily);

    const jsonString = JSON.stringify(newDaily, null, 2); // The third argument (2) is for indentation
    fs.writeFileSync(filePath, jsonString, 'utf8');

    console.log('File updated with newDaily:', jsonString);
    // Emit the updated daily value to all connected clients
    io.emit('dailyUpdated', jsonString);
};


// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
  try {
    // Read the JavaScript file and parse its content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    console.log('File content is', fileContent)

    const jsonDaily = JSON.parse(fileContent);

    console.log('Json content is', jsonDaily)

    // Emit the data to the connected client

    socket.emit('idk', jsonDaily);

  } catch (error) {
    console.error('Error reading or parsing the file:', error);
};
})

// setInterval(() => {cycleDaily()}, 5000)


const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0';
eventTime.hour = 6;
eventTime.minute = 42;
eventTime.second = 20;

const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);

// Define API
app.use(cors({ origin: 'http://localhost:8081' }));
app.use(express.static('assets'));

app.get('/api/daily', (req, res) => {
    console.log('Data sent.', currentDaily);
    res.json(currentDaily);
});

const serverPort = process.env.PORT || 3000;

http.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
});

