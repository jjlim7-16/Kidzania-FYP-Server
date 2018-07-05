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
const printReceiptRouter = require('../routes/printReceiptRouter')
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
app.use('/print',printReceiptRouter)
app.use('/dashboard', dashboardRouter)
// stationRouter.options('*', cors())

const server = http.createServer(app)

// const io = socketIo(server)

// io.on("connection", socket => {
// 	console.log("New client connected"), setInterval(
// 		() => getApiAndEmit(socket),
// 		10000
// 	);
// 	socket.on("disconnect", () => console.log("Client disconnected"));
// })

// const getApiAndEmit = async socket => {
// 	try {
// 		const res = await axios.get(
// 			"https://api.darksky.net/forecast/PUT_YOUR_API_KEY_HERE/43.7695,11.2558"
// 		);
// 		socket.emit("FromAPI", res.data.currently.temperature);
// 	} catch (error) {
// 		console.error(`Error: ${error.code}`);
// 	}
// }

server.listen(port, hostname, () => {
	seedData.seedSessions()
	.then(() => {
		seedData.seedAvailableSessions()
	})
	console.log(`Server running at http://${hostname}:${port}`);
})