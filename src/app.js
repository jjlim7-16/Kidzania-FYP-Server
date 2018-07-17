const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const socketIo = require('socket.io')
const axios = require('axios')
const router = express.Router()
router.use(bodyParser.json())

const seedData = require('./seedData')
const dashboard = require('./dashboard')
const limitRouter = require('../routes/limitRouter')
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
app.use('/limit', limitRouter)
// stationRouter.options('*', cors())

const server = http.createServer(app)

const io = socketIo.listen(server)

io.on('connection', socket => {
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

server.listen(port, hostname, () => {
	// seedData.seedSessions()
	// .then(() => {
	// 	seedData.seedAvailableSessions()
	// })
	axios.get('http://localhost:8000/dashboard/getBookingByTime')
	.then(res => {
		console.log(res.data)
	})
	console.log(`Server running at http://${hostname}:${port}`);
})
