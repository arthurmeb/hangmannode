// app.js
const express = require('express');
const cors = require('cors');
const { currentDaily } = require('./scheduleDaily');

const app = express();

console.log('Initial daily:', currentDaily)

app.use(cors({ origin: 'http://localhost:8081' }));

app.use(express.static('assets'));

app.get('/api/daily', (req, res) => {
    console.log('Data sent:', currentDaily);
    res.json(currentDaily);
});