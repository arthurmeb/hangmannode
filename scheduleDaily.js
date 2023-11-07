const schedule = require('node-schedule')
const {daily} = require('./imagesCycle')


// prompt cycling function
let index = 0
let currentDaily = daily[index]

const cycleDaily = () => {
    index++
    currentDaily = daily[index]
    console.log('Cyled daily. New daily is:', currentDaily)
}

// Schedule the event to run every day at a specific time in GMT+0
const eventTime = new schedule.RecurrenceRule();
eventTime.tz = 'Etc/GMT-0'; // Set the timezone to GMT+0

// Set the time for the event (e.g., 12:00 AM GMT+0)
eventTime.hour = 0;
eventTime.minute = 0;
eventTime.second = 0;

// Schedule the event
const scheduledEvent = schedule.scheduleJob(eventTime, cycleDaily);

module.exports = {schedule, currentDaily, cycleDaily, eventTime, scheduledEvent, index}