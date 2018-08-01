const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()
// Re-uses existing if already created, else creates a new one

const router = express.Router()
router.use(bodyParser.urlencoded( {
	limit:'50mb',
	extended:true,
	parameterLimit:100000
}))
router.use(bodyParser.json( {
	limit:'50mb'
}))

router.options('*', cors())
router.use(cors())

router.route('/')
	.all((req, res, next) =>  {
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/plain')
		next()//Continue on to the next method -> .get(...)
	})
	.get((req, res) =>  {
		let sql = `Select * From sessions`
		pool.getConnection().then(function (connection) {
			connection.query(sql)
				.then(results =>  {
					res.json(results)
				})
				.catch(err =>  {
					res.statusMessage = err
					res.status(400).end()
				})
			connection.release()
		})
	})

router.get('/getSessionList/:roleID', (req, res) =>  {
	// Get Today's Date & Time
	let date = new Date()
	let time = date.getHours() + ':' + date.getMinutes()
	time = "13:00"
	date = date.getFullYear() + ' - ' + (date.getMonth() + 1) + ' - ' + date.getDate()
	let sql = `SELECT a.session_id, session_start, session_end, sr.capacity, a.noBooked
		FROM sessions s, available_sessions a, station_roles sr WHERE s.session_id = a.session_id
		AND a.role_id = s.role_id AND sr.role_id = a.role_id AND a.role_id = ?
		AND a.session_date = current_date() ORDER BY 2 ASC`

		pool.getConnection().then(function(connection) {
		connection.query(sql, [parseInt(req.params.roleID)])
			.then((rows) => {
				for(let timeSlot of rows) {
					timeSlot.session_start = moment(timeSlot.session_start, 'HH:mm:ss').format('LT')
					timeSlot.session_end = moment(timeSlot.session_end, 'HH:mm:ss').format('LT')
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

router.get('/nextSession/:stationID', (req, res) => {
	// let sql = `SELECT distinct session_start, session_end FROM sessions
	// WHERE station_id = ? AND current_time() <= ADDTIME(session_start,'0:5:00')
	// order by session_start asc limit 1`
	let sql = `SELECT distinct session_start, session_end FROM sessions
	WHERE station_id = ? AND Time('14:20:00') <= ADDTIME(session_start,'0:5:00')
	order by session_start asc limit 1`

	pool.getConnection().then(function (connection) {
		connection.query(sql, parseInt(req.params.stationID))
			.then((rows) => {
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

	pool.getConnection().then(function(connection) {
		connection.query(sql, [parseInt(req.params.stationID)])
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

module.exports = router
