const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const router = express.Router()
router.use(bodyParser.json())

const stationRouter = require('../routes/stationRouter')
const hostname = 'localhost'
const port = 8000;

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use('/stations', stationRouter)
stationRouter.options('*', cors())

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "kidzania_fyp"
})

/*
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})