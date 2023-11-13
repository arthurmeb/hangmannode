//app.js
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');



const schedule = require('node-schedule');
// Grab daily object from imagesCycle.js
const { daily } = require('./imagesCycle');
const http = require('http').createServer(app);
// Configure socketio with cors for images and server client communiation
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
    }
});

// Define filepath where the daily will be written to and read from (impromptu database)

const filePath = path.join(__dirname, 'thedaily.json');

// Define function to cycle each daily

const cycleDaily = () => {

        // Read the file's content and wrap in variable

    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Create a javascript object from the json string

    const jsonDaily = JSON.parse(fileContent);

    // Take the current daily's day value and use it as an index for which day of the cycle we are on. [critical for cycling]

    let index = jsonDaily.day
    index++;
    newDaily = daily[index];
    console.log('Cycled daily. New daily is:', newDaily, 'Index is', index)

    // Create json string from the new daily object and write it to the daily file

    const jsonString = JSON.stringify(newDaily, null, 2); // The third argument (2) is for indentation
    fs.writeFileSync(filePath, jsonString, 'utf8');

    console.log('File updated with newDaily:', jsonString);

    // Emit the updated daily value to all connected clients

    io.emit('dailyUpdated', jsonString);
};


// Socket.io when a client connects

io.on('connection', (socket) => {
    console.log('A user connected');
    
  try {
    // Read the JavaScript file and parse its content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const jsonDaily = JSON.parse(fileContent);

    console.log('Starting content is', jsonDaily)

    // Emit the data to the connected client so they know the current daily

    socket.emit('idk', jsonDaily);

  } catch (error) {
    console.error('Error reading or parsing the file:', error);
};
})

// Define the time at which daily should cycle

const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0';
eventTime.hour = 0;
eventTime.minute = 0;
eventTime.second = 0;

// Run schedule event at midnight everyday to trigger daily cycle

const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);

// Allow promptImages folder to serve static files to client

app.use('/assets/promptImages', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    next();
  }, express.static('assets/promptImages'));


const serverPort = process.env.PORT || 3000;

http.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
});

