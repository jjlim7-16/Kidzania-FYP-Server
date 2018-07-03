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
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	let sql = `SELECT a.session_id, session_start, session_end, sr.capacity, a.noBooked 
		FROM sessions s, available_sessions a, station_roles sr WHERE s.session_id = a.session_id 
		AND a.role_id = s.role_id AND sr.role_id = a.role_id AND a.role_id = ? 
		AND a.session_date = current_date() ORDER BY 2 ASC`
	
	let val = [parseInt(req.params.roleID)]
	pool.getConnection().then(function (connection) {
		connection.query(sql, val)
		.then((rows) => {
			//res.json(rows)
			// console.log(moment(rows[0].session_date).format('YYYY-MM-DD'))
			let duration = moment(rows[0].session_start, 'HH:mm').diff(moment(rows[0].session_end,'HH:mm'))

			time = moment(time, 'HH:mm')
			if (time.minutes() >= 30) {
				time.add(1,'hour')
				time.minutes(0)
			}

			let session_list = []
			for (i=0; i<rows.length; i+=6) {
				let session_start = moment(rows[i].session_start, 'HH:mm')
				if (time.isSameOrAfter(session_start) && time.isBefore(session_start.add(duration, 'minutes'))) {
					for (j=i; j<i+6, j<rows.length; j++) {
						session_list.push(rows[j])
					}
					break
				}
			}
			res.json(session_list)
		})
		connection.release()
	})
})

module.exports = router