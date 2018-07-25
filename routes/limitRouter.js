const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const http = require('http')
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
	let sql = `SELECT limit_id, DATE_FORMAT(session_date, '%Y-%m-%d') as session_date, st.station_name,
		sr.role_name, booking_limit FROM booking_limit b, stations st, station_roles sr 
		WHERE b.station_id = st.station_id AND b.role_id = sr.role_id; `
	sql += `SELECT DISTINCT DATE_FORMAT(session_date, '%Y-%m-%d') as session_date FROM booking_limit;`
	pool.getConnection().then(function(connection) {
		connection.query(sql)
		.then(results => {
			res.json(results)
		})
		connection.release()
	})
})
.post((req, res) => {
	let form = req.body
	console.log(form.date)
	// let sql = `INSERT INTO booking_limit (session_date, station_id, role_id, booking_limit) VALUES ?`
	// let formVal = [[form.date, form.stationId, form.roleId, parseInt(form.limit)]]
	// console.log(formVal)
	// pool.getConnection().then(function(connection) {
	// 	connection.query(sql, [formVal])
	// 	.then(results => {
	// 		res.json(results)
	// 	})
	// 	connection.release()
	// })
})

router.route('/:limitID')
.all((req, res, next) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	next() //Continue on to the next method -> .get(...)
})
.get((req, res) => {
	let sql = `SELECT b.* FROM booking_limit b WHERE limit_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, req.params.limitID)
		.then(results => {
			res.json(results)
		})
		connection.release()
	})
})
.put((req, res) => {
	let sql = `UPDATE booking_limit SET session_date = ?, booking_limit = ? WHERE limit_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, req.params.limitID)
		.then(results => {
			res.json(results)
		})
		connection.release()
	})
})
.delete((req, res) => {
	let sql = `DELETE FROM booking_limit WHERE limit_id = ?`
	pool.getConnection().then(function(connection) {
		connection.query(sql, req.params.limitID)
		.then(results => {
			res.json(results)
		})
		connection.release()
	})
})

module.exports = router
