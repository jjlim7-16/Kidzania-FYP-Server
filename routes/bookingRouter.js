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
		let sql = `Select booking_id, b.session_date, se.session_start, se.session_end, st.station_name,
		sr.role_name From booking_details b, sessions se, stations st, station_roles sr
		where b.session_id = se.session_id and b.station_id = st.station_id and
		st.station_id = sr.station_id and sr.role_id = b.role_id`
		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then((rows) => {
					res.json(rows)
				})
				.catch(err => {
					res.statusMessage = err
					res.status(400).end(err.code)
				})
			connection.release()
		})
	})

router.route('/getBookingDetails')
	.all((req, res, next) => {
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/plain')
		next() //Continue on to the next method -> .get(...)
	})
	.get((req, res) => {
		let sql = `Select booking_id, b.session_date, se.session_start, se.session_end, st.station_name,
	sr.role_name, queue_no From booking_details b, sessions se, stations st, station_roles sr
	where b.session_id = se.session_id and b.station_id = st.station_id and
	st.station_id = sr.station_id and sr.role_id = b.role_id and session_date = current_date()
	and booking_status = 'Confirmed' and b.station_id = ?`

		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then((rows) => {
					res.json(rows)
				})
				.catch(err => {
					res.statusMessage = err
					res.status(400).end(err.code)
				})
			connection.release()
		})
	})

router.post('/makeBooking', (req, res) => {
	let sql = 'SELECT COUNT(booking_id) AS qNum FROM booking_details'
	let bookingData = req.body
	console.log(bookingData)
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then((rows) => {
				let qNum = parseInt(rows[0].qNum) + 1
				sql = 'INSERT INTO booking_details (session_id, session_date, station_id, ' +
					'role_id, rfid, queue_no, booking_status) VALUES ?'
				let date = new Date()
				date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				let bookingDetails_val = [parseInt(bookingData.session_id), date, parseInt(bookingData.station_id),
					bookingData.role_id, bookingData.rfid, qNum, bookingData.status
				]
				return connection.query(sql, [
					[bookingDetails_val]
				])
			})
			.then((rows) => {
				sql = 'UPDATE available_sessions SET noBooked = noBooked+1 WHERE session_id = ' + bookingData.session_id
				return connection.query(sql)
			})
			.then((rows) => {
				res.status(200).end()
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
		connection.release()
	})
})

router.get('/:rfid', function(req, res) {
	var rfid = req.params.rfid
	let sql = 'SELECT bd.booking_id,bd.session_id, bd.session_date, bd.station_id, bd.role_id, ' +
		'bd.rfid, bd.queue_no, bd.booking_status, s.station_name, ss.session_start,ss.session_end ' +
		'FROM booking_details bd inner join stations s on bd.station_id = s.station_id ' +
		'inner join sessions ss on bd.session_id = ss.session_id where bd.rfid = ? ' +
		'AND session_date=current_date();'
	//database query havent filter by date
	pool.getConnection().then(function(connection) {
		connection.query(sql, rfid)
			.then((rows) => {
				console.log(rows)
				rows[0].session_start = moment(rows[0].session_start, 'HH:mm:ss').format('LT')
				rows[0].session_end = moment(rows[0].session_end, 'HH:mm:ss').format('LT')
				res.json(rows)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end()
			})
		connection.release()
	})
})

module.exports = router