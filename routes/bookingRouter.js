const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')
const cors = require('cors')

const router = express.Router()
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 100000
}))
router.use(bodyParser.json({limit: '50mb'}))

router.options('*', cors())

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'kidzania_fyp',
  multipleStatements: true
})

connection.connect(function (err) {
  if (err) throw err
})

router.use(cors())

router.route('/')
  .all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next() //Continue on to the next method -> .get(...)
  })
  .get((req, res) => {
    let sql = `Select * From booking_details`
    connection.query(sql, function(err, results) {
      if (err) throw err
      res.json(results)
    })
  })

router.post('/makeBooking', (req, res) => {
  let bookingData = JSON.parse(req.body.webFormData)
  let sql = 'INSERT INTO booking_details (session_id, booking_date, station_id, ' +
    'role_name, rfid, queue_no, booking_status) VALUES ?'
  let date = new Date()
  date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
  let bookingDetails_val = [bookingData.session_id, date, bookingData.stationId, 
    bookingData.roleName, bookingData.rfid, bookingData.status]
  connection.query(sql, [bookingDetails_val], function(err, results, fields) {
    if (err) throw err
    res.json(results)
  })
})

module.exports = router