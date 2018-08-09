const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('../src/databasePool')
const pool = db.getPool()

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
	let sql = `SELECT reservation_id, DATE_FORMAT(r.session_date, '%Y-%m-%d') as session_date, station_name, role_name,
	TIME_FORMAT(session_start, '%H:%i') as reservedFrom, TIME_FORMAT(session_end, '%H:%i') as reservedTo, 
	noOfReservedSlots, remarks FROM reservations r
	INNER JOIN sessions ss ON ss.session_id = r.session_id
	INNER JOIN stations st ON st.station_id = ss.station_id
	INNER JOIN station_roles sr ON sr.role_id = ss.role_id;`
	sql += `SELECT DISTINCT DATE_FORMAT(session_date, '%Y-%m-%d') as session_date FROM reservations;`

	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				res.json(results)
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
			connection.release()
	})
})
.post((req, res) => {
	let resData = req.body
	let sql = `INSERT INTO reservations (session_date, session_id, noOfReservedSlots, remarks)
	SELECT ${resData.date}, session_id, ${resData.noOfRSlots}, ${resData.remarks} FROM sessions
	WHERE role_id = ${resData.role_id} AND session_id = ${resData.session_id};`

	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				res.status(200).end()
			})
			.catch(err => {
				if (err.sqlState === '45000') {
					console.log(err)
					res.status(400).json({message: err.sqlMessage})
				} else {
					res.status(400).json({message: err})
				}
			})
			connection.release()
	})
})

router.get('/getSessionList/:roleID', (req, res) => {
	let sql = `SELECT * FROM sessions WHERE role_id = ?`

	pool.getConnection().then(function(connection) {
		connection.query(sql, [parseInt(req.params.roleID)])
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

router.route('/:reservationID')
.all((req, res, next) => {
  res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = `SELECT r.*, station_id, role_id FROM reservations r
	INNER JOIN sessions ss ON ss.session_id = r.session_id
	WHERE reservation_id = ${req.params.reservationID};`

	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				console.log(results)
				res.json(results)
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
			connection.release()
	})
})
.put((req, res) => {
	let resData = req.body
	let sql = `UPDATE reservations SET session_date=?, session_id=?, 
	noOfReservedSlots=?, remarks=?
	WHERE reservation_id = ${req.params.reservationID};`
	
	let resVal = [resData.date, resData.session_id, resData.noOfRSlots, resData.remarks]

	pool.getConnection().then(function(connection) {
		connection.query(sql, resVal)
			.then(() => {
				res.status(200).end()
			})
			.catch(err => {
				if (err.sqlState === '45000') {
					res.status(400).json({message: err.sqlMessage})
				} else {
					console.log(err)
					res.status(400).json({message: err})
				}
			})
			connection.release()
	})
})
.delete((req, res) => {
	let sql = `DELETE FROM reservations WHERE reservation_id=${req.params.reservationID}`

	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				res.json(results)
			})
			.catch((err) => {
				res.statusMessage = err
				res.status(400).end()
			})
			connection.release()
	})
})

module.exports = router