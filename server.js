// server.js
const http = require('http');
const socketIo = require('socket.io');
const expressApp = require('./app'); // Renamed to expressApp

// Create an HTTP server for Express
const expressServer = http.createServer(expressApp);

// Create a separate server for Socket.io
const ioServer = http.createServer();

// Attach Socket.io to the new server
const io = socketIo(ioServer, {
    cors: {
        origin: 'http://localhost:8081', // Adjust this to your frontend origin
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    // Handle Socket.io events here if needed
    console.log('A user connected');
});

// Listen on different ports for Express and Socket.io
const expressPort = process.env.PORT || 3000;
const ioPort = 3001;

expressServer.listen(expressPort, () => {
    console.log(`Express server is listening on port ${expressPort}`);
});

ioServer.listen(ioPort, () => {
    console.log(`Socket.io server is listening on port ${ioPort}`);
});

module.exports = {io}