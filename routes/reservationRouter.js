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
	let sql = `SELECT reservation_id, DATE_FORMAT(session_date, '%Y-%m-%d') as session_date, station_name, role_name,
	TIME_FORMAT(reservedFrom, '%H:%i') as reservedFrom, TIME_FORMAT(reservedTo, '%H:%i') as reservedTo, 
	remarks FROM reservations r
	INNER JOIN stations st ON st.station_id = r.station_id
	INNER JOIN station_roles sr ON sr.role_id = r.role_id;`
	sql += `SELECT DISTINCT DATE_FORMAT(session_date, '%Y-%m-%d') as session_date FROM reservations;`

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
.post((req, res) => {
	let resData = req.body
	let sql = `SELECT DATE_FORMAT(session_date, '%e %b %Y') as session_date, 
	TIME_FORMAT(reservedFrom, '%H:%i') as reservedFrom, TIME_FORMAT(reservedTo, '%H:%i') as reservedTo, 
	sr.role_name FROM reservations r
	INNER JOIN station_roles sr ON sr.role_id = r.role_id
	WHERE session_date = current_date() AND r.role_id = ${resData.roleId} 
	AND (('${resData.reservedFrom}' >= reservedFrom AND '${resData.reservedFrom}' < reservedTo)
  OR ('${resData.reservedTo}' > reservedFrom AND '${resData.reservedTo}' <= reservedTo)
	OR ('${resData.reservedFrom}' <= reservedFrom AND '${resData.reservedTo}' >= reservedTo))
  LIMIT 1;`

	// console.log(resVal)
	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				if (results.length > 0) {
					return Promise.reject(`A reservation has already been made for the role '${results[0].role_name}'
					from ${results[0].reservedFrom} to ${results[0].reservedTo} on ${results[0].session_date}`)
				}
				else {
					sql = `INSERT INTO reservations (session_date, station_id, role_id, 
						reservedFrom, reservedTo, remarks) VALUES ?;`
					let resVal = [[ resData.date, resData.stationId, resData.roleId, 
						resData.reservedFrom, resData.reservedTo, resData.remarks ]]
					return connection.query(sql, [resVal])
				}
			})
			.then(() => {
				res.end()
			})
			.catch(err => {
				console.log(err)
				if (err.errno) {
					res.status(400).json({message: 'Internal Server Error. Please Contact Administrator'})
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
	let sql = `SELECT * FROM reservations WHERE reservation_id = ${req.params.reservationID};`

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
	let sql = `SELECT DATE_FORMAT(session_date, '%e %b %Y') as session_date, 
	TIME_FORMAT(reservedFrom, '%H:%i') as reservedFrom, TIME_FORMAT(reservedTo, '%H:%i') as reservedTo, 
	sr.role_name FROM reservations r
	INNER JOIN station_roles sr ON sr.role_id = r.role_id
	WHERE session_date = current_date() AND r.role_id = ${resData.roleId} 
	AND reservation_id != ${req.params.reservationID}
	AND (('${resData.reservedFrom}' >= reservedFrom AND '${resData.reservedFrom}' <= reservedTo)
  OR ('${resData.reservedTo}' > reservedFrom AND '${resData.reservedTo}' <= reservedTo)
	OR ('${resData.reservedFrom}' <= reservedFrom AND '${resData.reservedTo}' >= reservedTo))
  LIMIT 1;`

	pool.getConnection().then(function(connection) {
		connection.query(sql)
			.then(results => {
				if (results.length > 0) {
					return Promise.reject(`A reservation has already been made for the role '${results[0].role_name}'
					from ${results[0].reservedFrom} to ${results[0].reservedTo} on ${results[0].session_date}`)
				} else {
					sql = `UPDATE reservations SET session_date=?, station_id=?, role_id=?, 
						reservedFrom=?, reservedTo=?, remarks=? WHERE reservation_id = ${req.params.reservationID};`
					let resVal = [ resData.date, resData.stationId, resData.roleId, 
						resData.reservedFrom, resData.reservedTo, resData.remarks ]
					console.log(resVal)
					return connection.query(sql, resVal)
				}
			})
			.then(results => {
				res.json(results)
			})
			.catch((err) => {
				if (err.errno) {
					console.log(err)
					res.status(400).json({message: 'Internal Server Error. Please Contact Administrator'})
				} else {
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