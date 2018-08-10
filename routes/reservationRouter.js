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
	INNER JOIN available_sessions av ON av.session_date = r.session_date
	INNER JOIN sessions ss ON av.session_id = ss.session_id AND ss.session_id = r.session_id
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
	SELECT current_date(), session_id, ${resData.noOfRSlots}, 'Birthday Party' FROM sessions
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

router.get('/getCurrentReservation/:stationID', (req, res) => {
	let sql = `select  s.station_name,r.session_date,se.session_start,se.session_end,sr.role_id,sr.role_name, r.noOfReservedSlots from reservations r
inner join sessions se on se.session_id = r.session_id 
inner join station_roles sr on se.role_id = sr.role_id 
inner join stations s on s.station_id = se.station_id
where s.station_id = ? and r.session_date = current_date()
AND ADDTIME(current_time(), '0:5:00') >= se.session_start
AND ADDTIME(current_time(), '0:5:00') < se.session_end`;

	pool.getConnection().then(function (connection) {
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