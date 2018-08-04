const express = require('express')
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const axios = require('axios')
const os = require('os')
const passport = require('passport')
const CookieParser = require('cookie-parser')
const router = express.Router()
router.use(bodyParser.json())

require('./passport')

const {
	requireRole
} = require('../middleware/requireRole')
const seedData = require('./seedData')
const dashboard = require('./dashboard')
const limitRouter = require('../routes/limitRouter')
const sessionRouter = require('../routes/sessionRouter')
const bookingRouter = require('../routes/bookingRouter')
const stationRouter = require('../routes/stationRouter')
const roleRouter = require('../routes/roleRouter')
const accountRouter = require('../routes/accountRouter')
const printReceiptRouter = require('../routes/printReceiptRouter')
const dashboardRouter = require('../routes/dashboardRouter')
const reservationRouter = require('../routes/reservationRouter')
const auth = require('./auth')

const hostname = require('./config').hostname
const port = 8000

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(CookieParser())
app.use('/auth', auth)
app.use(passport.initialize())

app.use('/stations', requireRole(['Guest', 'Crew', 'Admin']), passport.authenticate('jwt', {
	session: false
}), stationRouter)

app.use('/roles', requireRole(['Guest', 'Crew', 'Admin']), passport.authenticate('jwt', {
	session: false
}), roleRouter)

app.use('/sessions', requireRole(['Guest', 'Crew', 'Admin']), passport.authenticate('jwt', {
	session: false
}), sessionRouter)

app.use('/bookings', requireRole(['Guest', 'Crew', 'Admin']), passport.authenticate('jwt', {
	session: false
}), bookingRouter)

// app.use('/print',printReceiptRouter)
app.use('/user', requireRole(['Crew', 'Admin']), passport.authenticate('jwt', {
	session: false
}), accountRouter)

app.use('/dashboard', dashboardRouter)

app.use('/limit', requireRole(['Admin']), passport.authenticate('jwt', {
	session: false
}), limitRouter)

app.use('/reservations', requireRole(['Admin']), passport.authenticate('jwt', {
	session: false
}), reservationRouter)



// Error handling
app.use(function(error, request, response, next) {
	if (!error) {
		return next()
	}
	response.send(error.msg, error.errorCode)
})

const server = http.createServer(app)

const io = socketIo.listen(server)

const dashboardSocket = io.of('/dashboard')
const userSocket = io.of('/user')
const crewSocket = io.of('/crew')

dashboardSocket.on('connection', socket => {
	console.log('New Admin Connected')

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
	}, 100000)

	socket.on("disconnect", () => console.log("Admin client disconnected"));
})

userSocket.on('connection', (socket) => {
	console.log('New client connected')
	socket.on('disconnect', () => console.log('Client disconnected'));
	socket.on('makeBooking', (session_id) => {
		console.log('A new booking is being made')
		socket.broadcast.emit('newSlotBooked', session_id)
	})
})

crewSocket.on('connection', (socket) => {
	console.log('New Crew Connected')
	socket.on('disconnect', () => console.log('Client disconnected'))
	socket.on('admitted', (booking_id) => {
		console.log('New visitor admitted')
		socket.broadcast.emit('newAdmission', booking_id)
	})
})

server.listen(port, hostname, () => {
	seedData.seedSessions()
		.then(() => {
			seedData.seedAvailableSessions()
		})
	console.log(`Server running at http://${hostname}:${port}`);
})