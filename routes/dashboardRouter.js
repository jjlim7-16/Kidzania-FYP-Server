const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const Excel = require('exceljs')
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
	let sql = `SELECT COUNT(booking_id) as count FROM booking_details 
	WHERE session_date=current_date()
	AND booking_status != 'Cancelled';`
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
	WHERE booking_status!='Cancelled' AND session_date=current_date() 
	GROUP BY rfid) x;`
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				if (!results[0].avg_bookings) {
					res.json(0.0.toFixed(1))
				}
				else {
					res.json(parseInt(results[0].avg_bookings).toFixed(1))
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
	FROM (SELECT DISTINCT session_date FROM booking_details WHERE booking_status != 'Cancelled') a
	GROUP BY WEEKDAY(session_date)) b2 ON b2.weekday = WEEKDAY(session_date)
	WHERE booking_status != 'Cancelled' GROUP BY weekday;`

	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				// res.json(results)
				let data = [0, 0, 0, 0, 0, 0, 0]
				for (var i in results) {
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

router.get('/getBookingByStation', (req, res) => {
	let sql = `SELECT st.station_name, COUNT(b.booking_id) as station_count
	FROM (SELECT COUNT(*) as total FROM booking_details) t,
	(SELECT * FROM booking_details WHERE booking_status!='Cancelled') b
	RIGHT JOIN stations st ON b.station_id = st.station_id
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
	FROM (SELECT * FROM booking_details WHERE booking_status!='Cancelled' AND session_date = current_date()) b
	RIGHT JOIN sessions s ON s.session_id = b.session_id
	RIGHT JOIN stations st ON s.station_id = st.station_id
	GROUP BY st.station_id, session_start;`
	
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				let data = {}
				for (i in results) {
					if (!data[results[i].station_name]) {
						data[results[i].station_name] = []
					}
					data[results[i].station_name].push({
						x: results[i].x,
						y: results[i].y
					})
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

router.get('/generateReport', (req, res) => {
	let sql = `SELECT b.session_date, COUNT(booking_id) as total_count, cancel_count, admission_count
	FROM booking_details b, (SELECT COUNT(booking_id) as cancel_count
	FROM booking_details b WHERE session_date=current_date() AND booking_status = 'Cancelled') x,
	(SELECT COUNT(booking_id) as admission_count
	FROM booking_details b WHERE session_date=current_date() AND booking_status = 'Admitted') n,
	(SELECT rfid, COUNT(*) as bookings FROM booking_details
	WHERE booking_status!='Cancelled' AND session_date=current_date()
	GROUP BY rfid) a
	WHERE session_date = current_date() AND booking_status != 'Cancelled';`
	sql += `Select booking_id, b.session_date, se.session_start, se.session_end, st.station_name,
	sr.role_name From booking_details b, sessions se, stations st, station_roles sr
	where b.session_id = se.session_id and b.station_id = st.station_id and b.session_date='2018-08-07' and
	st.station_id = sr.station_id and sr.role_id = b.role_id;`
	pool.getConnection().then(function (connection) {
		connection.query(sql)
			.then(results => {
				let report = Object.values(results[0][0])
				let workbook = new Excel.Workbook()
				workbook.xlsx.readFile('./report.xlsx')
				.then(function() {
					let worksheet1 = workbook.getWorksheet('Daily Report')
					let worksheet2 = workbook.getWorksheet('Booking Details')
					worksheet1.addRows([report])
					for (i in results[1]) {
						worksheet2.addRow(Object.values(results[1][i]))
					}
					workbook.xlsx.writeFile('./report.xlsx')
					.then(function() {
						console.log('File Written')
					})
				})
				.catch(err => {
					console.log(err)
				})
				res.end('Report Generated Successfully')
			})
			.catch(err => {
				res.statusMessage = err
				res.status(400).end(err.code)
			})
		connection.release()
	})
})

module.exports = router
