const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const zerofill = require('zero-fill')
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
		where b.session_id = se.session_id and b.station_id = st.station_id and b.session_date=current_date() and
		st.station_id = sr.station_id and sr.role_id = b.role_id;`
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

router.get('/:bookingID', function(req, res) {
	var bookingID = parseInt(req.params.bookingID)
	let sql = `Select booking_id, b.session_date, se.session_start, se.session_end, st.station_name,
		sr.role_name From booking_details b, sessions se, stations st, station_roles sr
		where b.session_id = se.session_id and b.station_id = st.station_id and
		st.station_id = sr.station_id and sr.role_id = b.role_id and booking_id = ? `
	pool.getConnection().then(function(connection) {
		connection.query(sql, bookingID)
			.then((rows) => {
				res.json(rows)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end()
			})
		connection.release()
	})
})

router.put('/updateStatus/:bookingID', (req, res) => {
	var bookingID = parseInt(req.params.bookingID)
	let bookingData = req.body;
	console.log(bookingData)
	console.log(req.body)

	let sql = `update booking_details set booking_status =?, time_in = ? where booking_id = ?`
	let val = [bookingData.booking_status, bookingData.time_in, bookingID]
	pool.getConnection().then(function(connection) {
		connection.query(sql, val)
			.then((rows) => {
				// console.log(rows)
				res.end('Success')
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
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
		and booking_status != 'Cancelled' and b.station_id = ?`

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
	let sql = `SELECT COUNT(booking_id) AS qNum FROM booking_details WHERE session_date=current_date();`
	let bookingData = req.body
	let qNum = ''
	console.log(bookingData)
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then((rows) => {
				qNum = parseInt(rows[0].qNum) + 1
				let alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
				qNum = alphas.charAt(parseInt(bookingData.station_id - 1)) + zerofill(4, qNum)
				sql = `INSERT INTO booking_details (session_id, session_date, station_id,
					role_id, rfid, queue_no, booking_status) VALUES ?`
				let date = new Date()
				date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				let bookingDetails_val = [parseInt(bookingData.session_id), date, parseInt(bookingData.station_id),
					bookingData.role_id, bookingData.rfid, qNum, bookingData.status
				]
				return connection.query(sql, [
					[bookingDetails_val]
				])
			})
			.then(() => {
				console.log(qNum)
				res.json({
					queue_no: qNum
				})
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
		connection.release()
	})
})

router.put('/cancelBooking', (req, res) => {
	let details = req.body
	let sql = `UPDATE booking_details SET booking_status = ? WHERE session_id = ? AND rfid = ?`
	let val = [details.status, parseInt(details.session_id), details.rfid]
	pool.getConnection().then(function(connection) {
		connection.query(sql, val)
			.then((rows) => {
				res.json(rows)
				res.status(200).end()
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
		connection.release()
	})
})

router.get('/rfid/:rfid', function(req, res) {
	let rfid = req.params.rfid
	let sql = `SELECT bd.booking_id,sr.role_name,bd.session_id, bd.session_date, bd.station_id, bd.role_id,
	bd.rfid, bd.queue_no, bd.booking_status, s.station_name, ss.session_start, ss.session_end
	FROM booking_details bd inner join stations s on bd.station_id = s.station_id
	inner join sessions ss on bd.session_id = ss.session_id
	inner join station_roles sr on bd.role_id = sr.role_id
	where bd.rfid = ? AND session_date=current_date()`

	pool.getConnection().then(function(connection) {
		connection.query(sql, rfid)
			.then((rows) => {
				if (rows.length > 0) {
					for (let row of rows) {
						row.session_start = moment(row.session_start, 'HH:mm:ss').format('LT')
						row.session_end = moment(row.session_end, 'HH:mm:ss').format('LT')
					}
				}
				res.json(rows)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end()
			})
		connection.release()
	})
})

router.get('/getbookinglist/:stationId', function(req, res) {
	var stationidStr = req.params.stationId
	let stationid = parseInt(stationidStr)
	let sql = `SELECT b.booking_id,ase.session_id,s.station_name, ase.session_date, sr.role_name,b.time_in, se.session_start, se.session_end,  b.booking_status, b.rfid,b.queue_no
  FROM booking_details b, available_sessions ase, sessions se, station_roles sr, stations s
  WHERE b.session_date = ase.session_date AND
  b.session_id = ase.session_id AND
  se.session_id = ase.session_id AND
  b.role_id = sr.role_id AND
  b.booking_status != "Cancelled" AND
  b.station_id = s.station_id AND
  ase.session_date = current_date() AND
  se.session_start = (SELECT distinct session_start FROM sessions s
  WHERE station_id = ? AND ADDTIME(current_time(), '0:5:00') >= session_start
  AND ADDTIME(current_time(), '0:5:00') < s.session_end)`;
	pool.getConnection().then(function(connection) {
		connection.query(sql, stationid)
			.then((rows) => {
				res.json(rows)
			})
		connection.release()
	})
})

module.exports = router