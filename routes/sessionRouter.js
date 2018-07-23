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
		let sql = `Select * From sessions`
		pool.getConnection().then(function(connection) {
			connection.query(sql)
				.then(results => {
					res.json(results)
				})
			connection.release()
		})
	})



router.get('/:stationID/:roleID', (req, res) => {
	// Get Today's Date & Time
	let date = new Date()
	let time = date.getHours() + ':' + date.getMinutes()
	time = "13:00"
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let sql = `SELECT a.session_id, session_start, session_end, sr.capacity, a.noBooked
		FROM sessions s, available_sessions a, station_roles sr WHERE s.session_id = a.session_id
		AND a.role_id = s.role_id AND sr.role_id = a.role_id AND a.role_id = ?
		AND a.session_date = current_date() ORDER BY 2 ASC`
	let val = [parseInt(req.params.roleID)]
	pool.getConnection().then(function(connection) {
		connection.query(sql, val)
			.then((rows) => {
				//res.json(rows)
				// console.log(moment(rows[0].session_date).format('YYYY-MM-DD'))
				// let duration = moment(rows[0].session_end, 'HH:mm:ss').diff(moment(rows[0].session_start, 'HH:mm:ss'), 'minutes')
				// time = moment(time, "HH:mm:ss")
				// if (time.minutes() >= 30) {
				// 	time.add(1, 'hour')
				// 	time.minutes(0)
				// }
				// let session_list = []
				// for (i = 0; i < rows.length; i += 6) {
				// 	let session_start = moment(rows[i].session_start, 'HH:mm:ss')
				// 	if (time.isSameOrAfter(session_start) && time.isBefore(session_start.add(duration, 'minutes'))) {
				// 		for (j = i; j < i + 6; j++) {
				// 			rows[j].session_start = moment(rows[j].session_start, 'HH:mm:ss').format('LT')
				// 			rows[j].session_end = moment(rows[j].session_end, 'HH:mm:ss').format('LT')
				// 			session_list.push(rows[j])
				// 		}
				// 		break
				// 	}
				// }
				for(let timeSlot of rows) {
					timeSlot.session_start = moment(timeSlot.session_start, 'HH:mm:ss').format('LT')
					timeSlot.session_end = moment(timeSlot.session_end, 'HH:mm:ss').format('LT')
				}
				res.json(rows)
			})
		connection.release()
	})
})

router.get('/:stationID', (req, res) => {

	let sql = `Select a.session_id, s.session_start, s.session_end, s.role_id, s.capacity
	from available_sessions a, sessions s
	where a.session_id = s.session_id and
	 a.station_id = ? and session_date = current_date()`
	let stationID = [parseInt(req.params.stationID)]
	pool.getConnection().then(function(connection) {
		connection.query(sql, stationID)
			.then((rows) => {
				res.json(rows)
			})
		connection.release()
	})
})

module.exports = router
