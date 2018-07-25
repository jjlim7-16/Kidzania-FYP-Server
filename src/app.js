const express = require('express')
const session = require('express-session')
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const axios = require('axios')
const os = require('os')
const passport = require('passport');
const passportConfig = require('./passportConfig')
const CookieParser = require('cookie-parser')
const flash = require('flash')
const router = express.Router()
router.use(bodyParser.json())

require('./passport')

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
const auth = require('./auth')

// const hostname = os.networkInterfaces()['Wi-Fi'][1].address
// const hostname = '25.37.100.106'
const hostname = 'localhost'
const port = 8000

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(CookieParser())
app.use('/auth', auth)
app.use('/stations', stationRouter)
app.use('/roles', roleRouter)
app.use('/sessions', sessionRouter)
app.use('/bookings', bookingRouter)
// app.use('/print',printReceiptRouter)
app.use('/user', accountRouter)
app.use('/dashboard', dashboardRouter)
app.use('/user', accountRouter)
app.use('/limit', limitRouter)
// stationRouter.options('*', cors())

// passportConfig(passport)

// app.use(session({
// 	secret: 'SECRET',
// 	name:'cookie',
// 	resave: false,
// 	saveUninitialized:false
// 	// cookie:{
// 	// 	httponly, //put here some values
// 	// 	maxAge,
// 	// 	secure
// 	// }
// }))
app.use(passport.initialize())
app.use(passport.session())
// app.use(flash())

// app.post('/signup', passport.authenticate('local-signup'))

// app.post('/login', passport.authenticate('local-login'), (req, res) =>{
// 	console.log(req.session.passport.user)
// 	if (!req.session.passport.user) {
// 		res.status(401).end()
// 	}
// 	res.status(200).end()
// })

// app.get('/logout', (req, res) => {
// 	req.logout()
// 	return res.json({status:'success'})
// })

const server = http.createServer(app)

const io = socketIo.listen(server)

const dashboardSocket = io.of('/dashboard')
const userSocket = io.of('/user')

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

	socket.on("disconnect", () => console.log("Client disconnected"));
})

userSocket.on('connection', (socket) => {
	console.log('New client connected')
	socket.on('disconnect', () => console.log('Client disconnected'));
	socket.on('makeBooking', (session_id) => {
		console.log('A new booking is being made')
		socket.broadcast.emit('newSlotBooked', session_id)
	})
})

server.listen(port, hostname, () => {
	// seedData.seedSessions()
	// .then(() => {
	// 	seedData.seedAvailableSessions()
	// })
	console.log(`Server running at http://${hostname}:${port}`);
})
