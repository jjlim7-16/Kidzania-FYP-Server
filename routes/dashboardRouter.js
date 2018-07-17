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

router.route('/count')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = 'SELECT COUNT(station_id) as count FROM booking_details WHERE session_date=current_date();'
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				res.json(results[0].count)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

router.get('/getAvgBookings', (req, res) => {
	let sql = `SELECT FORMAT(SUM(bookings)/COUNT(rfid), 1) as avg_bookings 
	FROM (SELECT rfid, COUNT(*) as bookings FROM booking_details b 
	WHERE booking_status='Confirmed' AND session_date=current_date() 
	GROUP BY rfid) x;`
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				if (!results[0].avg_bookings) {
					res.json(0.0.toFixed(1))
				}
				else {
					res.json(results[0].avg_bookings.toFixed(1))
				}
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

router.get('/getBookingByDay', (req, res) => {
	let sql = `SELECT WEEKDAY(session_date) as weekday, FORMAT(COUNT(*)/noOfDays, 1) as total_per_day 
	FROM booking_details b INNER JOIN (SELECT WEEKDAY(session_date) as weekday, COUNT(*) as noOfDays 
	FROM (SELECT DISTINCT session_date FROM booking_details WHERE booking_status = 'Confirmed') a
	GROUP BY WEEKDAY(session_date)) b2 ON b2.weekday = WEEKDAY(session_date)
	WHERE booking_status = 'Confirmed' GROUP BY weekday;`

	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				// res.json(results)
				let data = [0, 0, 0, 0, 0, 0, 0]
				for(var i in results) {
					data[results[i].weekday] = results[i].total_per_day
				}
				res.json(data)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

router.get('/getBookingByDate', (req, res) => {
	let sql = `SELECT session_date, COUNT(*) as count FROM booking_details b
		WHERE booking_status='Confirmed' GROUP BY session_date;`
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				// res.json(results)
				console.log(results)
				res.json(results)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

router.get('/getBookingByStation', (req, res) => {
	let sql = `SELECT st.station_name, count(*) as station_count 
	FROM booking_details b, stations st, station_roles sr 
	WHERE b.station_id = st.station_id AND b.role_id = sr.role_id AND booking_status='Confirmed' 
	GROUP BY st.station_name;`

	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				let data = { stations: [], data: [] }
				for (var i in results) {
					data['stations'].push(results[i].station_name)
					data['data'].push(results[i].station_count)
				}
				res.json(data)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

router.get('/getBookingByTime', (req, res) => {
	let sql = `SELECT st.station_name, session_start as x, FORMAT(COUNT(b.booking_id)/capacity * 100, 1) as y
	FROM (SELECT * FROM booking_details WHERE booking_status='Confirmed' AND session_date = '2018-07-03') b
	RIGHT JOIN sessions s ON s.session_id = b.session_id
	RIGHT JOIN stations st ON s.station_id = st.station_id
	WHERE st.station_name = 'Pizza Hut'
	GROUP BY b.session_date, session_start, st.station_id ORDER BY 1 ASC;`
	
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				// if (results.length === 0) {
				// 	res.json(0)
				// }
				// else {
				// 	res.json(results[0].count)
				// }
				// let data = {}
				// for (i in results) {
				// 	if (!data[results[i].station_name]) {
				// 		data[results[i].station_name] = []
				// 	}
				// 	data[results[i].station_name].push({
				// 		x: results[i].x,
				// 		y: results[i].y
				// 	})
				// }
				res.json(results)
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

module.exports = router
