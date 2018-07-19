const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const socketIo = require('socket.io')
const axios = require('axios')
const os = require('os')
const router = express.Router()
router.use(bodyParser.json())

const seedData = require('./seedData')
const dashboard = require('./dashboard')
const limitRouter = require('../routes/limitRouter')
const sessionRouter = require('../routes/sessionRouter')
const bookingRouter = require('../routes/bookingRouter')
const stationRouter = require('../routes/stationRouter')
const roleRouter = require('../routes/roleRouter')
const printReceiptRouter = require('../routes/printReceiptRouter')
const dashboardRouter = require('../routes/dashboardRouter')

const hostname = os.networkInterfaces()['Wi-Fi'][1].address
const port = 8000

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use('/stations', stationRouter)
app.use('/roles', roleRouter)
app.use('/sessions', sessionRouter)
app.use('/bookings', bookingRouter)
app.use('/print',printReceiptRouter)
app.use('/dashboard', dashboardRouter)
app.use('/limit', limitRouter)
// stationRouter.options('*', cors())

const server = http.createServer(app)

const io = socketIo.listen(server)

const dashboardSocket = io.of('/dashboard')
const userSocket = io.of('/user')

dashboardSocket.on('connection', socket => {
	console.log('Socket Connected')

	dashboard.getBookingCount(socket)
	dashboard.getAvgBookings(socket)
	dashboard.getBookingByDay(socket)
	dashboard.getBookingByStation(socket)
	dashboard.getBookingByTime(socket)

	setInterval(function() {
		dashboard.getBookingCount(socket)
		dashboard.getAvgBookings(socket)
		dashboard.getBookingByDay(socket)
		dashboard.getBookingByStation(socket)
		dashboard.getBookingByTime(socket)
		// getBookingByDate(socket)
	}, 100000)

	socket.on("disconnect", () => console.log("Client disconnected"));
})

userSocket.on('connection', (socket) => {
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
	// console.log(os.networkInterfaces())
	console.log(os.hostname())
	console.log(`Server running at http://${hostname}:${port}`)
})
