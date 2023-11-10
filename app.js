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
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
    }
});


const filePath = path.join(__dirname, 'thedaily.json');


const cycleDaily = () => {

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const jsonDaily = JSON.parse(fileContent);
    let index = jsonDaily.day
    index++;
    newDaily = daily[index];
    console.log('Cycled daily. New daily is:', newDaily, 'Index is', index)

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

    const jsonDaily = JSON.parse(fileContent);

    console.log('Starting content is', jsonDaily)

    // Emit the data to the connected client

    socket.emit('idk', jsonDaily);

  } catch (error) {
    console.error('Error reading or parsing the file:', error);
};
})


const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0';
eventTime.hour = 6;
eventTime.minute = 55;
eventTime.second = 20;

const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);


app.use('/assets/promptImages', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    next();
  }, express.static('assets/promptImages'));


const serverPort = process.env.PORT || 3000;

http.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
});

