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
	let sql = 'SELECT COUNT(booking_details_id) AS qNum FROM booking_details'
	let bookingData = req.body
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then((rows) => {
				let qNum = parseInt(rows[0].qNum) + 1
				sql = 'INSERT INTO booking_details (session_id, booking_date, station_id, ' +
					'role_name, rfid, queue_no, booking_status) VALUES ?'
				let date = new Date()
				date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				let bookingDetails_val = [parseInt(bookingData.session_id), date, parseInt(bookingData.station_id),
					bookingData.role_name, bookingData.rfid, qNum, bookingData.status
				]
				return connection.query(sql, [
					[bookingDetails_val]
				])
			})
			.then((rows) => {
				res.status(200)
			})
			.catch((err) => {
				console.log(err)
			})
	})
})

module.exports = router