const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const socketIo = require('socket.io')
const router = express.Router()
router.use(bodyParser.json())

const seedData = require('./seedData')
const sessionRouter = require('../routes/sessionRouter')
const bookingRouter = require('../routes/bookingRouter')
const stationRouter = require('../routes/stationRouter')
const roleRouter = require('../routes/roleRouter')
const dashboardRouter = require('../routes/dashboardRouter')
const hostname = 'localhost'
const port = 8000

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use('/stations', stationRouter)
app.use('/roles', roleRouter)
app.use('/sessions', sessionRouter)
app.use('/bookings', bookingRouter)
app.use('/dashboard', dashboardRouter)
// stationRouter.options('*', cors())

const server = http.createServer(app)

const io = socketIo(server)

io.on('connection', (socket) => {
	console.log('New client connected')
	socket.on('disconnect', () => console.log('Client disconnected'));
	socket.on('makeBooking', (session_id) => {
		console.log('A new booking has been made')
		socket.broadcast.emit('newSlotBooked', session_id)
	})
})

server.listen(port, hostname, () => {
	seedData.seedSessions()
		.then(() => {
			seedData.seedAvailableSessions()
		})
	console.log(`Server running at http://${hostname}:${port}`);
})