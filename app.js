const express = require('express')
const app = express()
const cors = require('cors')
const {currentDaily } = require('./scheduleDaily')

// Define API

app.use(cors({ origin: 'http://localhost:8081' }))

app.use(express.static('assets'))

app.get('/api/daily', (req, res) => {
    console.log('Data sent.', currentDaily)
    res.json(currentDaily)
})

console.log('Initial daily is:', currentDaily)

const serverPort = process.env.PORT || 3000

app.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
  })


