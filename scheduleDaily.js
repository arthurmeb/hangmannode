// scheduleDaily.js
const schedule = require('node-schedule');
const { daily } = require('./imagesCycle');
const {io} = require('./server');

let index = 0;
let currentDaily = daily[index];

const cycleDaily = () => {
    index++;
    currentDaily = daily[index];
    console.log('Cycled daily. New daily is:', currentDaily);
    io.emit('dailyUpdated', currentDaily)
};

const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0';
eventTime.hour = 1;
eventTime.minute = 45;
eventTime.second = 10;

const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);

module.exports = { currentDaily, cycleDaily, eventTime, scheduledEvent, index };
