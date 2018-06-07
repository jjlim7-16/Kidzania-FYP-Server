const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()
// Re-uses existing if already created, else creates a new one

const router = express.Router()
router.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true,
	parameterLimit: 100000
}))
router.use(bodyParser.json({
	limit: '50mb'
}))

router.options('*', cors())
router.use(cors())

router.route('/')
	.all((req, res, next) => {
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/plain')
		next() //Continue on to the next method -> .get(...)
	})
	.get((req, res) => {
		let sql = `Select * From booking_details`
		pool.getConnection(function(err, connection) {
			connection.query(sql, (err, rows) => {
				res.json(rows)
			})
		})
	})

router.post('/makeBooking', (req, res) => {
	let bookingData = JSON.parse(req.body.webFormData)
	let sql = 'INSERT INTO booking_details (session_id, booking_date, station_id, ' +
		'role_name, rfid, queue_no, booking_status) VALUES ?'
	let date = new Date()
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let bookingDetails_val = [bookingData.session_id, date, bookingData.stationId,
		bookingData.roleName, bookingData.rfid, bookingData.status
	]
	pool.getConnection(function(err, connection) {
		connection.query(sql, [bookingDetails_val], (err, rows) => {
			res.json(rows)
		})
	})
})


router.get('/:rfid', function (req, res) {
	    var rfid = req.params.rfid
	    let sql = 'SELECT bd.booking_details_id,bd.session_id, bd.booking_date, bd.station_id, bd.role_name, bd.rfid, bd.queue_no, bd.booking_status, s.station_name, ss.session_start,ss.session_end FROM booking_details bd inner join stations s on bd.station_id = s.station_id inner join sessions ss on bd.session_id = ss.session_id  where bd.rfid = ?'
	  	//database query havent filter by date
	    pool.getConnection (function(err, connection) {
	        connection.query(sql, rfid, (err, rows) => {
	            res.json(rows)
	        })
	    })
	});

module.exports = router
