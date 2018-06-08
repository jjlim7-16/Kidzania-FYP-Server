const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const moment = require('moment')
const router = express.Router()
router.use(bodyParser.json())

const seedData = require('./seedData')
const sessionRouter = require('../routes/sessionRouter')
const bookingRouter = require('../routes/bookingRouter')
const stationRouter = require('../routes/stationRouter')
const roleRouter = require('../routes/roleRouter')
const hostname = 'localhost'
const port = 8000;

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use('/stations', stationRouter)
app.use('/roles', roleRouter)
app.use('/sessions', sessionRouter)
app.use('/bookings', bookingRouter)
stationRouter.options('*', cors())

const server = http.createServer(app);

server.listen(port, hostname, () => {
	// seedData.seedSessions()
	seedData.seedAvailableSessions()
	console.log(`Server running at http://${hostname}:${port}`);
})