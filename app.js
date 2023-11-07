const express = require('express')
const app = express()
const {daily} = require('./imagesCycle')
const cors = require('cors')
const { cycleDaily, currentDaily, scheduledEvent, eventTime, index } = require('./scheduleDaily')


app.use(cors({origin: 'http://localhost:8080'}))



app.listen(3000)
console.log( 'Initial daily is:', currentDaily)
scheduledEvent
cycleDaily()
