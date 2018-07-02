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
stationRouter.options('*', cors())

const server = http.createServer(app)

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

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
	// seedData.seedSessions()
	// .then(() => {
	// 	seedData.seedAvailableSessions()
	// })
	console.log(`Server running at http://${hostname}:${port}`);
})